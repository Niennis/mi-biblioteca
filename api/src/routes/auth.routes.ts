import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { sync } from "../controllers/auth.controller.js";

export const authRoutes = Router();
authRoutes.post("/sync", requireAuth, sync);
