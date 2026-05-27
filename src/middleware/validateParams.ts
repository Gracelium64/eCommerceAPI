import type { RequestHandler } from "express";
import type { ZodTypeAny } from "zod/v4";

export const validateParams =
  (schema: ZodTypeAny): RequestHandler =>
  (req, _res, next) => {
    const parsed = schema.safeParse(req.params);
    if (!parsed.success)
      return next(new Error(parsed.error.message, { cause: { status: 400 } }));
    Object.assign(req.params, parsed.data as Record<string, unknown>);
    next();
  };
