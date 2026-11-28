import { createFileRoute } from "@tanstack/react-router";

import { StoreAdminPage } from "@/features/store/store-admin-page";
import { getAdminDashboard } from "@/features/store/admin.functions";

export const Route = createFileRoute("/store/admin")({
  loader: async () => getAdminDashboard({ data: { searchEmail: "" } }),
  component: StoreAdminRoute,
});

function StoreAdminRoute() {
  return <StoreAdminPage initialData={Route.useLoaderData()} />;
}
