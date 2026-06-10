import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireAdminAuth } from "@/utils/admin_auth";
import {
  getAdminDashboard as getAdminDashboardData,
  recordInPersonSale,
  recordInventoryAdjustment,
  setOrderFulfilled,
} from "@/utils/store_inventory";

const getAdminDashboardSchema = z.object({
  searchEmail: z.string().trim().max(254).optional(),
});

const setOrderFulfilledSchema = z.object({
  orderId: z.number().int().positive(),
  fulfilled: z.boolean(),
});

const productSizeSchema = {
  productId: z.string().trim().min(1),
  size: z.string().trim().min(1),
};

const recordInPersonSaleSchema = z.object({
  ...productSizeSchema,
  quantity: z.number().int().positive().max(50),
  note: z.string().trim().max(200).optional(),
});

const recordInventoryAdjustmentSchema = z.object({
  ...productSizeSchema,
  delta: z
    .number()
    .int()
    .min(-500)
    .max(500)
    .refine((value) => value !== 0, {
      message: "Adjustment cannot be zero.",
    }),
  reason: z.string().trim().min(2).max(200),
});

export const getAdminDashboard = createServerFn({ method: "GET" })
  .inputValidator(getAdminDashboardSchema)
  .handler(async ({ data }) => {
    requireAdminAuth();
    return getAdminDashboardData(data.searchEmail || undefined);
  });

export const updateOrderFulfillment = createServerFn({ method: "POST" })
  .inputValidator(setOrderFulfilledSchema)
  .handler(async ({ data }) => {
    requireAdminAuth();
    await setOrderFulfilled(data.orderId, data.fulfilled);
    return { ok: true };
  });

export const createInPersonSale = createServerFn({ method: "POST" })
  .inputValidator(recordInPersonSaleSchema)
  .handler(async ({ data }) => {
    requireAdminAuth();
    await recordInPersonSale(data);
    return { ok: true };
  });

export const createInventoryAdjustment = createServerFn({ method: "POST" })
  .inputValidator(recordInventoryAdjustmentSchema)
  .handler(async ({ data }) => {
    requireAdminAuth();
    await recordInventoryAdjustment(data);
    return { ok: true };
  });
