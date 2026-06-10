import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useShoppingCart } from "use-shopping-cart";

import { ProductImageCarousel } from "./-components/product_image_carousel";
import { getProductSizes, products } from "./-components/products";

export const Route = createFileRoute("/store/products")({
  component: ProductsPage,
});

type CartEntry = {
  productId?: string;
  quantity: number;
};

function ProductsPage() {
  const navigate = useNavigate();
  const { cartDetails } = useShoppingCart();
  const items = Object.values(cartDetails ?? {}) as CartEntry[];

  return (
    <section className="space-y-6">
      <div className="mx-auto max-w-4xl rounded-3xl border border-stone-200 bg-stone-50 p-4 text-sm leading-6 text-stone-700 sm:p-5 sm:text-base">
        Merch is available for online pre-order and pickup at the event on June 27 and June 28.
      </div>

      <div className="mx-auto grid max-w-4xl grid-cols-2 gap-3 sm:gap-5">
        {products.map((product) => {
          const quantityInCart = items.reduce((total, item) => {
            return item.productId === product.id ? total + item.quantity : total;
          }, 0);

          const productImages = product.images ?? [{ alt: product.name, src: product.image }];

          return (
            <article
              key={product.id}
              className="overflow-hidden rounded-3xl border border-stone-200 bg-stone-50 shadow-sm transition hover:border-stone-300 hover:shadow-md"
            >
              <ProductImageCarousel
                badge={product.badge}
                className="rounded-none border-0 shadow-none"
                images={productImages}
                onSelect={() =>
                  navigate({
                    params: { id: product.id },
                    to: "/store/product/$id",
                  })
                }
                productName={product.name}
                variant="minimal"
              />

              <Link
                className="group block space-y-3 p-3 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900 sm:space-y-4 sm:p-6"
                params={{ id: product.id }}
                to="/store/product/$id"
              >
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-base font-semibold text-stone-950 sm:text-lg">
                      ${(product.price / 100).toFixed(2)}
                    </p>
                    <div className="min-h-5 text-right text-xs text-stone-500 sm:text-sm">
                      {quantityInCart > 0 && `${quantityInCart} in cart`}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-stone-950 transition group-hover:text-stone-700 sm:text-xl">
                      {product.name}
                    </h3>
                    <p className="mt-2 hidden text-sm leading-6 text-stone-600 sm:block">
                      {product.summary}
                    </p>
                  </div>
                </div>

                <div className="hidden flex-wrap gap-2 sm:flex">
                  {getProductSizes(product).map((size) => (
                    <span
                      key={size}
                      className="rounded-full border border-stone-300 bg-white px-3 py-1 text-xs font-medium text-stone-600"
                    >
                      {size}
                    </span>
                  ))}
                </div>

                <span className="inline-flex text-sm font-medium text-stone-600 transition group-hover:text-stone-950">
                  View details →
                </span>
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}
