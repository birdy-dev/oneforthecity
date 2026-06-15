import { describe, expect, it, vi } from "vitest";

import {
  CHECKOUT_ATTEMPT_STORAGE_KEY,
  beginCheckout,
  clearCheckoutAttempt,
  finishCheckout,
  getOrCreateCheckoutAttemptId,
  subscribeToCheckoutPageRestore,
  withCheckoutTimeout,
} from "./checkout_attempt";

function createStorage() {
  const values = new Map<string, string>();

  return {
    getItem: (key: string) => values.get(key) ?? null,
    removeItem: (key: string) => values.delete(key),
    setItem: (key: string, value: string) => values.set(key, value),
    values,
  };
}

const cart = [{ productId: "classic-tee", quantity: 1, size: "M" }];

describe("checkout attempt persistence", () => {
  it("reuses the same attempt after refresh or back/forward navigation", () => {
    const storage = createStorage();
    const createId = vi.fn().mockReturnValueOnce("attempt-1").mockReturnValueOnce("attempt-2");

    expect(getOrCreateCheckoutAttemptId(cart, storage, createId)).toBe("attempt-1");
    expect(getOrCreateCheckoutAttemptId(cart, storage, createId)).toBe("attempt-1");
    expect(createId).toHaveBeenCalledTimes(1);
  });

  it("creates a new attempt when the cart changes", () => {
    const storage = createStorage();
    const createId = vi.fn().mockReturnValueOnce("attempt-1").mockReturnValueOnce("attempt-2");

    getOrCreateCheckoutAttemptId(cart, storage, createId);

    expect(
      getOrCreateCheckoutAttemptId(
        [{ productId: "classic-tee", quantity: 2, size: "M" }],
        storage,
        createId,
      ),
    ).toBe("attempt-2");
  });

  it("recovers from malformed or unavailable browser storage", () => {
    const storage = createStorage();
    storage.values.set(CHECKOUT_ATTEMPT_STORAGE_KEY, "{bad json");

    expect(getOrCreateCheckoutAttemptId(cart, storage, () => "replacement")).toBe("replacement");
    expect(
      getOrCreateCheckoutAttemptId(
        cart,
        {
          getItem: () => {
            throw new Error("blocked");
          },
          removeItem: () => {},
          setItem: () => {
            throw new Error("blocked");
          },
        },
        () => "memory-only",
      ),
    ).toBe("memory-only");
  });

  it("clears the persisted attempt after a completed checkout", () => {
    const storage = createStorage();
    getOrCreateCheckoutAttemptId(cart, storage, () => "attempt-1");

    clearCheckoutAttempt(storage);

    expect(storage.values.has(CHECKOUT_ATTEMPT_STORAGE_KEY)).toBe(false);
  });
});

describe("slow requests and browser history restores", () => {
  it("lets the UI recover from a request that exceeds the timeout", async () => {
    vi.useFakeTimers();
    const result = withCheckoutTimeout(new Promise(() => {}), 100);
    const expectation = expect(result).rejects.toThrow("Check your connection and try again");
    await vi.advanceTimersByTimeAsync(100);

    await expectation;
    vi.useRealTimers();
  });

  it("allows only one checkout request while a previous request is pending", () => {
    const lock = { current: false };

    expect(beginCheckout(lock)).toBe(true);
    expect(beginCheckout(lock)).toBe(false);
    finishCheckout(lock);
    expect(beginCheckout(lock)).toBe(true);
  });

  it("resets checkout state when a page is restored from the back-forward cache", () => {
    const target = new EventTarget();
    const reset = vi.fn();
    const unsubscribe = subscribeToCheckoutPageRestore(reset, target);

    target.dispatchEvent(new Event("pageshow"));
    unsubscribe();
    target.dispatchEvent(new Event("pageshow"));

    expect(reset).toHaveBeenCalledTimes(1);
  });
});
