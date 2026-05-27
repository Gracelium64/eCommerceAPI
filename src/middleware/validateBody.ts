import type { RequestHandler } from "express";
import type { ZodTypeAny } from "zod/v4";

export const validateBody =
  (schema: ZodTypeAny): RequestHandler =>
  (req, _res, next) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success)
      return next(new Error(parsed.error.message, { cause: { status: 400 } }));
    req.body = parsed.data;
    next();
  };
