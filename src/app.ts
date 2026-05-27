import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDb } from "#db";
import { allRoutes } from "#routes";
import { errorHandler, notFoundHandler } from "#middleware";
import { PORT, CLIENT_BASE_URL } from "#config";
import { swaggerUi, swaggerSpec } from "#docs";

const app = express();

app.use(
  cors({
    origin: CLIENT_BASE_URL,
    credentials: true,
    exposedHeaders: ["WWW-Authenticate"],
  }),
);
app.use(express.json(), cookieParser());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/", allRoutes);

app.use("*splat", notFoundHandler);
app.use(errorHandler);

await connectDb();
app.listen(PORT, () =>
  console.log(`Server listening on http://localhost:${PORT}`),
);
