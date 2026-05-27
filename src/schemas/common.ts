import { z } from "zod/v4";

export const idSchema = z.string().uuid("Invalid UUID");

export const strongPasswordSchema = z
  .string()
  .min(8)
  .regex(/[a-z]/, "Must include lowercase")
  .regex(/[A-Z]/, "Must include uppercase")
  .regex(/\d/, "Must include number")
  .regex(/[^A-Za-z0-9]/, "Must include special character");
