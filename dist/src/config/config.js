"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: ".env" });
const isDevMode = process.env.NODE_ENV == "development";
const config = {
    port: +(process.env.PORT || 3000),
    debugLogging: isDevMode,
    dbEntitiesPath: [
        ...isDevMode ? ["src/entity/**/*.ts"] : ["dist/entity/**/*.js"],
    ],
    cronJobExpression: "0 * * * *"
};
exports.config = config;
//# sourceMappingURL=config.js.map