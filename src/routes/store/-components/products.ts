import type { ProductImage } from "./product_image_carousel";

const vol6BackImage = "/store/vol6_back.png";
const vol6FrontImage = "/store/vol6_front.png";

export type StoreProduct = {
  id: string;
  name: string;
  badge: string;
  price: number;
  currency: "CAD";
  image: string;
  images?: readonly ProductImage[];
  summary: string;
  description: string;
  fitNote: string;
  detailHighlights: string;
  stockBySize: Readonly<Record<string, number>>;
};

export const products: readonly StoreProduct[] = [
  {
    id: "classic-tee",
    name: "Classic Tee",
    badge: "",
    price: 2499,
    currency: "CAD",
    image: "https://placehold.co/1200x1200/f5f5f4/1c1917/png?text=Classic+Tee",
    summary: "A clean staple tee with the standard size run for everyday wear.",
    description:
      "The Classic Tee keeps the fit simple and easy with Small, Medium, Large, and XL options. It is the foundational shirt in the collection and every size is priced the same.",
    fitNote: "Standard North American fit.",
    detailHighlights:
      "Soft everyday tee, easy to layer, and built as the go-to option if you want the most classic One for the City look.",
    stockBySize: {
      S: 20,
      M: 30,
      L: 30,
      XL: 20,
    },
  },
  {
    id: "vol-6-tee",
    name: "Vol.6 Limited Edition Tee",
    badge: "Limited",
    price: 2999,
    currency: "CAD",
    image: vol6FrontImage,
    images: [
      {
        src: vol6FrontImage,
        alt: "Vol.6 Limited Edition Tee front view",
      },
      {
        src: vol6BackImage,
        alt: "Vol.6 Limited Edition Tee back view",
      },
    ],
    summary: "A special run for Vol.6 with the abbreviated SM, MD, LG, and XL size set.",
    description: "The Vol.6 Tee - limited edition is the event-focused drop for this release.",
    fitNote: "Standard North American fit.",
    detailHighlights:
      "Best if you want the commemorative event piece. Same pricing across all listed sizes with a limited edition label.",
    stockBySize: {
      S: 5,
      M: 20,
      L: 35,
      XL: 15,
    },
  },
];

export function getProductById(id: string) {
  return products.find((product) => product.id === id);
}

export function getProductSizes(product: StoreProduct) {
  return Object.keys(product.stockBySize);
}

export function hasProductSize(product: StoreProduct, size: string) {
  return Object.hasOwn(product.stockBySize, size);
}

export function getCatalogStockQuantity(productId: string, size: string) {
  return getProductById(productId)?.stockBySize[size] ?? null;
}

export function getCatalogStockRows() {
  return products.flatMap((product) =>
    getProductSizes(product).map((size) => ({
      productId: product.id,
      size,
      baseQuantity: product.stockBySize[size],
    })),
  );
}

export function createCartItem(product: StoreProduct, size: string) {
  const sizeSlug = size.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return {
    id: `${product.id}-${sizeSlug}`,
    productId: product.id,
    name: `${product.name} — ${size}`,
    size,
    price: product.price,
    currency: product.currency,
    image: product.image,
  };
}
