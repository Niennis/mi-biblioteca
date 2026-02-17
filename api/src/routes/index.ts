import { Router } from "express";
import { authRoutes } from "./auth.routes.js";
import { booksRoutes } from "./books.routes.js";
import { libraryRoutes } from "./library.routes.js";
import { profileRoutes } from "./profile.routes.js";

export const router = Router();

router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

router.use("/auth", authRoutes);
router.use("/books", booksRoutes);
router.use("/library", libraryRoutes);
router.use("/profile", profileRoutes);
