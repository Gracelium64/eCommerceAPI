
import { z } from "zod/v4";
import { idSchema, strongPasswordSchema } from "./common.js";

export const userParamsSchema = z.object({ id: idSchema });

export const userCreateSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: strongPasswordSchema,
  roles: z.array(z.enum(["user", "admin", "manager"])).optional()
});

export const userUpdateSchema = userCreateSchema.partial();