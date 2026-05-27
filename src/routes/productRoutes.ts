import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "#controllers";
import {
  authenticate,
  authorize,
  validateBody,
  validateParams,
  validateQuery,
} from "#middleware";
import {
  productBodySchema,
  productParamsSchema,
  productQuerySchema,
} from "#schemas";

const productRoutes = Router();

productRoutes
  .route("/")
  .get(validateQuery(productQuerySchema), getAllProducts)
  .post(
    authenticate,
    authorize("admin", "manager"),
    validateBody(productBodySchema),
    createProduct,
  );

productRoutes
  .route("/:id")
  .get(validateParams(productParamsSchema), getProductById)
  .put(
    authenticate,
    authorize("admin", "manager"),
    validateParams(productParamsSchema),
    validateBody(productBodySchema),
    updateProduct,
  )
  .delete(
    authenticate,
    authorize("admin", "manager"),
    validateParams(productParamsSchema),
    deleteProduct,
  );

export default productRoutes;
