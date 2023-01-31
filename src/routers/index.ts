import express from "express";
import AuthRouter from "./auth";
const routers = [AuthRouter];
const router = express.Router();

routers.forEach((r) => {
  router.use(r);
});

export default router;
