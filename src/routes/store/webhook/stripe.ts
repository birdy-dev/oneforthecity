import { createFileRoute } from "@tanstack/react-router";

import { handleStripeWebhook } from "@/features/store/stripe-webhook.server";

export const Route = createFileRoute("/store/webhook/stripe")({
  server: {
    handlers: {
      POST: ({ request }) => handleStripeWebhook(request),
    },
  },
});
