import { createFileRoute } from "@tanstack/react-router";
import Stripe from "stripe";

const STRIPE_WEBHOOK_URL = "https://oneforthecity.com/store/webhook/stripe";

export const Route = createFileRoute("/store/health")({
  server: {
    handlers: {
      GET: async () => {
        const secretKey = process.env.STRIPE_SECRET_KEY;
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
        const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
        const checks = {
          publishableKeyLive: publishableKey?.startsWith("pk_live_") ?? false,
          secretKeyLive: secretKey?.startsWith("sk_live_") ?? false,
          stripeApiReachable: false,
          webhookEndpointEnabled: false,
          webhookSecretConfigured: webhookSecret?.startsWith("whsec_") ?? false,
        };

        if (secretKey) {
          const stripe = new Stripe(secretKey);

          try {
            const [balance, webhookEndpoints] = await Promise.all([
              stripe.balance.retrieve(),
              stripe.webhookEndpoints.list({ limit: 100 }),
            ]);

            checks.stripeApiReachable = balance.livemode;
            checks.webhookEndpointEnabled = webhookEndpoints.data.some(
              (endpoint) =>
                endpoint.url === STRIPE_WEBHOOK_URL &&
                endpoint.status === "enabled" &&
                (endpoint.enabled_events.includes("*") ||
                  endpoint.enabled_events.includes("checkout.session.completed")),
            );
          } catch {
            // The individual checks remain false without exposing Stripe API details.
          }
        }

        const healthy = Object.values(checks).every(Boolean);

        return new Response(
          JSON.stringify({
            status: healthy ? "ok" : "unhealthy",
            checks,
          }),
          {
            status: healthy ? 200 : 503,
            headers: {
              "cache-control": "no-store",
              "content-type": "application/json",
            },
          },
        );
      },
    },
  },
});
