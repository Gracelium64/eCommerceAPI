import { Router } from "express";
import { login, logout, me, refresh, register } from "#controllers";
import { authenticate, validateBody } from "#middleware";
import { loginSchema, registerSchema } from "#schemas";

const authRoutes = Router();

authRoutes.post("/register", validateBody(registerSchema), register);
authRoutes.post("/login", validateBody(loginSchema), login);
authRoutes.post("/refresh", refresh);
authRoutes.post("/logout", logout);
authRoutes.get("/me", authenticate, me);

export default authRoutes;
