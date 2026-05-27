import { Router } from "express";
import authRoutes from "./authRoutes.js";

export const allRoutes = Router();

allRoutes.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

allRoutes.use("/auth", authRoutes);
