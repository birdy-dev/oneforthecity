export const CHECKOUT_ATTEMPT_STORAGE_KEY = "oneforthecity-store-checkout-attempt";
export const CHECKOUT_REQUEST_TIMEOUT_MS = 20_000;

export type CheckoutCartItem = {
  productId: string;
  quantity: number;
  size: string;
};

type CheckoutAttempt = {
  cartFingerprint: string;
  id: string;
};

type CheckoutStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export function getOrCreateCheckoutAttemptId(
  cartItems: readonly CheckoutCartItem[],
  storage: CheckoutStorage,
  createId: () => string = () => crypto.randomUUID(),
) {
  const cartFingerprint = JSON.stringify(
    [...cartItems]
      .sort(
        (left, right) =>
          left.productId.localeCompare(right.productId) ||
          left.size.localeCompare(right.size) ||
          left.quantity - right.quantity,
      )
      .map(({ productId, quantity, size }) => ({ productId, quantity, size })),
  );

  try {
    const storedAttempt = parseCheckoutAttempt(storage.getItem(CHECKOUT_ATTEMPT_STORAGE_KEY));

    if (storedAttempt?.cartFingerprint === cartFingerprint) {
      return storedAttempt.id;
    }
  } catch {
    // Storage can be disabled by browser privacy settings; checkout should still work.
  }

  const attempt: CheckoutAttempt = {
    cartFingerprint,
    id: createId(),
  };

  try {
    storage.setItem(CHECKOUT_ATTEMPT_STORAGE_KEY, JSON.stringify(attempt));
  } catch {
    // The in-memory ID still protects this mounted page from duplicate requests.
  }

  return attempt.id;
}

export function clearCheckoutAttempt(storage: CheckoutStorage) {
  try {
    storage.removeItem(CHECKOUT_ATTEMPT_STORAGE_KEY);
  } catch {
    // Clearing a completed attempt is best-effort.
  }
}

export function withCheckoutTimeout<T>(
  request: Promise<T>,
  timeoutMs = CHECKOUT_REQUEST_TIMEOUT_MS,
  scheduleTimeout: typeof setTimeout = setTimeout,
) {
  return Promise.race([
    request,
    new Promise<never>((_, reject) => {
      scheduleTimeout(() => {
        reject(
          new Error(
            "Checkout is taking longer than expected. Check your connection and try again.",
          ),
        );
      }, timeoutMs);
    }),
  ]);
}

export function beginCheckout(lock: { current: boolean }) {
  if (lock.current) {
    return false;
  }

  lock.current = true;
  return true;
}

export function finishCheckout(lock: { current: boolean }) {
  lock.current = false;
}

export function subscribeToCheckoutPageRestore(
  reset: () => void,
  eventTarget: Pick<EventTarget, "addEventListener" | "removeEventListener"> = window,
) {
  eventTarget.addEventListener("pageshow", reset);
  return () => eventTarget.removeEventListener("pageshow", reset);
}

function parseCheckoutAttempt(value: string | null): CheckoutAttempt | null {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as Partial<CheckoutAttempt>;

    return typeof parsed.cartFingerprint === "string" && typeof parsed.id === "string"
      ? { cartFingerprint: parsed.cartFingerprint, id: parsed.id }
      : null;
  } catch {
    return null;
  }
}
