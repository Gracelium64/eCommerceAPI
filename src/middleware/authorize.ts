import type { RequestHandler } from "express";

export const authorize = (...allowedRoles: string[]): RequestHandler => (req, _res, next) => {
  if (!req.user) return next(new Error("Unauthorized", { cause: { status: 401 } }));
  if (req.user.roles.some((r) => allowedRoles.includes(r))) return next();
  return next(new Error("Forbidden", { cause: { status: 403 } }));
};