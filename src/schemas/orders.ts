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
