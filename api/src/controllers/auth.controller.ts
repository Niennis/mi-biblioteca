import { RequestHandler } from "express";
import { syncProfile } from "../services/profile.service.js";
import { ok } from "../utils/apiResponse.js";

export const sync: RequestHandler = async (req, res, next) => {
  try {
    const profile = await syncProfile(req.userId, req.userEmail);
    ok(res, profile);
  } catch (err) {
    next(err);
  }
};
