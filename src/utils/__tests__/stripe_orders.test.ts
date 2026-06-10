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

const stripeState = vi.hoisted(() => ({
  listLineItems: vi.fn(),
}));

vi.mock("@/db", () => ({
  getDb: () => dbState.db,
}));

vi.mock("stripe", () => ({
  default: vi.fn(() => ({
    checkout: {
      sessions: {
        listLineItems: stripeState.listLineItems,
      },
    },
  })),
}));

import { createPaidOrderFromCheckoutSession } from "@/utils/stripe_orders";

const migrationSql = readFileSync(
  new URL("../../../drizzle/0000_store_admin.sql", import.meta.url),
  "utf8",
);

beforeEach(() => {
  process.env.STRIPE_SECRET_KEY = "sk_test_store";
  stripeState.listLineItems.mockReset();
  dbState.sqlite = new Database(":memory:");
  dbState.sqlite.exec(migrationSql);
  dbState.db = drizzle(dbState.sqlite, {
    schema: { inventoryAdjustments, inPersonSales, orderItems, orders },
  });
});

afterEach(() => {
  delete process.env.STRIPE_SECRET_KEY;
  dbState.sqlite?.close();
  dbState.sqlite = undefined;
  dbState.db = undefined;
});

describe("Stripe store order creation", () => {
  it("ignores checkout sessions that have not been paid", async () => {
    const result = await createPaidOrderFromCheckoutSession({
      id: "cs_unpaid",
      payment_status: "unpaid",
    } as any);

    expect(result).toEqual({ created: false, reason: "not_paid" });
    expect(stripeState.listLineItems).not.toHaveBeenCalled();
    expect(await dbState.db.select().from(orders)).toHaveLength(0);
  });

  it("creates one normalized order and item set for a paid checkout session", async () => {
    stripeState.listLineItems.mockResolvedValue({
      data: [
        {
          id: "li_1",
          quantity: 2,
          price: {
            unit_amount: 2999,
            currency: "cad",
            product: {
              metadata: {
                product_id: "vol-6-tee",
                size: "M",
              },
            },
          },
        },
      ],
    });

    const result = await createPaidOrderFromCheckoutSession({
      id: "cs_paid",
      payment_status: "paid",
      created: 1_786_120_000,
      payment_intent: "pi_paid",
      customer_details: {
        email: " Buyer@Example.COM ",
        name: "Buyer Name",
      },
    } as any);

    expect(result).toMatchObject({ created: true, orderId: expect.any(Number) });

    const orderRows = await dbState.db.select().from(orders);
    expect(orderRows).toHaveLength(1);
    expect(orderRows[0]).toMatchObject({
      stripeSessionId: "cs_paid",
      stripePaymentIntentId: "pi_paid",
      customerEmail: "buyer@example.com",
      customerName: "Buyer Name",
      fulfilled: false,
      paidAt: "2026-08-09T18:26:40.000Z",
    });

    const itemRows = await dbState.db.select().from(orderItems);
    expect(itemRows).toHaveLength(1);
    expect(itemRows[0]).toMatchObject({
      orderId: orderRows[0]?.id,
      productId: "vol-6-tee",
      productName: "Vol.6 Limited Edition Tee",
      size: "M",
      quantity: 2,
      unitAmount: 2999,
      currency: "CAD",
    });
  });

  it("deduplicates repeated paid webhooks for the same Stripe session", async () => {
    stripeState.listLineItems.mockResolvedValue({
      data: [
        {
          id: "li_1",
          quantity: 1,
          price: {
            unit_amount: 2499,
            currency: "cad",
            product: {
              metadata: {
                product_id: "classic-tee",
                size: "L",
              },
            },
          },
        },
      ],
    });
    const session = {
      id: "cs_duplicate",
      payment_status: "paid",
      created: 1_786_120_000,
      payment_intent: "pi_duplicate",
      customer_email: "buyer@example.com",
    } as any;

    const firstResult = await createPaidOrderFromCheckoutSession(session);
    const secondResult = await createPaidOrderFromCheckoutSession(session);

    expect(firstResult).toMatchObject({ created: true });
    expect(secondResult).toEqual({ created: false, reason: "duplicate" });
    expect(await dbState.db.select().from(orders)).toHaveLength(1);
    expect(await dbState.db.select().from(orderItems)).toHaveLength(1);
  });

  it("rejects line items without product metadata before writing an order", async () => {
    stripeState.listLineItems.mockResolvedValue({
      data: [
        {
          id: "li_missing_metadata",
          quantity: 1,
          price: {
            unit_amount: 2499,
            currency: "cad",
            product: {
              metadata: {},
            },
          },
        },
      ],
    });

    await expect(
      createPaidOrderFromCheckoutSession({
        id: "cs_bad_metadata",
        payment_status: "paid",
        created: 1_786_120_000,
        customer_email: "buyer@example.com",
      } as any),
    ).rejects.toThrow("missing product metadata");

    expect(await dbState.db.select().from(orders)).toHaveLength(0);
    expect(await dbState.db.select().from(orderItems)).toHaveLength(0);
  });
});
