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
const PORT = process.env.NODE_DOCKER_PORT || 8080;
app.use("/api", router);
app.listen(PORT, () => {
  console.log(`server listening on port localhost:${PORT}`);
  app._router.stack.forEach(print.bind(null, []));
});

function print(path: any, layer: any) {
  if (layer.route) {
    layer.route.stack.forEach(
      print.bind(null, path.concat(split(layer.route.path)))
    );
  } else if (layer.name === "router" && layer.handle.stack) {
    layer.handle.stack.forEach(
      print.bind(null, path.concat(split(layer.regexp)))
    );
  } else if (layer.method) {
    console.log(
      "%s /%s",
      layer.method.toUpperCase(),
      path.concat(split(layer.regexp)).filter(Boolean).join("/")
    );
  }
}

function split(thing: any) {
  if (typeof thing === "string") {
    return thing.split("/");
  } else if (thing.fast_slash) {
    return "";
  } else {
    var match = thing
      .toString()
      .replace("\\/?", "")
      .replace("(?=\\/|$)", "$")
      .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//);
    return match
      ? match[1].replace(/\\(.)/g, "$1").split("/")
      : "<complex:" + thing.toString() + ">";
  }
}

