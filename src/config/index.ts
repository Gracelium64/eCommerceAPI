import { z } from "zod/v4";

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  MONGO_URI: z.string().url(),
  DB_NAME: z.string().default("ecommerce_api"),
  CLIENT_BASE_URL: z.string().url().default("http://localhost:5173"),
  ACCESS_JWT_SECRET: z.string().min(64),
  REFRESH_JWT_SECRET: z.string().min(64),
  ACCESS_TOKEN_TTL: z.coerce.number().default(15 * 60),
  REFRESH_TOKEN_TTL: z.coerce.number().default(30 * 24 * 60 * 60),
  SALT_ROUNDS: z.coerce.number().int().min(10).max(15).default(12),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error(z.prettifyError(parsed.error));
  process.exit(1);
}

export const {
  PORT,
  NODE_ENV,
  MONGO_URI,
  DB_NAME,
  CLIENT_BASE_URL,
  ACCESS_JWT_SECRET,
  REFRESH_JWT_SECRET,
  ACCESS_TOKEN_TTL,
  REFRESH_TOKEN_TTL,
  SALT_ROUNDS,
} = parsed.data;

export const IS_PRODUCTION = NODE_ENV === "production";
