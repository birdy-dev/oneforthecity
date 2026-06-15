import { describe, expect, it } from "vitest";

import {
  PRESALE_PAYMENT_CUTOFF_MS,
  PRESALE_PAYMENT_CUTOFF_SECONDS,
  getPresaleCheckoutExpiration,
  getStripeCheckoutIdempotencyKey,
} from "./checkout_policy";

describe("presale checkout deadline", () => {
  it("uses Stripe's normal 24-hour expiry when the deadline is more than a day away", () => {
    expect(getPresaleCheckoutExpiration(PRESALE_PAYMENT_CUTOFF_MS - 24 * 60 * 60 * 1000 - 1)).toBe(
      undefined,
    );
  });

  it("expires checkout sessions at midnight Mountain Time within the final 24 hours", () => {
    expect(getPresaleCheckoutExpiration(PRESALE_PAYMENT_CUTOFF_MS - 60 * 60 * 1000)).toBe(
      PRESALE_PAYMENT_CUTOFF_SECONDS,
    );
  });

  it("allows the last session with Stripe's minimum lifetime plus a request buffer", () => {
    expect(getPresaleCheckoutExpiration(PRESALE_PAYMENT_CUTOFF_MS - 31 * 60 * 1000)).toBe(
      PRESALE_PAYMENT_CUTOFF_SECONDS,
    );
  });

  it("stops creating sessions when Stripe can no longer expire them safely at midnight", () => {
    expect(() =>
      getPresaleCheckoutExpiration(PRESALE_PAYMENT_CUTOFF_MS - 31 * 60 * 1000 + 1),
    ).toThrow("deadline is less than 31 minutes away");
  });

  it("rejects payment session creation at and after June 30, 2026 12:00 AM Mountain Time", () => {
    expect(() => getPresaleCheckoutExpiration(PRESALE_PAYMENT_CUTOFF_MS)).toThrow(
      "closed on June 30, 2026 at 12:00 AM Mountain Time",
    );
    expect(() => getPresaleCheckoutExpiration(PRESALE_PAYMENT_CUTOFF_MS + 1)).toThrow(
      "closed on June 30, 2026 at 12:00 AM Mountain Time",
    );
  });
});

describe("Stripe checkout idempotency", () => {
  it("uses the persisted checkout attempt to deduplicate concurrent and retried requests", () => {
    expect(getStripeCheckoutIdempotencyKey("attempt-1")).toBe("store-checkout-attempt-1");
    expect(getStripeCheckoutIdempotencyKey("attempt-1")).toBe(
      getStripeCheckoutIdempotencyKey("attempt-1"),
    );
    expect(getStripeCheckoutIdempotencyKey("attempt-2")).not.toBe(
      getStripeCheckoutIdempotencyKey("attempt-1"),
    );
  });
});
