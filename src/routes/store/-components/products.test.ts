import { describe, expect, it } from "vitest";

import { getProductById, getProductSizes, products } from "./products";

describe("store products", () => {
  it("lists products in merchandising order", () => {
    expect(products.map((product) => product.id)).toEqual([
      "vol-6-tee",
      "blue-embroidered-tee",
      "classic-tee",
    ]);
  });

  it("lists the Blue Embroidered Tee with its allocated inventory", () => {
    const product = getProductById("blue-embroidered-tee");

    expect(product).toMatchObject({
      name: "Blue Embroidered Tee",
      image: "/store/blue_embroidered_front.png",
      stockBySize: {
        S: 1,
        L: 10,
        XL: 10,
        XXL: 3,
      },
    });
    expect(product && getProductSizes(product)).toEqual(["S", "L", "XL", "XXL"]);
  });
});
