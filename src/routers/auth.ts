import express from "express";
import {
  login,
  getMe,
  logout,
  refreshToken,
} from "@controllers/AuthController";
import { verifyAccessToken } from "@helpers/jwt.helper";

const router = express.Router();

router.post("login", login);
router.post("logout", verifyAccessToken, logout);
router.post("refreshToken", refreshToken);
router.get("me", verifyAccessToken, getMe);

export default router