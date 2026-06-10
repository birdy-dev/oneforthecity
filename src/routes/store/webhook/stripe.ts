import { createFileRoute } from "@tanstack/react-router";
import Stripe from "stripe";

import { createPaidOrderFromCheckoutSession } from "@/utils/stripe_orders";
import { STRIPE_STORE_SESSION_SOURCE } from "@/utils/stripe_store";

export const Route = createFileRoute("/store/webhook/stripe")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

        if (!stripeSecretKey || !webhookSecret) {
          return json({ error: "Stripe webhook is not configured." }, { status: 500 });
        }

        const signature = request.headers.get("stripe-signature");

        if (!signature) {
          return json({ error: "Missing Stripe signature." }, { status: 400 });
        }

        const stripe = new Stripe(stripeSecretKey);
        const rawBody = await request.text();
        let event: Stripe.Event;

        try {
          event = await stripe.webhooks.constructEventAsync(rawBody, signature, webhookSecret);
        } catch (error) {
          return json(
            { error: error instanceof Error ? error.message : "Invalid Stripe webhook signature." },
            { status: 400 },
          );
        }

        if (event.type !== "checkout.session.completed") {
          return json({ received: true, ignored: true });
        }

        const session = event.data.object as Stripe.Checkout.Session;

        if (session.metadata?.source !== STRIPE_STORE_SESSION_SOURCE) {
          return json({ received: true, ignored: true, reason: "unrecognized_checkout_session" });
        }

        const result = await createPaidOrderFromCheckoutSession(session);

        return json({ received: true, ...result });
      },
    },
  },
});

function json(data: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "content-type": "application/json",
      ...init?.headers,
    },
  });
}
