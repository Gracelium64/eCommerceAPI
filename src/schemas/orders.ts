import { z } from "zod/v4";
import { idSchema } from "./common.js";

export const orderParamsSchema = z.object({ id: idSchema });

const itemSchema = z.object({
  productId: idSchema,
  quantity: z.number().int().positive(),
});

export const orderBodySchema = z.object({
  userId: idSchema,
  products: z.array(itemSchema).min(1),
});

// Optional: PATCH
export const orderUpdateSchema = orderBodySchema
  .partial()
  .refine((data) => data.userId !== undefined || data.products !== undefined, {
    message: "At least one field must be provided for update.",
  });
