"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.localPath = exports.PathName = void 0;
exports.PathName = {
    "STATICPATH": './public/',
    "LOSTIMAGE": '/public/images/404.jpeg',
    "FILEPATH": "/public/files/"
};
exports.localPath = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "http://121.5.32.253:3000";
//# sourceMappingURL=path.js.map