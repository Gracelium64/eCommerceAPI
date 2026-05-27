import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
} from "#controllers";
import {
  authenticate,
  authorize,
  validateBody,
  validateParams,
} from "#middleware";
import { categoryBodySchema, categoryParamsSchema } from "#schemas";

const categoryRoutes = Router();

categoryRoutes
  .route("/")
  .get(getAllCategories)
  .post(
    authenticate,
    authorize("admin", "manager"),
    validateBody(categoryBodySchema),
    createCategory,
  );

categoryRoutes
  .route("/:id")
  .get(validateParams(categoryParamsSchema), getCategoryById)
  .put(
    authenticate,
    authorize("admin", "manager"),
    validateParams(categoryParamsSchema),
    validateBody(categoryBodySchema),
    updateCategory,
  )
  .delete(
    authenticate,
    authorize("admin", "manager"),
    validateParams(categoryParamsSchema),
    deleteCategory,
  );

export default categoryRoutes;
