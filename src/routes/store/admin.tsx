import { buttonStyles } from "@/components/Button";
import { cn } from "@/utils/cn";
import type { AdminDashboardData, AdminOrder, InventoryRow } from "@/utils/store_inventory";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Check, RotateCcw, Search, Shirt, SlidersHorizontal, Store } from "lucide-react";
import { type FormEvent, type ReactNode, useMemo, useState } from "react";
import { toast } from "sonner";

import {
  createInPersonSale,
  createInventoryAdjustment,
  getAdminDashboard,
  updateOrderFulfillment,
} from "./-admin.functions";
import { getProductSizes, products } from "./-components/products";

export const Route = createFileRoute("/store/admin")({
  loader: async () => getAdminDashboard({ data: { searchEmail: "" } }),
  component: StoreAdminPage,
});

function StoreAdminPage() {
  const initialData = Route.useLoaderData();
  const dashboardFn = useServerFn(getAdminDashboard);
  const updateFulfillmentFn = useServerFn(updateOrderFulfillment);
  const inPersonSaleFn = useServerFn(createInPersonSale);
  const inventoryAdjustmentFn = useServerFn(createInventoryAdjustment);
  const [dashboard, setDashboard] = useState<AdminDashboardData>(initialData);
  const [searchEmail, setSearchEmail] = useState("");
  const [isBusy, setIsBusy] = useState(false);

  const refreshDashboard = async (email = searchEmail) => {
    const nextDashboard = await dashboardFn({ data: { searchEmail: email } });
    setDashboard(nextDashboard);
  };

  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await runAction(async () => {
      await refreshDashboard(searchEmail);
      toast.success(searchEmail ? "Search updated." : "Showing recent orders.");
    });
  };

  const handleFulfillment = async (orderId: number, fulfilled: boolean) => {
    await runAction(async () => {
      await updateFulfillmentFn({ data: { orderId, fulfilled } });
      await refreshDashboard();
      toast.success(fulfilled ? "Order marked fulfilled." : "Order marked unfulfilled.");
    });
  };

  const handleInPersonSale = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    await runAction(async () => {
      await inPersonSaleFn({
        data: {
          productId: String(formData.get("productId")),
          size: String(formData.get("size")),
          quantity: Number(formData.get("quantity")),
          note: String(formData.get("note") || ""),
        },
      });
      form.reset();
      await refreshDashboard();
      toast.success("In-person sale recorded.");
    });
  };

  const handleInventoryAdjustment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    await runAction(async () => {
      await inventoryAdjustmentFn({
        data: {
          productId: String(formData.get("productId")),
          size: String(formData.get("size")),
          delta: Number(formData.get("delta")),
          reason: String(formData.get("reason")),
        },
      });
      form.reset();
      await refreshDashboard();
      toast.success("Inventory adjustment recorded.");
    });
  };

  const runAction = async (action: () => Promise<void>) => {
    try {
      setIsBusy(true);
      await action();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "The admin action failed.");
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-stone-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 border-b border-stone-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-[0.18em] text-stone-500 uppercase">
              Store admin
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-950">
              Volunteer orders and inventory
            </h1>
          </div>
          <form className="flex w-full gap-2 sm:max-w-md" onSubmit={handleSearch}>
            <input
              className={inputClass}
              onChange={(event) => setSearchEmail(event.target.value)}
              placeholder="Search by customer email"
              type="search"
              value={searchEmail}
            />
            <button
              className={iconButtonClass}
              disabled={isBusy}
              title="Search orders"
              type="submit"
            >
              <Search aria-hidden="true" size={18} />
            </button>
          </form>
        </header>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <InventorySection inventory={dashboard.inventory} />
            <OrdersSection
              emptyLabel="No recent unfulfilled orders."
              isBusy={isBusy}
              onFulfillmentChange={handleFulfillment}
              orders={dashboard.recentUnfulfilledOrders}
              title="Recent Unfulfilled Online Orders"
            />
            {searchEmail ? (
              <OrdersSection
                emptyLabel="No paid orders found for that email."
                isBusy={isBusy}
                onFulfillmentChange={handleFulfillment}
                orders={dashboard.searchResults}
                title="Email Search Results"
              />
            ) : null}
          </div>

          <aside className="space-y-6">
            <ActionForm
              icon={<Store aria-hidden="true" size={18} />}
              onSubmit={handleInPersonSale}
              submitLabel="Record sale"
              title="Record In-Person Sale"
            >
              <ProductSizeFields />
              <label className={labelClass}>
                Quantity
                <input className={inputClass} min={1} name="quantity" required type="number" />
              </label>
              <label className={labelClass}>
                Note
                <input className={inputClass} maxLength={200} name="note" />
              </label>
            </ActionForm>

            <ActionForm
              icon={<SlidersHorizontal aria-hidden="true" size={18} />}
              onSubmit={handleInventoryAdjustment}
              submitLabel="Record adjustment"
              title="Adjust Inventory"
            >
              <ProductSizeFields />
              <label className={labelClass}>
                Delta
                <input className={inputClass} name="delta" required type="number" />
              </label>
              <label className={labelClass}>
                Reason
                <input className={inputClass} maxLength={200} name="reason" required />
              </label>
            </ActionForm>
          </aside>
        </section>
      </div>
    </main>
  );
}

