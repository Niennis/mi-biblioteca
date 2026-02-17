import { RequestHandler } from "express";
import * as profileService from "../services/profile.service.js";
import { updateProfileSchema } from "../utils/validators.js";
import { ok } from "../utils/apiResponse.js";

export const getProfile: RequestHandler = async (req, res, next) => {
  try {
    const profile = await profileService.getProfile(req.userId);
    if (!profile) {
      res.status(404).json({ error: "Perfil no encontrado" });
      return;
    }
    ok(res, profile);
  } catch (err) {
    next(err);
  }
};

export const updateProfile: RequestHandler = async (req, res, next) => {
  try {
    const data = updateProfileSchema.parse(req.body);
    const profile = await profileService.updateProfile(req.userId, data);
    ok(res, profile);
  } catch (err) {
    next(err);
  }
};
