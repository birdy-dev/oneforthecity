import { and, desc, eq, inArray, sql } from "drizzle-orm";

import { getDb } from "@/db";
import {
  inventoryAdjustments,
  inventoryStock,
  inPersonSales,
  orderItems,
  orders,
} from "@/db/schema";
import {
  getCatalogStockQuantity,
  getCatalogStockRows,
  getProductById,
} from "@/routes/store/-components/products";

export type InventoryRow = {
  productId: string;
  productName: string;
  size: string;
  baseQuantity: number;
  adjustmentQuantity: number;
  stockQuantity: number;
  reservedOnline: number;
  onlineFulfilled: number;
  inPersonSold: number;
  remainingAvailable: number;
  oversold: boolean;
};

export type AdminOrder = {
  id: number;
  stripeSessionId: string;
  stripePaymentIntentId: string | null;
  customerEmail: string;
  customerName: string | null;
  fulfilled: boolean;
  paidAt: string;
  createdAt: string;
  items: AdminOrderItem[];
};

export type AdminOrderItem = {
  id: number;
  productId: string;
  productName: string;
  size: string;
  quantity: number;
  unitAmount: number;
  currency: string;
  oversold: boolean;
};

export type AdminDashboardData = {
  inventory: InventoryRow[];
  recentUnfulfilledOrders: AdminOrder[];
  searchResults: AdminOrder[];
};

type QuantityKey = `${string}::${string}`;

function getKey(productId: string, size: string): QuantityKey {
  return `${productId}::${size}`;
}

function addQuantity(
  map: Map<QuantityKey, number>,
  productId: string,
  size: string,
  quantity: number,
) {
  const key = getKey(productId, size);
  map.set(key, (map.get(key) ?? 0) + quantity);
}

function getProductName(productId: string) {
  return getProductById(productId)?.name ?? productId;
}

export async function getInventoryRows(): Promise<InventoryRow[]> {
  const db = getDb();
  const [stockRows, adjustmentRows, saleRows, itemRows] = await Promise.all([
    db.select().from(inventoryStock),
    db.select().from(inventoryAdjustments),
    db.select().from(inPersonSales),
    db
      .select({
        productId: orderItems.productId,
        size: orderItems.size,
        quantity: orderItems.quantity,
        fulfilled: orders.fulfilled,
      })
      .from(orderItems)
      .innerJoin(orders, eq(orderItems.orderId, orders.id)),
  ]);

  const base = new Map<QuantityKey, number>();
  const adjustments = new Map<QuantityKey, number>();
  const soldInPerson = new Map<QuantityKey, number>();
  const reservedOnline = new Map<QuantityKey, number>();
  const onlineFulfilled = new Map<QuantityKey, number>();
  const knownKeys = new Set<QuantityKey>();

  for (const row of getCatalogStockRows()) {
    knownKeys.add(getKey(row.productId, row.size));
  }

  for (const row of stockRows) {
    const key = getKey(row.productId, row.size);
    const catalogQuantity = getCatalogStockQuantity(row.productId, row.size);

    if (catalogQuantity !== null && catalogQuantity !== row.baseQuantity) {
      throw new Error(
        `Inventory seed mismatch for ${row.productId} ${row.size}: catalog has ${catalogQuantity}, database has ${row.baseQuantity}.`,
      );
    }

    knownKeys.add(key);
    base.set(key, row.baseQuantity);
  }

  for (const row of adjustmentRows) {
    knownKeys.add(getKey(row.productId, row.size));
    addQuantity(adjustments, row.productId, row.size, row.delta);
  }

  for (const row of saleRows) {
    knownKeys.add(getKey(row.productId, row.size));
    addQuantity(soldInPerson, row.productId, row.size, row.quantity);
  }

  for (const row of itemRows) {
    knownKeys.add(getKey(row.productId, row.size));
    addQuantity(
      row.fulfilled ? onlineFulfilled : reservedOnline,
      row.productId,
      row.size,
      row.quantity,
    );
  }

  return Array.from(knownKeys)
    .map((key) => {
      const [productId, size] = key.split("::");
      const baseQuantity = base.get(key) ?? 0;
      const adjustmentQuantity = adjustments.get(key) ?? 0;
      const stockQuantity = baseQuantity + adjustmentQuantity;
      const reservedQuantity = reservedOnline.get(key) ?? 0;
      const fulfilledQuantity = onlineFulfilled.get(key) ?? 0;
      const inPersonQuantity = soldInPerson.get(key) ?? 0;
      const remainingAvailable =
        stockQuantity - reservedQuantity - fulfilledQuantity - inPersonQuantity;

      return {
        productId,
        productName: getProductName(productId),
        size,
        baseQuantity,
        adjustmentQuantity,
        stockQuantity,
        reservedOnline: reservedQuantity,
        onlineFulfilled: fulfilledQuantity,
        inPersonSold: inPersonQuantity,
        remainingAvailable,
        oversold: remainingAvailable < 0,
      };
    })
    .sort((a, b) => {
      const productSort = a.productName.localeCompare(b.productName);
      if (productSort !== 0) return productSort;
      return getSizeSortValue(a.size) - getSizeSortValue(b.size);
    });
}

