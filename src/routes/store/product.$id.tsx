import { createFileRoute } from "@tanstack/react-router";

import { ProductDetailsPage } from "@/features/store/product-details-page";

export const Route = createFileRoute("/store/product/$id")({
  component: ProductDetailsRoute,
});

function ProductDetailsRoute() {
  const { id } = Route.useParams();
  return <ProductDetailsPage id={id} />;
}
