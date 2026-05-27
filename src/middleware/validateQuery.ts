import type { RequestHandler } from "express";
import type { ZodTypeAny } from "zod/v4";

export const validateQuery =
  (schema: ZodTypeAny): RequestHandler =>
  (req, _res, next) => {
    const parsed = schema.safeParse(req.query);
    if (!parsed.success)
      return next(new Error(parsed.error.message, { cause: { status: 400 } }));
    Object.assign(req.query, parsed.data as Record<string, unknown>);
    next();
  };
