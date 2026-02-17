import { Response } from "express";

export function ok(res: Response, data: unknown) {
  res.json({ data });
}

export function created(res: Response, data: unknown) {
  res.status(201).json({ data });
}

export function noContent(res: Response) {
  res.status(204).end();
}
