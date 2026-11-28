import { createFileRoute } from "@tanstack/react-router";

import { getStoreHealth } from "@/features/store/store-health.server";

export const Route = createFileRoute("/store/health")({
  server: {
    handlers: {
      GET: getStoreHealth,
    },
  },
});
