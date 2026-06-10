import { buttonStyles } from "@/components/Button";
import { cn } from "@/utils/cn";
import { Link } from "@tanstack/react-router";
import { useShoppingCart } from "use-shopping-cart";

import { CheckoutButton } from "./checkout_button";

type CartItem = {
  formattedPrice?: string;
  image?: string;
  name?: string;
  quantity: number;
  size?: string;
};

export function Cart() {
  const { cartCount, formattedTotalPrice, cartDetails, incrementItem, decrementItem, removeItem } =
    useShoppingCart();
  const cartItems = Object.entries(cartDetails ?? {}) as Array<[string, CartItem]>;
  const itemCount = cartCount ?? 0;

  return (
    <section className="rounded-3xl border border-stone-200 bg-stone-50 p-5 pb-32 shadow-sm sm:p-6 sm:pb-36">
      <div className="space-y-1">
        <p className="text-sm font-semibold tracking-[0.18em] text-stone-500 uppercase">
          Your cart
        </p>
        <h3 className="text-2xl font-semibold tracking-tight text-stone-950">
          {itemCount === 0
            ? "Your cart is empty"
            : `${itemCount} item${itemCount === 1 ? "" : "s"}`}
        </h3>
      </div>

      {itemCount === 0 ? (
        <div className="mt-6 rounded-3xl border border-dashed border-stone-300 bg-white p-6 text-center sm:p-8">
          <p className="text-sm leading-6 text-stone-600 sm:text-base">
            Add a product and choose a size from the product details page to enable checkout.
          </p>
          <Link
            className={cn(buttonStyles, "mt-5 rounded-full px-4 py-2.5 text-sm")}
            to="/store/products"
          >
            Browse products
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {cartItems.map(([id, item]) => (
            <article
              key={id}
              className="rounded-3xl border border-stone-200 bg-white p-4 shadow-xs sm:p-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex gap-4">
                  {item.image ? (
                    <img
                      alt={item.name ?? "Cart item"}
                      className="h-20 w-20 rounded-2xl border border-stone-200 object-cover"
                      src={item.image}
                    />
                  ) : null}

                  <div className="space-y-1">
                    <h4 className="text-base font-semibold text-stone-950">{item.name}</h4>
                    {item.size ? <p className="text-sm text-stone-500">Size: {item.size}</p> : null}
                    <p className="text-sm text-stone-500">
                      {item.formattedPrice} × {item.quantity}
                    </p>
                  </div>
                </div>

                <button
                  className="text-left text-sm font-semibold text-stone-500 transition hover:text-red-600 sm:text-right"
                  onClick={() => removeItem(id)}
                  type="button"
                >
                  Remove
                </button>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <button
                  className={cn(buttonStyles, "h-10 w-10 rounded-full text-lg")}
                  onClick={() => decrementItem(id)}
                  type="button"
                >
                  −
                </button>
                <span className="min-w-6 text-center text-sm font-semibold text-stone-950">
                  {item.quantity}
                </span>
                <button
                  className={cn(buttonStyles, "h-10 w-10 rounded-full text-lg")}
                  onClick={() => incrementItem(id)}
                  type="button"
                >
                  +
                </button>
              </div>
            </article>
          ))}

          <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl pr-5 sm:pr-6 lg:pr-8">
              <div className="pointer-events-auto ml-auto w-full rounded-3xl border border-white/20 bg-white/70 p-4 shadow-lg backdrop-blur-md sm:max-w-md sm:p-5">
                <div className="flex items-center justify-between gap-4 text-base font-semibold text-stone-950">
                  <span>Total</span>
                  <span>{formattedTotalPrice ?? "$0.00"}</span>
                </div>

                <div className="mt-4">
                  <CheckoutButton />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
