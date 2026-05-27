import { Router } from "express";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import categoryRoutes from "./categoryRoutes.js";
import productRoutes from "./productRoutes.js";

export const allRoutes = Router();

allRoutes.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

allRoutes.use("/auth", authRoutes);
allRoutes.use("/users", userRoutes);
allRoutes.use("/categories", categoryRoutes);
allRoutes.use("/products", productRoutes);
