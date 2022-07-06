"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.localPath = exports.PathName = void 0;
exports.PathName = {
    "STATICPATH": "/webContent/",
    "LOSTIMAGE": "/webContent/static/index.html",
    "WXINDEX": "/webContent/dist/index.html",
    "FILEPATH": "/webContent/files/"
};
exports.localPath = process.env.NODE_ENV === "product" ? "https://wanting615.com.cn/" : "http://localhost:3000";
//# sourceMappingURL=path.js.map