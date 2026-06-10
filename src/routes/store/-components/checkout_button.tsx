import { buttonStyles } from "@/components/Button";
import { cn } from "@/utils/cn";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useShoppingCart } from "use-shopping-cart";

import { createCheckoutSession } from "./checkout_button.functions";

type CheckoutCartEntry = {
  productId?: string;
  quantity?: number;
  size?: string;
};

export function CheckoutButton() {
  const { cartCount, cartDetails, redirectToCheckout } = useShoppingCart();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const createCheckoutSessionFn = useServerFn(createCheckoutSession);

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const cartItems = Object.values(cartDetails ?? {})
        .map((item) => {
          const { productId, quantity, size } = item as CheckoutCartEntry;

          return {
            productId,
            quantity,
            size,
          };
        })
        .filter(
          (item): item is { productId: string; quantity: number; size: string } =>
            typeof item.productId === "string" &&
            typeof item.quantity === "number" &&
            typeof item.size === "string",
        );

      const { sessionUrl } = await createCheckoutSessionFn({
        data: { cartItems },
      });

      await redirectToCheckout(sessionUrl);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to start checkout.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <button
        className={cn(
          buttonStyles,
          "w-full rounded-full px-4 py-3 text-sm shadow-sm backdrop-blur-md",
        )}
        disabled={cartCount === 0 || isLoading}
        onClick={handleCheckout}
        type="button"
      >
        {isLoading ? "Redirecting to checkout…" : "Checkout"}
      </button>

      {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}
    </div>
  );
}
