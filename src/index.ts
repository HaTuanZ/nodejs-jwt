import express from "express";
import { json } from "body-parser";
import * as dotenv from "dotenv";
import * as rfs from "rotating-file-stream";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import path from "path";

import "module-alias/register";
dotenv.config({ path: __dirname + "/./../.env" });
import router from "@routers/index";
import connectDatabase from "@configs/database.config";
connectDatabase();

const app = express();
const isProduction = process.env.NODE_ENV === "production";
app.use(helmet());

app.use(json());
app.use(cookieParser());

const accessLogStream = rfs.createStream("access.log", {
  interval: "1d",
  path: path.join(__dirname, "log"),
});

app.use(
  isProduction ? morgan("combined", { stream: accessLogStream }) : morgan("dev")
);

app.use("/api", router);

app.listen(3000, () => {
  console.log("server listening on port localhost:3000");
});