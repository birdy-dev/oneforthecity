import { afterEach, beforeEach, expect, it, vi } from "vitest";

const stripeState = vi.hoisted(() => ({ create: vi.fn() }));

vi.mock("@tanstack/react-start", () => ({
  createServerFn: () => ({
    validator: () => ({ handler: (handler: unknown) => handler }),
  }),
}));

vi.mock("@tanstack/react-start/server", () => ({
  getRequest: () => new Request("https://oneforthecity.com/store/cart"),
}));

vi.mock("@/utils/store_inventory", () => ({
  getInventoryRows: async () => [{ productId: "vol-6-tee", size: "M", remainingAvailable: 20 }],
}));

vi.mock("stripe", () => ({
  default: vi.fn(function StripeMock() {
    return { checkout: { sessions: { create: stripeState.create } } };
  }),
}));

import { createCheckoutSession } from "@/routes/store/-components/checkout_button.functions";
import { PRESALE_PAYMENT_CUTOFF_SECONDS } from "@/routes/store/-components/checkout_policy";

const checkoutAttemptId = "67e55044-10b1-426f-9247-bb680e5fe0c8";
const runCheckout = createCheckoutSession as unknown as (input: {
  data: {
    checkoutAttemptId: string;
    cartItems: { productId: string; quantity: number; size: string }[];
  };
}) => Promise<{ sessionUrl: string }>;
const input = {
  data: {
    checkoutAttemptId,
    cartItems: [{ productId: "vol-6-tee", quantity: 2, size: "M" }],
  },
};

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date("2026-06-29T12:00:00Z"));
  vi.stubEnv("STRIPE_SECRET_KEY", "sk_test_store");
  stripeState.create.mockReset();
  stripeState.create.mockResolvedValue({ url: "https://checkout.stripe.com/test" });
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
});

it("uses Stripe 23's card allowlist while preserving trusted prices, expiry, and idempotency", async () => {
  await expect(runCheckout(input)).resolves.toEqual({
    sessionUrl: "https://checkout.stripe.com/test",
  });
  const [params, options] = stripeState.create.mock.calls[0];
  expect(params.allowed_payment_method_types).toEqual(["card"]);
  expect(params).not.toHaveProperty("payment_method_types");
  expect(params.line_items[0]).toMatchObject({
    quantity: 2,
    price_data: { currency: "cad", unit_amount: 2999 },
  });
  expect(params.expires_at).toBe(PRESALE_PAYMENT_CUTOFF_SECONDS);
  expect(params.success_url).toBe("https://oneforthecity.com/store/success");
  expect(params.cancel_url).toBe("https://oneforthecity.com/store/cart");
  expect(options.idempotencyKey).toBe(`store-checkout-${checkoutAttemptId}`);
});

it("never calls Stripe after the presale deadline", async () => {
  vi.setSystemTime(new Date("2026-07-01T00:00:00Z"));
  await expect(runCheckout(input)).rejects.toThrow("Online presale payment closed");
  expect(stripeState.create).not.toHaveBeenCalled();
});
