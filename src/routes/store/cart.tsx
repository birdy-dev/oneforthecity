import { createFileRoute } from "@tanstack/react-router";

import { CartPage } from "@/features/store/cart-page";

export const Route = createFileRoute("/store/cart")({
  component: CartPage,
});
