import { buttonStyles } from "@/components/Button";
import { HomeButton } from "@/components/HomeButton";
import { cn } from "@/utils/cn";
import { getStoreEnabled } from "@/utils/store_enabled.functions";
import { stripePublishableKey } from "@/utils/store_config";
import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { CartProvider, useShoppingCart } from "use-shopping-cart";
import { StoreBreadcrumbNav } from "./store/-components/store_breadcrumb_nav";
import { getProductById } from "./store/-components/products";

export const Route = createFileRoute("/store")({
  loader: async () => getStoreEnabled(),
  component: StoreLayout,
});

function StoreLayout() {
  const { isStoreEnabled } = Route.useLoaderData();
  const location = useLocation();

  if (location.pathname === "/store/admin") {
    return <Outlet />;
  }

  if (!isStoreEnabled) {
    return <StoreUnavailable />;
  }

  return (
    <CartProvider stripe={stripePublishableKey!} currency="CAD">
      <StoreShell />
    </CartProvider>
  );
}

function StoreShell() {
  const location = useLocation();
  const { cartCount } = useShoppingCart();
  const hasItemsInCart = (cartCount ?? 0) > 0;
  const currentPageLabel = getStoreBreadcrumbCurrentPageLabel(location.pathname);

  return (
    <main className="min-h-screen bg-stone-50">
      <nav className="flex justify-between p-4 pb-0">
        <StoreBreadcrumbNav currentPageLabel={currentPageLabel} />
      </nav>

      <div className="mx-auto max-w-6xl px-4 pt-8 pb-32 sm:px-6 sm:pt-10 sm:pb-36 lg:px-8 lg:pt-12">
        <section className="overflow-hidden rounded-4xl border border-stone-200 bg-white shadow-sm">
          <div className="border-b border-stone-200 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            <div className="max-w-2xl space-y-3">
              <p className="text-sm font-semibold tracking-[0.2em] text-stone-500 uppercase">
                One for the City Merch
              </p>
            </div>
          </div>

          <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            <Outlet />
          </div>
        </section>
      </div>

      {location.pathname !== "/store/cart" && hasItemsInCart ? (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-4 sm:px-6 lg:px-8">
          <div
            className={cn(
              "mx-auto",
              location.pathname === "/store/products" ? "max-w-4xl" : "max-w-6xl",
            )}
          >
            <div className="pointer-events-auto ml-auto w-full sm:max-w-md">
              <CartLink />
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

function getStoreBreadcrumbCurrentPageLabel(pathname: string) {
  if (pathname === "/store/cart") {
    return "Cart";
  }

  if (pathname.startsWith("/store/product/")) {
    const productId = decodeURIComponent(pathname.replace("/store/product/", ""));
    return getProductById(productId)?.name ?? "Product";
  }

  return "Merch";
}

function CartLink() {
  const { cartCount, formattedTotalPrice } = useShoppingCart();
  const count = cartCount ?? 0;

  return (
    <Link className={floatingCartLinkClass} to="/store/cart">
      <span>Cart</span>
      <span className="text-sm font-semibold text-white/80">{formattedTotalPrice ?? "$0.00"}</span>
      <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-white/15 px-2 py-0.5 text-xs font-bold text-white">
        {count}
      </span>
    </Link>
  );
}

function StoreUnavailable() {
  return (
    <main className="min-h-screen bg-stone-50">
      <div className="fixed top-4 left-4 z-50 sm:top-6 sm:left-6 lg:left-8">
        <HomeButton to="/2026" />
      </div>

      <div className="mx-auto max-w-3xl px-4 pt-24 pb-10 sm:px-6 sm:pt-28 lg:px-8">
        <section className="rounded-4xl border border-dashed border-stone-300 bg-white p-8 text-center shadow-sm sm:p-10">
          <p className="text-sm font-semibold tracking-[0.2em] text-stone-500 uppercase">
            One for the City Store
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
            Store is currently unavailable
          </h1>
          <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
            The merch store is temporarily unavailable because Stripe is not fully configured.
          </p>
          <Link className={cn(buttonStyles, "mt-6 rounded-full px-5 py-3 text-sm")} to="/2026">
            Back to home
          </Link>
        </section>
      </div>
    </main>
  );
}

const floatingCartLinkClass = cn(
  buttonStyles,
  "flex w-full items-center justify-between gap-3 rounded-full px-5 py-3 text-sm shadow-lg backdrop-blur-md",
);