export async function getAdminDashboard(searchEmail?: string): Promise<AdminDashboardData> {
  const [inventory, recentUnfulfilledOrders, searchResults] = await Promise.all([
    getInventoryRows(),
    getOrders({ fulfilled: false, limit: 10 }),
    searchEmail ? getOrders({ email: searchEmail, limit: 25 }) : Promise.resolve([]),
  ]);

  return { inventory, recentUnfulfilledOrders, searchResults };
}

export async function getOrders(options: {
  email?: string;
  fulfilled?: boolean;
  limit: number;
}): Promise<AdminOrder[]> {
  const db = getDb();
  const emailSearch = options.email?.trim().toLowerCase();
  const where = [
    emailSearch
      ? sql`${orders.customerEmail} like ${`%${escapeLikePattern(emailSearch)}%`} escape '\\'`
      : undefined,
    typeof options.fulfilled === "boolean" ? eq(orders.fulfilled, options.fulfilled) : undefined,
  ].filter(Boolean);

  const orderRows = await db
    .select()
    .from(orders)
    .where(where.length === 0 ? undefined : where.length === 1 ? where[0] : and(...where))
    .orderBy(desc(orders.paidAt))
    .limit(options.limit);

  return hydrateOrders(orderRows);
}

function escapeLikePattern(value: string) {
  return value.replaceAll("\\", "\\\\").replaceAll("%", "\\%").replaceAll("_", "\\_");
}

export async function setOrderFulfilled(orderId: number, fulfilled: boolean) {
  const db = getDb();
  const now = new Date().toISOString();

  await db.update(orders).set({ fulfilled, updatedAt: now }).where(eq(orders.id, orderId));
}

export async function recordInPersonSale(input: {
  productId: string;
  size: string;
  quantity: number;
  note?: string;
}) {
  const inventory = await getInventoryRows();
  const row = inventory.find(
    (item) => item.productId === input.productId && item.size === input.size,
  );

  if (!row) {
    throw new Error("Inventory row was not found.");
  }

  if (input.quantity > row.remainingAvailable) {
    throw new Error("Not enough remaining inventory for that sale.");
  }

  await getDb()
    .insert(inPersonSales)
    .values({
      productId: input.productId,
      size: input.size,
      quantity: input.quantity,
      note: input.note || null,
      createdAt: new Date().toISOString(),
    });
}

export async function recordInventoryAdjustment(input: {
  productId: string;
  size: string;
  delta: number;
  reason: string;
}) {
  await getDb().insert(inventoryAdjustments).values({
    productId: input.productId,
    size: input.size,
    delta: input.delta,
    reason: input.reason,
    createdAt: new Date().toISOString(),
  });
}

async function hydrateOrders(orderRows: (typeof orders.$inferSelect)[]): Promise<AdminOrder[]> {
  if (orderRows.length === 0) return [];

  const db = getDb();
  const itemRows = await db
    .select()
    .from(orderItems)
    .where(
      inArray(
        orderItems.orderId,
        orderRows.map((order) => order.id),
      ),
    );
  const inventory = await getInventoryRows();
  const oversoldKeys = new Set(
    inventory.filter((row) => row.oversold).map((row) => getKey(row.productId, row.size)),
  );
  const itemsByOrderId = new Map<number, AdminOrderItem[]>();

  for (const item of itemRows) {
    const items = itemsByOrderId.get(item.orderId) ?? [];
    items.push({
      id: item.id,
      productId: item.productId,
      productName: item.productName,
      size: item.size,
      quantity: item.quantity,
      unitAmount: item.unitAmount,
      currency: item.currency,
      oversold: oversoldKeys.has(getKey(item.productId, item.size)),
    });
    itemsByOrderId.set(item.orderId, items);
  }

  return orderRows.map((order) => ({
    id: order.id,
    stripeSessionId: order.stripeSessionId,
    stripePaymentIntentId: order.stripePaymentIntentId,
    customerEmail: order.customerEmail,
    customerName: order.customerName,
    fulfilled: order.fulfilled,
    paidAt: order.paidAt,
    createdAt: order.createdAt,
    items: itemsByOrderId.get(order.id) ?? [],
  }));
}

function getSizeSortValue(size: string) {
  return ["XS", "S", "M", "L", "XL", "XXL"].indexOf(size.toUpperCase());
}
