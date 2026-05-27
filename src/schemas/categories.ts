import { z } from "zod/v4";
import { idSchema } from "./common.js";

export const categoryParamsSchema = z.object({ id: idSchema });
export const categoryBodySchema = z.object({
  name: z.string().min(2).max(100),
});
