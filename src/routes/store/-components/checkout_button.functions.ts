import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import Stripe from "stripe";
import { z } from "zod";

import { getInventoryRows } from "@/utils/store_inventory";
import { STRIPE_STORE_SESSION_SOURCE } from "@/utils/stripe_store";
import { getUnavailableInventoryMessage } from "./checkout_inventory";
import { getPresaleCheckoutExpiration, getStripeCheckoutIdempotencyKey } from "./checkout_policy";
import { getProductById, hasProductSize } from "./products";

const checkoutCartItemSchema = z.object({
  productId: z.string().trim().min(1),
  quantity: z.number().int().min(1).max(20),
  size: z.string().trim().min(1),
});

function getStripeImageOrigin(requestOrigin: string) {
  if (process.env.STRIPE_IMAGE_ORIGIN) {
    return process.env.STRIPE_IMAGE_ORIGIN;
  }

  const { hostname, protocol } = new URL(requestOrigin);

  if (protocol !== "https:" || hostname === "localhost" || hostname === "127.0.0.1") {
    return "https://oneforthecity.com";
  }

  return requestOrigin;
}

function getStripeImagePath(image: string) {
  if (image.includes("vol6_front")) {
    return "/store/vol6_front.png";
  }

  if (image.includes("vol6_back")) {
    return "/store/vol6_back.png";
  }

  return image;
}

function getAbsoluteImageUrl(image: string, imageOrigin: string) {
  return new URL(getStripeImagePath(image), imageOrigin).toString();
}

const createCheckoutSessionInputSchema = z.object({
  checkoutAttemptId: z.uuid(),
  cartItems: z
    .array(checkoutCartItemSchema)
    .min(1, {
      message: "Your cart is empty.",
    })
    .max(50),
});

export const createCheckoutSession = createServerFn({ method: "POST" })
  .validator(createCheckoutSessionInputSchema)
  .handler(async ({ data }) => {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey) {
      throw new Error("Missing STRIPE_SECRET_KEY environment variable.");
    }

    const { cartItems, checkoutAttemptId } = data;
    const { origin } = new URL(getRequest().url);
    const stripeImageOrigin = getStripeImageOrigin(origin);
    const inventory = await getInventoryRows();
    const requestedQuantities = new Map<string, number>();

    for (const item of cartItems) {
      const key = `${item.productId}::${item.size}`;
      requestedQuantities.set(key, (requestedQuantities.get(key) ?? 0) + item.quantity);
    }

    const inventoryError = getUnavailableInventoryMessage(
      inventory,
      Array.from(requestedQuantities, ([key, quantity]) => {
        const [productId, size] = key.split("::");
        return { productId, size, quantity };
      }),
    );

    if (inventoryError) {
      throw new Error(inventoryError);
    }

    const lineItems = cartItems.map((item) => {
      const product = getProductById(item.productId);

      if (!product || !hasProductSize(product, item.size)) {
        throw new Error("Your cart contains an unavailable item.");
      }

      return {
        price_data: {
          currency: product.currency.toLowerCase(),
          product_data: {
            name: `${product.name} - ${item.size}`,
            images: [getAbsoluteImageUrl(product.image, stripeImageOrigin)],
            metadata: {
              product_id: product.id,
              size: item.size,
            },
          },
          unit_amount: product.price,
        },
        quantity: item.quantity,
      };
    });

    const stripe = new Stripe(stripeSecretKey);
    // Check immediately before the Stripe request so slow inventory/database work cannot cross
    // the deadline and still create a payable session.
    const expiresAt = getPresaleCheckoutExpiration(Date.now());

    const session = await stripe.checkout.sessions.create(
      {
        mode: "payment",
        client_reference_id: checkoutAttemptId,
        expires_at: expiresAt,
        line_items: lineItems,
        metadata: {
          checkout_attempt_id: checkoutAttemptId,
          source: STRIPE_STORE_SESSION_SOURCE,
        },
        payment_method_types: ["card"],
        success_url: `${origin}/store/success`,
        cancel_url: `${origin}/store/cart`,
      },
      {
        idempotencyKey: getStripeCheckoutIdempotencyKey(checkoutAttemptId),
      },
    );

    if (!session.url) {
      throw new Error("Stripe did not return a checkout URL.");
    }

    return { sessionUrl: session.url };
  });
