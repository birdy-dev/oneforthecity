import { buttonStyles } from "@/components/Button";
import { cn } from "@/utils/cn";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useShoppingCart } from "use-shopping-cart";

import { ProductImageCarousel } from "./-components/product_image_carousel";
import {
  createCartItem,
  getProductById,
  getProductSizes,
  type StoreProduct,
} from "./-components/products";

export const Route = createFileRoute("/store/product/$id")({
  component: ProductDetailsPage,
});

type CartEntry = {
  quantity: number;
};

function ProductDetailsPage() {
  const { id } = Route.useParams();
  const product = getProductById(id);

  if (!product) {
    return (
      <section className="rounded-3xl border border-dashed border-stone-300 bg-stone-50 p-8 text-center">
        <h2 className="text-2xl font-semibold text-stone-950">Product not found</h2>
        <p className="mt-3 text-sm text-stone-600 sm:text-base">
          That item is not in the catalog right now.
        </p>
        <Link
          className={cn(buttonStyles, "mt-6 rounded-full px-4 py-2.5 text-sm")}
          to="/store/products"
        >
          Back to products
        </Link>
      </section>
    );
  }

  return <ProductDetailsContent key={product.id} product={product} />;
}

function ProductDetailsContent({ product }: { product: StoreProduct }) {
  const { addItem, cartDetails, decrementItem, incrementItem } = useShoppingCart();
  const productImages = product.images ?? [{ alt: product.name, src: product.image }];

  return (
    <section className="space-y-6">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start">
        <ProductImageCarousel
          badge={product.badge}
          images={productImages}
          productName={product.name}
        />

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-2xl font-semibold text-stone-950">
                ${(product.price / 100).toFixed(2)}
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
                {product.name}
              </h2>
              <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
                {product.description}
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-stone-200 bg-stone-50 p-5 sm:p-6">
            <div>
              <h3 className="text-lg font-semibold text-stone-950">Choose your sizes</h3>
              <p className="mt-1 text-sm text-stone-600">{product.fitNote}</p>
            </div>

            <div className="mt-5 space-y-3">
              {getProductSizes(product).map((size) => {
                const cartItem = createCartItem(product, size);
                const quantity =
                  (cartDetails?.[cartItem.id] as CartEntry | undefined)?.quantity ?? 0;

                return (
                  <div
                    key={size}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-stone-200 bg-white px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-stone-950">{size}</p>
                      <p className="text-xs text-stone-500">
                        {quantity > 0 ? `${quantity} in cart` : "Not added yet"}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        className={cn(
                          buttonStyles,
                          "h-10 w-10 rounded-full text-lg disabled:opacity-40",
                        )}
                        disabled={quantity === 0}
                        onClick={() => decrementItem(cartItem.id)}
                        type="button"
                      >
                        −
                      </button>
                      <span className="min-w-6 text-center text-sm font-semibold text-stone-950">
                        {quantity}
                      </span>
                      <button
                        className={cn(buttonStyles, "h-10 w-10 rounded-full text-lg")}
                        onClick={() => {
                          if (quantity === 0) {
                            addItem(cartItem);
                            return;
                          }

                          incrementItem(cartItem.id);
                        }}
                        type="button"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
