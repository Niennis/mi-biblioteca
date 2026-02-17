import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { router } from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";

export const app = express();

app.use(cors({ origin: env.FRONTEND_URL }));
app.use(express.json());

app.use("/api", router);

app.use(errorHandler);
