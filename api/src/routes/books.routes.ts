import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { search } from "../controllers/books.controller.js";

export const booksRoutes = Router();
booksRoutes.get("/search", requireAuth, search);
