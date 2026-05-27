import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { ACCESS_JWT_SECRET } from "#config";

export const authenticate: RequestHandler = (req, _res, next) => {
  try {
    const header = req.header("authorization");
    const token = header?.startsWith("Bearer ") ? header.split(" ")[1] : undefined;
    if (!token) throw new Error("Access token is required.", { cause: { status: 401 } });

    const decoded = jwt.verify(token, ACCESS_JWT_SECRET) as jwt.JwtPayload;
    if (!decoded.sub) throw new Error("Invalid access token payload.", { cause: { status: 401 } });

    req.user = {
      id: String(decoded.sub),
      roles: Array.isArray(decoded.roles) ? decoded.roles : []
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new Error("Expired access token", { cause: { status: 401, code: "ACCESS_TOKEN_EXPIRED" } }));
    }
    next(new Error("Invalid access token.", { cause: { status: 401 } }));
  }
};