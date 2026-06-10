import { eq } from "drizzle-orm";
import Stripe from "stripe";

import { getDb } from "@/db";
import { orderItems, orders } from "@/db/schema";
import { getProductById } from "@/routes/store/-components/products";

type StripeOrderLineItem = {
  productId: string;
  productName: string;
  size: string;
  quantity: number;
  unitAmount: number;
  currency: string;
};

export async function createPaidOrderFromCheckoutSession(session: Stripe.Checkout.Session) {
  if (session.payment_status !== "paid") {
    return { created: false, reason: "not_paid" };
  }

  const customerEmail = session.customer_details?.email ?? session.customer_email;

  if (!customerEmail) {
    throw new Error(`Stripe session ${session.id} is missing customer email.`);
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    throw new Error("Missing STRIPE_SECRET_KEY environment variable.");
  }

  const stripe = new Stripe(stripeSecretKey);
  const lineItems = await getCheckoutLineItems(stripe, session.id);
  const now = new Date().toISOString();
  const paidAt = new Date(session.created * 1000).toISOString();
  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id;
  const db = getDb();

  return db.transaction(async (tx) => {
    const existingOrder = await tx
      .select({ id: orders.id })
      .from(orders)
      .where(eq(orders.stripeSessionId, session.id))
      .limit(1);

    if (existingOrder.length > 0) {
      return { created: false, reason: "duplicate" };
    }

    const insertedOrder = await tx
      .insert(orders)
      .values({
        stripeSessionId: session.id,
        stripePaymentIntentId: paymentIntentId ?? null,
        customerEmail: customerEmail.trim().toLowerCase(),
        customerName: session.customer_details?.name ?? null,
        fulfilled: false,
        paidAt,
        createdAt: now,
        updatedAt: now,
      })
      .returning({ id: orders.id });

    const orderId = insertedOrder[0]?.id;

    if (!orderId) {
      throw new Error("Unable to create order.");
    }

    await tx.insert(orderItems).values(
      lineItems.map((item) => ({
        orderId,
        productId: item.productId,
        productName: item.productName,
        size: item.size,
        quantity: item.quantity,
        unitAmount: item.unitAmount,
        currency: item.currency,
      })),
    );

    return { created: true, orderId };
  });
}

async function getCheckoutLineItems(stripe: Stripe, sessionId: string) {
  const stripeLineItems = await stripe.checkout.sessions.listLineItems(sessionId, {
    expand: ["data.price.product"],
    limit: 100,
  });

  return stripeLineItems.data.map((lineItem): StripeOrderLineItem => {
    const product = lineItem.price?.product;
    const metadata =
      product && typeof product === "object" && !("deleted" in product)
        ? product.metadata
        : undefined;
    const productId = metadata?.product_id;
    const size = metadata?.size;

    if (!productId || !size) {
      throw new Error(`Stripe line item ${lineItem.id} is missing product metadata.`);
    }

    const productConfig = getProductById(productId);

    return {
      productId,
      productName: productConfig?.name ?? lineItem.description ?? productId,
      size,
      quantity: lineItem.quantity ?? 1,
      unitAmount: lineItem.price?.unit_amount ?? productConfig?.price ?? 0,
      currency: (lineItem.price?.currency ?? productConfig?.currency ?? "cad").toUpperCase(),
    };
  });
}
