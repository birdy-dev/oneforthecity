export const PRESALE_PAYMENT_CUTOFF_MS = Date.parse("2026-06-30T06:00:00.000Z");
export const PRESALE_PAYMENT_CUTOFF_SECONDS = Math.floor(PRESALE_PAYMENT_CUTOFF_MS / 1000);

const STRIPE_MAX_CHECKOUT_LIFETIME_MS = 24 * 60 * 60 * 1000;
const STRIPE_MIN_CHECKOUT_LIFETIME_MS = 30 * 60 * 1000;
const STRIPE_EXPIRY_REQUEST_BUFFER_MS = 60 * 1000;

const PRESALE_CLOSED_MESSAGE =
  "Online presale payment closed on June 30, 2026 at 12:00 AM Mountain Time.";
const PRESALE_SESSION_WINDOW_CLOSED_MESSAGE =
  "New checkout sessions are closed because the presale payment deadline is less than 31 minutes away.";

export function getPresaleCheckoutExpiration(nowMs: number) {
  const timeUntilCutoff = PRESALE_PAYMENT_CUTOFF_MS - nowMs;

  if (timeUntilCutoff <= 0) {
    throw new Error(PRESALE_CLOSED_MESSAGE);
  }

  if (timeUntilCutoff < STRIPE_MIN_CHECKOUT_LIFETIME_MS + STRIPE_EXPIRY_REQUEST_BUFFER_MS) {
    throw new Error(PRESALE_SESSION_WINDOW_CLOSED_MESSAGE);
  }

  if (timeUntilCutoff <= STRIPE_MAX_CHECKOUT_LIFETIME_MS) {
    return PRESALE_PAYMENT_CUTOFF_SECONDS;
  }

  return undefined;
}

export function getStripeCheckoutIdempotencyKey(checkoutAttemptId: string) {
  return `store-checkout-${checkoutAttemptId}`;
}
