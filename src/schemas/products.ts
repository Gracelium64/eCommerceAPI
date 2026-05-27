import { z } from "zod/v4";
import { idSchema } from "./common.js";

export const productParamsSchema = z.object({ id: idSchema });

export const productQuerySchema = z.object({
  categoryId: idSchema.optional(),
});

export const productBodySchema = z.object({
  name: z.string().min(2).max(120),
  description: z.string().min(2).max(2000),
  price: z.number().nonnegative(),
  categoryId: idSchema,
});
