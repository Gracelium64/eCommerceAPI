import { z } from "zod/v4";
import { strongPasswordSchema } from "./common.js";

export const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: strongPasswordSchema,
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
