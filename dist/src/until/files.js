"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readfile = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function readfile(filePath) {
    const file = path_1.default.resolve(__dirname, filePath);
    return new Promise((resolve) => {
        fs_1.default.readFile(file, (error, buffer) => {
            if (error) {
                resolve(null);
                return;
            }
            let d = JSON.parse(buffer.toString());
            resolve(d);
        });
    });
}
exports.readfile = readfile;
//# sourceMappingURL=files.js.map