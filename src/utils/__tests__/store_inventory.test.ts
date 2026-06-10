import Database from "better-sqlite3";
import { readFileSync } from "node:fs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { drizzle } from "drizzle-orm/better-sqlite3";

import {
  inventoryAdjustments,
  inPersonSales,
  orderItems,
  orders,
} from "@/db/schema";

const dbState = vi.hoisted(() => ({
  db: undefined as any,
  sqlite: undefined as Database.Database | undefined,
}));

vi.mock("@/db", () => ({
  getDb: () => dbState.db,
}));

import {
  getInventoryRows,
  getOrders,
  recordInPersonSale,
  setOrderFulfilled,
} from "@/utils/store_inventory";

const migrationSql = readFileSync(
  new URL("../../../drizzle/0000_store_admin.sql", import.meta.url),
  "utf8",
);

beforeEach(() => {
  dbState.sqlite = new Database(":memory:");
  dbState.sqlite.exec(migrationSql);
  dbState.db = drizzle(dbState.sqlite, {
    schema: { inventoryAdjustments, inPersonSales, orderItems, orders },
  });
});

afterEach(() => {
  dbState.sqlite?.close();
  dbState.sqlite = undefined;
  dbState.db = undefined;
});

describe("store inventory admin data", () => {
  it("calculates remaining inventory from seed stock, adjustments, online orders, and in-person sales", async () => {
    await insertOrder({
      stripeSessionId: "cs_reserved",
      fulfilled: false,
      paidAt: "2026-06-08T10:00:00.000Z",
      items: [{ productId: "vol-6-tee", size: "S", quantity: 2 }],
    });
    await insertOrder({
      stripeSessionId: "cs_fulfilled",
      fulfilled: true,
      paidAt: "2026-06-08T11:00:00.000Z",
      items: [{ productId: "vol-6-tee", size: "S", quantity: 1 }],
    });
    await dbState.db.insert(inPersonSales).values({
      productId: "vol-6-tee",
      size: "S",
      quantity: 1,
      note: "cash",
      createdAt: "2026-06-08T12:00:00.000Z",
    });
    await dbState.db.insert(inventoryAdjustments).values({
      productId: "vol-6-tee",
      size: "S",
      delta: -1,
      reason: "damaged",
      createdAt: "2026-06-08T13:00:00.000Z",
    });

    const rows = await getInventoryRows();
    const smallVol6 = rows.find((row) => row.productId === "vol-6-tee" && row.size === "S");

    expect(smallVol6).toMatchObject({
      baseQuantity: 5,
      adjustmentQuantity: -1,
      stockQuantity: 4,
      reservedOnline: 2,
      onlineFulfilled: 1,
      inPersonSold: 1,
      remainingAvailable: 0,
      oversold: false,
    });
  });

  it("prevents in-person sales from consuming inventory reserved by paid online orders", async () => {
    await insertOrder({
      stripeSessionId: "cs_reserved_all",
      fulfilled: false,
      items: [{ productId: "vol-6-tee", size: "S", quantity: 5 }],
    });

    await expect(
      recordInPersonSale({
        productId: "vol-6-tee",
        size: "S",
        quantity: 1,
      }),
    ).rejects.toThrow("Not enough remaining inventory");
  });

  it("moves orders out of the unfulfilled admin queue without changing inventory totals", async () => {
    const orderId = await insertOrder({
      stripeSessionId: "cs_to_fulfill",
      fulfilled: false,
      items: [{ productId: "classic-tee", size: "M", quantity: 3 }],
    });

    let rows = await getInventoryRows();
    let mediumClassic = rows.find(
      (row) => row.productId === "classic-tee" && row.size === "M",
    );
    expect(mediumClassic).toMatchObject({
      reservedOnline: 3,
      onlineFulfilled: 0,
      remainingAvailable: 27,
    });
    expect(await getOrders({ fulfilled: false, limit: 10 })).toHaveLength(1);

    await setOrderFulfilled(orderId, true);

    rows = await getInventoryRows();
    mediumClassic = rows.find((row) => row.productId === "classic-tee" && row.size === "M");
    expect(mediumClassic).toMatchObject({
      reservedOnline: 0,
      onlineFulfilled: 3,
      remainingAvailable: 27,
    });
    expect(await getOrders({ fulfilled: false, limit: 10 })).toHaveLength(0);
  });

  it("escapes wildcard characters in admin email search", async () => {
    await insertOrder({
      stripeSessionId: "cs_literal_percent",
      customerEmail: "buyer%literal@example.com",
      paidAt: "2026-06-08T10:00:00.000Z",
    });
    await insertOrder({
      stripeSessionId: "cs_normal",
      customerEmail: "normal@example.com",
      paidAt: "2026-06-08T11:00:00.000Z",
    });

    const results = await getOrders({ email: "%", limit: 25 });

    expect(results).toHaveLength(1);
    expect(results[0]?.customerEmail).toBe("buyer%literal@example.com");
  });
});

async function insertOrder(input: {
  stripeSessionId: string;
  customerEmail?: string;
  fulfilled?: boolean;
  paidAt?: string;
  items?: { productId: string; size: string; quantity: number }[];
}) {
  const [order] = await dbState.db
    .insert(orders)
    .values({
      stripeSessionId: input.stripeSessionId,
      stripePaymentIntentId: `${input.stripeSessionId}_pi`,
      customerEmail: input.customerEmail ?? "shopper@example.com",
      customerName: "Shopper",
      fulfilled: input.fulfilled ?? false,
      paidAt: input.paidAt ?? "2026-06-08T09:00:00.000Z",
      createdAt: "2026-06-08T09:00:00.000Z",
      updatedAt: "2026-06-08T09:00:00.000Z",
    })
    .returning({ id: orders.id });

  if (!order) throw new Error("Test order was not created.");

  const itemValues = (input.items ?? []).map((item) => ({
    orderId: order.id,
    productId: item.productId,
    productName: item.productId,
    size: item.size,
    quantity: item.quantity,
    unitAmount: 2999,
    currency: "CAD",
  }));

  if (itemValues.length > 0) {
    await dbState.db.insert(orderItems).values(itemValues);
  }

  return order.id;
}
