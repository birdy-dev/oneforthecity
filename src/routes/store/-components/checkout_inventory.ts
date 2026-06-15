import { getProductById } from "./products";

export type CheckoutInventoryRow = {
  productId: string;
  size: string;
  remainingAvailable: number;
};

export type CheckoutInventoryRequest = {
  productId: string;
  size: string;
  quantity: number;
};

export function getUnavailableInventoryMessage(
  inventory: readonly CheckoutInventoryRow[],
  requests: readonly CheckoutInventoryRequest[],
) {
  const unavailable = requests.flatMap((request) => {
    const inventoryRow = inventory.find(
      (row) => row.productId === request.productId && row.size === request.size,
    );

    if (inventoryRow && request.quantity <= inventoryRow.remainingAvailable) {
      return [];
    }

    const productName = getProductById(request.productId)?.name ?? request.productId;
    const remaining = Math.max(inventoryRow?.remainingAvailable ?? 0, 0);
    const stockMessage =
      remaining === 0
        ? "none are left in stock"
        : `only ${remaining} ${remaining === 1 ? "is" : "are"} left in stock`;

    return [
      `${productName} (${request.size}): You have ${request.quantity} in your cart, but ${stockMessage}.`,
    ];
  });

  return unavailable.length > 0 ? unavailable.join(" ") : null;
}
