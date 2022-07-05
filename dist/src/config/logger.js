"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const config_1 = require("./config");
const winston_1 = require("winston");
const path = __importStar(require("path"));
const logger = (winstonInstance) => {
    winstonInstance.configure({
        level: config_1.config.debugLogging ? "debug" : "info",
        transports: [
            //
            // - Write all logs error (and below) to `error.log`.
            new winston_1.transports.File({ filename: path.resolve(__dirname, "../error.log"), level: "error" }),
            //
            // - Write to all logs with specified level to console.
            new winston_1.transports.Console({
                format: winston_1.format.combine(winston_1.format.colorize(), winston_1.format.simple())
            })
        ]
    });
    return async (ctx, next) => {
        const start = new Date().getTime();
        try {
            await next();
        }
        catch (err) {
            ctx.status = err.status || 500;
            ctx.body = err.message;
        }
        const ms = new Date().getTime() - start;
        let logLevel;
        if (ctx.status >= 500) {
            logLevel = "error";
        }
        else if (ctx.status >= 400) {
            logLevel = "warn";
        }
        else {
            logLevel = "info";
        }
        const msg = `${ctx.method} ${ctx.originalUrl} ${ctx.status} ${ms}ms`;
        winstonInstance.log(logLevel, msg);
    };
};
exports.logger = logger;
//# sourceMappingURL=logger.js.map