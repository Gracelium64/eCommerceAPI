import type { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  let status = 500;
  let message = "Internal server error";

  if (err instanceof Error) {
    message = err.message;
    if (err.cause && typeof err.cause === "object" && "status" in err.cause) {
      status = (err.cause as { status: number }).status;
      if ((err.cause as { code?: string }).code === "ACCESS_TOKEN_EXPIRED") {
        res.setHeader("WWW-Authenticate", 'Bearer error="token_expired"');
      }
    }
  }

  res.status(status).json({ error: message });
};