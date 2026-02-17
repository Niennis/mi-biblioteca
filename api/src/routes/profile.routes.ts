import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import * as profileCtrl from "../controllers/profile.controller.js";

export const profileRoutes = Router();
profileRoutes.use(requireAuth);
profileRoutes.get("/", profileCtrl.getProfile);
profileRoutes.patch("/", profileCtrl.updateProfile);
