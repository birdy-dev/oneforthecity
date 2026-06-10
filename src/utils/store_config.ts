export const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

export function isStoreEnabled() {
  return Boolean(stripePublishableKey && process.env.STRIPE_SECRET_KEY);
}
