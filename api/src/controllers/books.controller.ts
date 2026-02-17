import { RequestHandler } from "express";
import { searchBooks } from "../services/bookSearch.service.js";
import { searchQuerySchema } from "../utils/validators.js";
import { ok } from "../utils/apiResponse.js";

export const search: RequestHandler = async (req, res, next) => {
  try {
    const { q, page } = searchQuerySchema.parse(req.query);
    const result = await searchBooks(q, page);
    ok(res, result);
  } catch (err) {
    next(err);
  }
};
