import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);

  if (err instanceof ZodError) {
    res.status(400).json({
      error: "Datos inválidos",
      details: err.errors,
    });
    return;
  }

  const status = err.status ?? 500;
  const message = err.message ?? "Error interno del servidor";
  res.status(status).json({ error: message });
};
