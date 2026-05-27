import { Router } from "express";
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
} from "#controllers";
import { authenticate, validateBody, validateParams } from "#middleware";
import { orderBodySchema, orderParamsSchema } from "#schemas";

const orderRoutes = Router();

orderRoutes.use(authenticate);

orderRoutes
  .route("/")
  .get(getAllOrders)
  .post(validateBody(orderBodySchema), createOrder);

orderRoutes
  .route("/:id")
  .get(validateParams(orderParamsSchema), getOrderById)
  .put(
    validateParams(orderParamsSchema),
    validateBody(orderBodySchema),
    updateOrder,
  )
  .delete(validateParams(orderParamsSchema), deleteOrder);

export default orderRoutes;
