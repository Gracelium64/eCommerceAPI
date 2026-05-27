import type { HydratedDocument } from "mongoose";
import type { Order } from "#models";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; roles: string[] };
      orderDoc?: HydratedDocument<Order>;
    }
  }
}
declare module "swagger-jsdoc";

export {};
