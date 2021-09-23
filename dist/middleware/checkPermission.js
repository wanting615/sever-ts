"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.needLogin = void 0;
const user_1 = require("../model/user");
const rsa_1 = __importDefault(require("./../until/rsa"));
//登陆校验
const needLogin = async (ctx, next) => {
    ctx.body = {
        status: false,
        message: ''
    };
    const token = ctx.header.access_token || ctx.query.token;
    if (!token) {
        ctx.body.message = "请登陆！";
        return;
    }
    const paramsStr = rsa_1.default.decrypt(token);
    if (!paramsStr) {
        ctx.body.message = "token失效";
        return;
    }
    const params = rsa_1.default.strParse(paramsStr);
    if (!params.username || !params.password) {
        ctx.body.message = '不合法的token';
        return;
    }
    const user = await user_1.UserModel.findUser(params.username);
    if (!user || user.password !== rsa_1.default.encryption(params.password)) {
        ctx.body.message = "token已失效";
        return;
    }
    ctx.query.user_id = user.user_id;
    ctx.request.body.user_id = user.user_id;
    await next();
};
exports.needLogin = needLogin;
//# sourceMappingURL=checkPermission.js.map