import { createFileRoute } from "@tanstack/react-router";

import { ProductsPage } from "@/features/store/products-page";

export const Route = createFileRoute("/store/products")({
  component: ProductsPage,
});
