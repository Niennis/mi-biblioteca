import { RequestHandler } from "express";
import * as libraryService from "../services/library.service.js";
import { addBookSchema, updateUserBookSchema, libraryQuerySchema } from "../utils/validators.js";
import { ok, created, noContent } from "../utils/apiResponse.js";

export const list: RequestHandler = async (req, res, next) => {
  try {
    const filters = libraryQuerySchema.parse(req.query);
    const items = await libraryService.getLibrary(req.userId, filters);
    ok(res, items);
  } catch (err) {
    next(err);
  }
};

export const add: RequestHandler = async (req, res, next) => {
  try {
    const input = addBookSchema.parse(req.body);
    const userBook = await libraryService.addBook(req.userId, input);
    created(res, userBook);
  } catch (err: any) {
    if (err.code === "P2002") {
      res.status(409).json({ error: "Este libro ya está en tu biblioteca" });
      return;
    }
    next(err);
  }
};

export const getOne: RequestHandler = async (req, res, next) => {
  try {
    const userBook = await libraryService.getUserBook(req.userId, req.params.id as string);
    if (!userBook) {
      res.status(404).json({ error: "Libro no encontrado en tu biblioteca" });
      return;
    }
    ok(res, userBook);
  } catch (err) {
    next(err);
  }
};

export const update: RequestHandler = async (req, res, next) => {
  try {
    const data = updateUserBookSchema.parse(req.body);
    const userBook = await libraryService.updateUserBook(
      req.userId,
      req.params.id as string,
      data
    );
    if (!userBook) {
      res.status(404).json({ error: "Libro no encontrado en tu biblioteca" });
      return;
    }
    ok(res, userBook);
  } catch (err) {
    next(err);
  }
};

export const remove: RequestHandler = async (req, res, next) => {
  try {
    const removed = await libraryService.removeBook(req.userId, req.params.id as string);
    if (!removed) {
      res.status(404).json({ error: "Libro no encontrado en tu biblioteca" });
      return;
    }
    noContent(res);
  } catch (err) {
    next(err);
  }
};
