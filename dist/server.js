"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const koa_body_1 = __importDefault(require("koa-body"));
const koa_helmet_1 = __importDefault(require("koa-helmet"));
const cors_1 = __importDefault(require("@koa/cors"));
const koa_json_1 = __importDefault(require("koa-json"));
const koa_static_1 = __importDefault(require("koa-static"));
const koa_logger_1 = __importDefault(require("koa-logger"));
const path_1 = __importDefault(require("path"));
const moment_1 = __importDefault(require("moment"));
// import winston from "winston";
const db_1 = __importDefault(require("./config/db"));
const router_1 = require("./router/router");
const config_1 = require("./config/config");
//连接数据库
db_1.default.connect();
const app = new koa_1.default();
// // error handler
// onerror(app);
//安全标头
app.use((0, koa_helmet_1.default)());
//打印日志
const koaLogger = (0, koa_logger_1.default)((str) => {
    console.log((0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss') + str);
});
app.use(koaLogger);
//解决跨域
app.use((0, cors_1.default)({
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization', 'Date'],
    maxAge: 100,
    credentials: true,
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Custom-Header', 'anonymous'],
}));
app.use((0, koa_body_1.default)({
    multipart: true,
    formidable: {
        multiples: true,
        // uploadDir: path.join(__dirname, PathName.FILEPATH),// 设置文件上传目录
        maxFieldsSize: 2000 * 1024 * 1024,
        onFileBegin: (name) => {
            console.log(name);
        }
    }
}));
app.use((0, koa_json_1.default)());
// Logger middleware -> use winston as logger (logging.ts with config)
// app.use(logger(winston));
//静态文件路径
// app.use(require('koa-static')(__dirname + PathName.STATICPATH));
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx);
});
//注册路由
app.use(router_1.router.routes());
//images
// app.use(async (ctx) => {
//   let filePath = path.join(__dirname, ctx.url);
//   let file = null;
//   try {
//     file = fs.readFileSync(filePath);
//   } catch (error) {
//     filePath = path.join(__dirname, PathName.LOSTIMAGE);
//     file = fs.readFileSync(filePath);
//   }
//   let mineType = mime.lookup(filePath);
//   ctx.set('content-type', mineType);
//   ctx.body = file;
// })
app.use((0, koa_static_1.default)(path_1.default.join(__dirname, "./")));
app.listen(config_1.config.port);
//# sourceMappingURL=server.js.map