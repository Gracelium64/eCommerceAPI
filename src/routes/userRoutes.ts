import { Router } from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "#controllers";
import {
  authenticate,
  authorize,
  validateBody,
  validateParams,
} from "#middleware";
import { userCreateSchema, userParamsSchema, userUpdateSchema } from "#schemas";

const userRoutes = Router();

userRoutes.use(authenticate, authorize("admin"));

userRoutes
  .route("/")
  .get(getAllUsers)
  .post(validateBody(userCreateSchema), createUser);

userRoutes
  .route("/:id")
  .get(validateParams(userParamsSchema), getUserById)
  .put(
    validateParams(userParamsSchema),
    validateBody(userUpdateSchema),
    updateUser,
  )
  .delete(validateParams(userParamsSchema), deleteUser);

export default userRoutes;
