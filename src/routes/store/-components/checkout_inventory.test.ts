import { describe, expect, it } from "vitest";

import { getUnavailableInventoryMessage } from "./checkout_inventory";

describe("checkout inventory messaging", () => {
  it("identifies each product size without enough stock", () => {
    const message = getUnavailableInventoryMessage(
      [
        {
          productId: "blue-embroidered-tee",
          size: "XL",
          remainingAvailable: 0,
        },
        {
          productId: "classic-tee",
          size: "S",
          remainingAvailable: 1,
        },
      ],
      [
        { productId: "blue-embroidered-tee", size: "XL", quantity: 1 },
        { productId: "classic-tee", size: "S", quantity: 2 },
      ],
    );

    expect(message).toBe(
      "Blue Embroidered Tee (XL): You have 1 in your cart, but none are left in stock. " +
        "Classic Tee (S): You have 2 in your cart, but only 1 is left in stock.",
    );
  });

  it("uses plural wording when multiple shirts remain", () => {
    expect(
      getUnavailableInventoryMessage(
        [
          {
            productId: "classic-tee",
            size: "M",
            remainingAvailable: 2,
          },
        ],
        [{ productId: "classic-tee", size: "M", quantity: 3 }],
      ),
    ).toBe(
      "Classic Tee (M): You have 3 in your cart, but only 2 are left in stock.",
    );
  });

  it("returns no message when every requested size is available", () => {
    expect(
      getUnavailableInventoryMessage(
        [
          {
            productId: "blue-embroidered-tee",
            size: "L",
            remainingAvailable: 10,
          },
        ],
        [{ productId: "blue-embroidered-tee", size: "L", quantity: 2 }],
      ),
    ).toBeNull();
  });
});
