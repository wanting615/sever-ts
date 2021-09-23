"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const DB_URL = 'mongodb://localhost/elm_database';
class db {
    static connect() {
        mongoose_1.default.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
        mongoose_1.default.connection.on('connected', function () {
            console.log("mongoose connected success", DB_URL);
        });
        mongoose_1.default.connection.on('error', function (err) {
            console.log("mongoose connected error", err);
        });
        mongoose_1.default.connection.on('disconnected', function () {
            console.log("mongoose connected disconnected");
        });
    }
}
exports.default = db;
//# sourceMappingURL=db.js.map