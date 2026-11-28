import { createFileRoute } from "@tanstack/react-router";

import { StoreLayout } from "@/features/store/store-layout";
import { getStoreEnabled } from "@/features/store/store-enabled.functions";

export const Route = createFileRoute("/store")({
  loader: async () => getStoreEnabled(),
  component: StoreRoute,
});

function StoreRoute() {
  const { isStoreEnabled } = Route.useLoaderData();
  return <StoreLayout isStoreEnabled={isStoreEnabled} />;
}