function InventorySection({ inventory }: { inventory: InventoryRow[] }) {
  const rowsByProduct = useMemo(() => {
    const map = new Map<string, InventoryRow[]>();

    for (const row of inventory) {
      const rows = map.get(row.productName) ?? [];
      rows.push(row);
      map.set(row.productName, rows);
    }

    return Array.from(map.entries());
  }, [inventory]);

  return (
    <section className={sectionClass}>
      <SectionTitle icon={<Shirt aria-hidden="true" size={18} />} title="Inventory" />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-stone-200 text-xs font-semibold tracking-[0.12em] text-stone-500 uppercase">
              <th className="py-3 pr-4">Product</th>
              <th className="py-3 pr-4">Size</th>
              <th className="py-3 pr-4">Starting + adjustments</th>
              <th className="py-3 pr-4">Reserved online</th>
              <th className="py-3 pr-4">Online fulfilled</th>
              <th className="py-3 pr-4">In-person sold</th>
              <th className="py-3">Remaining</th>
            </tr>
          </thead>
          <tbody>
            {rowsByProduct.map(([productName, rows]) =>
              rows.map((row, index) => (
                <tr
                  className={cn(
                    "border-b border-stone-100",
                    row.oversold && "bg-red-50 text-red-950",
                  )}
                  key={`${row.productId}-${row.size}`}
                >
                  <td className="py-3 pr-4 font-medium text-stone-950">
                    {index === 0 ? productName : ""}
                  </td>
                  <td className="py-3 pr-4">{row.size}</td>
                  <td className="py-3 pr-4">{row.stockQuantity}</td>
                  <td className="py-3 pr-4">{row.reservedOnline}</td>
                  <td className="py-3 pr-4">{row.onlineFulfilled}</td>
                  <td className="py-3 pr-4">{row.inPersonSold}</td>
                  <td className="py-3 font-semibold">
                    {row.remainingAvailable}
                    {row.oversold ? <span className="ml-2 text-xs font-bold">Oversold</span> : null}
                  </td>
                </tr>
              )),
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function OrdersSection({
  emptyLabel,
  isBusy,
  onFulfillmentChange,
  orders,
  title,
}: {
  emptyLabel: string;
  isBusy: boolean;
  onFulfillmentChange: (orderId: number, fulfilled: boolean) => Promise<void>;
  orders: AdminOrder[];
  title: string;
}) {
  return (
    <section className={sectionClass}>
      <SectionTitle icon={<Check aria-hidden="true" size={18} />} title={title} />
      {orders.length === 0 ? (
        <p className="text-sm text-stone-600">{emptyLabel}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-xs font-semibold tracking-[0.12em] text-stone-500 uppercase">
                <th className="py-3 pr-4">Customer</th>
                <th className="py-3 pr-4">Order</th>
                <th className="py-3 pr-4">Paid</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr className="border-b border-stone-100" key={order.id}>
                  <td className="py-3 pr-4 align-top">
                    <div className="font-medium text-stone-950">{order.customerEmail}</div>
                    {order.customerName ? (
                      <div className="mt-1 text-xs text-stone-500">{order.customerName}</div>
                    ) : null}
                  </td>
                  <td className="py-3 pr-4 align-top">
                    <ul className="space-y-1">
                      {order.items.map((item) => (
                        <li
                          className={cn(item.oversold && "font-semibold text-red-700")}
                          key={item.id}
                        >
                          {item.quantity}x {item.productName} / {item.size}
                          {item.oversold ? " (oversold)" : ""}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="py-3 pr-4 align-top">{formatDate(order.paidAt)}</td>
                  <td className="py-3 pr-4 align-top">
                    {order.fulfilled ? "Fulfilled" : "Unfulfilled"}
                  </td>
                  <td className="py-3 align-top">
                    <button
                      className={cn(buttonStyles, "gap-2 rounded-full px-3 py-2 text-xs")}
                      disabled={isBusy}
                      onClick={() => onFulfillmentChange(order.id, !order.fulfilled)}
                      type="button"
                    >
                      {order.fulfilled ? (
                        <RotateCcw aria-hidden="true" size={14} />
                      ) : (
                        <Check aria-hidden="true" size={14} />
                      )}
                      {order.fulfilled ? "Unfulfill" : "Fulfill"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function ActionForm({
  children,
  icon,
  onSubmit,
  submitLabel,
  title,
}: {
  children: ReactNode;
  icon: ReactNode;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  submitLabel: string;
  title: string;
}) {
  return (
    <form className={sectionClass} onSubmit={onSubmit}>
      <SectionTitle icon={icon} title={title} />
      <div className="space-y-4">{children}</div>
      <button
        className={cn(buttonStyles, "mt-5 w-full rounded-full px-4 py-3 text-sm")}
        type="submit"
      >
        {submitLabel}
      </button>
    </form>
  );
}

function ProductSizeFields() {
  const [productId, setProductId] = useState(products[0]?.id ?? "");
  const selectedProduct = products.find((product) => product.id === productId) ?? products[0];

  return (
    <>
      <label className={labelClass}>
        Product
        <select
          className={inputClass}
          name="productId"
          onChange={(event) => setProductId(event.target.value)}
          value={productId}
        >
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
      </label>
      <label className={labelClass}>
        Size
        <select className={inputClass} name="size" required>
          {selectedProduct
            ? getProductSizes(selectedProduct).map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))
            : null}
        </select>
      </label>
    </>
  );
}

function SectionTitle({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <span className="inline-flex size-8 items-center justify-center rounded-full bg-stone-100 text-stone-700">
        {icon}
      </span>
      <h2 className="text-lg font-semibold tracking-tight text-stone-950">{title}</h2>
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-CA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

const sectionClass = "rounded-lg border border-stone-200 bg-white p-5 shadow-sm";
const inputClass =
  "w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-950 outline-none transition focus:border-stone-500";
const labelClass = "block space-y-1.5 text-sm font-medium text-stone-700";
const iconButtonClass = cn(buttonStyles, "size-10 shrink-0 rounded-full p-0");
