import { buttonStyles } from "@/components/Button";
import { cn } from "@/utils/cn";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useShoppingCart } from "use-shopping-cart";

export const Route = createFileRoute("/store/success")({
  component: SuccessPage,
});

function SuccessPage() {
  const { clearCart } = useShoppingCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <section className="mx-auto max-w-2xl rounded-3xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm sm:p-8">
      <p className="text-sm font-semibold tracking-[0.2em] text-emerald-700 uppercase">
        Payment complete
      </p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
        Thanks for your order.
      </h2>
      <p className="mt-4 text-sm leading-6 text-stone-700 sm:text-base">
        Your checkout finished successfully. Use the button below to head back to the product list.
      </p>

      <Link
        className={cn(buttonStyles, "mt-6 rounded-full px-5 py-3 text-sm")}
        to="/store/products"
      >
        Back to products
      </Link>
    </section>
  );
}
