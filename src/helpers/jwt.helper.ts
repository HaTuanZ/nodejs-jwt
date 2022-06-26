import jwt from "jsonwebtoken";

import User from "@models/User";
import { Request, Response, NextFunction } from "express";

const TOKEN_KEY = process.env.TOKEN_KEY || "sceret-key";
const REFRESH_TOKEN = process.env.REFRESH_TOKEN || "sceret-key";

const signAccessToken = (user_id: string, email: string) => {
  return new Promise<any>((resolve, reject) => {
    jwt.sign(
      { user_id, email },
      TOKEN_KEY,
      { expiresIn: "2h" },
      (err, token) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(token);
      }
    );
  });
};
const verifyAccessToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(403).json({ message: "Invalid token" });
  }

  jwt.verify(token, TOKEN_KEY, (err: any, payload: any) => {
    if (err) {
      if (err.name == "TokenExpiredError") {
        return res.status(401).json({ message: err.message });
      }
      if (err.name === "JsonWebTokenError") {
        return res.status(403).json({ message: err.message });
      }
    }
    req.body.user = payload;
    next();
  });
};
const signRefreshToken = (user_id: string) => {
  return new Promise<any>((resolve, reject) => {
    jwt.sign(
      {},
      REFRESH_TOKEN,
      { expiresIn: "2h", audience: user_id },
      (err, token) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(token);
      }
    );
  });
};
const verifyRefreshToken = (refreshToken: string) => {
  return new Promise((resolve, reject) => {
    jwt.verify(refreshToken, REFRESH_TOKEN, (err, payload: any) => {
      if (err) return reject(err);
      User.findOne({ _id: payload.aud }, function (err: any, user: any) {
        if (err) {
          return reject(err);
        }
        if (user && user.refresh_token == refreshToken) {
          return resolve(user);
        }
        return reject();
      });
    });
  });
};
export {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken,
};
