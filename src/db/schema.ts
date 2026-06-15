import { relations } from "drizzle-orm";
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const inventoryStock = sqliteTable(
  "inventory_stock",
  {
    productId: text("product_id").notNull(),
    size: text("size").notNull(),
    baseQuantity: integer("base_quantity").notNull(),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [uniqueIndex("inventory_stock_product_size_idx").on(table.productId, table.size)],
);

export const inventoryAdjustments = sqliteTable(
  "inventory_adjustments",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    productId: text("product_id").notNull(),
    size: text("size").notNull(),
    delta: integer("delta").notNull(),
    reason: text("reason").notNull(),
    createdAt: text("created_at").notNull(),
  },
  (table) => [index("inventory_adjustments_product_size_idx").on(table.productId, table.size)],
);

export const inPersonSales = sqliteTable(
  "in_person_sales",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    productId: text("product_id").notNull(),
    size: text("size").notNull(),
    quantity: integer("quantity").notNull(),
    note: text("note"),
    createdAt: text("created_at").notNull(),
  },
  (table) => [index("in_person_sales_product_size_idx").on(table.productId, table.size)],
);

export const orders = sqliteTable(
  "orders",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    stripeSessionId: text("stripe_session_id").notNull(),
    stripePaymentIntentId: text("stripe_payment_intent_id"),
    customerEmail: text("customer_email").notNull(),
    customerName: text("customer_name"),
    fulfilled: integer("fulfilled", { mode: "boolean" }).notNull().default(false),
    paidAt: text("paid_at").notNull(),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [
    uniqueIndex("orders_stripe_session_id_idx").on(table.stripeSessionId),
    index("orders_customer_email_idx").on(table.customerEmail),
    index("orders_fulfilled_paid_at_idx").on(table.fulfilled, table.paidAt),
  ],
);

export const orderItems = sqliteTable(
  "order_items",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    orderId: integer("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    productId: text("product_id").notNull(),
    productName: text("product_name").notNull(),
    size: text("size").notNull(),
    quantity: integer("quantity").notNull(),
    unitAmount: integer("unit_amount").notNull(),
    currency: text("currency").notNull(),
  },
  (table) => [
    index("order_items_product_size_idx").on(table.productId, table.size),
    uniqueIndex("order_items_order_product_size_idx").on(
      table.orderId,
      table.productId,
      table.size,
    ),
  ],
);

export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
}));
