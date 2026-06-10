import { createFileRoute } from "@tanstack/react-router";

import { Cart } from "./-components/cart";

export const Route = createFileRoute("/store/cart")({
  component: CartPage,
});

function CartPage() {
  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">Cart</h2>
        <p className="max-w-2xl text-sm leading-6 text-stone-600 sm:text-base">
          Review your items, adjust quantities, and continue to Stripe Checkout when you are ready.
        </p>
      </div>

      <Cart />
    </section>
  );
}
