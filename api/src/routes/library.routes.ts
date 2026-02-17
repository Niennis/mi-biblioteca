import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import * as libraryCtrl from "../controllers/library.controller.js";

export const libraryRoutes = Router();
libraryRoutes.use(requireAuth);
libraryRoutes.get("/", libraryCtrl.list);
libraryRoutes.post("/", libraryCtrl.add);
libraryRoutes.get("/:id", libraryCtrl.getOne);
libraryRoutes.patch("/:id", libraryCtrl.update);
libraryRoutes.delete("/:id", libraryCtrl.remove);
