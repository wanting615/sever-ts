import Koa from "koa";
import koaBody from "koa-body";
import helmet from "koa-helmet";
import cors from "@koa/cors";
import json from "koa-json";
import koaStatic from "koa-static";
import KoaLogger from "koa-logger";
import fs from "fs";

import path from "path";
import moment from "moment";
// import winston from "winston";
import db from "./config/db";
// import { logger } from "./config/logger";
import { PathName } from "./config/path";
import { router } from "./router/router";
import { config } from "./config/config";




//连接数据库
db.connect();

const app = new Koa();
// // error handler
// onerror(app);
//安全标头
app.use(helmet());


//打印日志
const koaLogger = KoaLogger((str) => {
  console.log(moment().format("YYYY-MM-DD HH:mm:ss") + str);
});
app.use(koaLogger);
//解决跨域
app.use(cors({
  exposeHeaders: ["WWW-Authenticate", "Server-Authorization", "Date"],
  maxAge: 100,
  credentials: true,
  allowMethods: ["GET", "POST", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization", "Accept", "X-Custom-Header", "anonymous"],
}));

app.use(koaBody({
  multipart: true,// 支持文件上传
  formidable: {
    multiples: true,//多文件上传
    // uploadDir: path.join(__dirname, PathName.FILEPATH),// 设置文件上传目录
    maxFieldsSize: 2000 * 1024 * 1024,//设置上传大小 20m
    onFileBegin: (name) => {//上传前可以做一些事情
      console.log(name);
    }
  }
}));

app.use(json());

// Logger middleware -> use winston as logger (logging.ts with config)
// app.use(logger(winston));

//静态文件路径
// app.use(require('koa-static')(__dirname + PathName.STATICPATH));

app.on("error", (err, ctx) => {
  console.error("server error", err, ctx);
});

//注册路由
app.use(router.routes());


app.use(koaStatic(__dirname + "/public"));
app.use(koaStatic(__dirname + "/public/static"));
app.use(koaStatic(__dirname + "/public/dist"));

//html
app.use(async (ctx, next) => {
  //处理访问html页
  if (!ctx.url || ctx.url === "/" || ctx.url.indexOf("html") !== -1) {
    let filePath = path.join(__dirname, "/public/static" + ctx.url);
    let file = null;
    try {
      file = fs.readFileSync(filePath);
    } catch (error) {
      filePath = path.join(__dirname, PathName.WXINDEX);
      file = fs.readFileSync(filePath);
    }
    ctx.set("content-type", "text/html");
    ctx.body = file;
  }
  next();
});

app.listen(config.port);