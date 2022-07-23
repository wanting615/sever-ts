"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_swagger_decorator_1 = require("koa-swagger-decorator");
const node_fetch_1 = __importDefault(require("node-fetch"));
const config_1 = require("./config");
const wxUser_model_1 = require("./model/wxUser-model");
const wx_model_1 = require("./model/wx-model");
const until_1 = __importDefault(require("./until"));
class WxUser {
    async WxLogin(ctx) {
        const code = ctx.request.body.code;
        if (!code) {
            ctx.fail("code为空");
            return;
        }
        const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${config_1.WxInfo.appid}&secret=${config_1.WxInfo.appSecret}&js_code=${code}&grant_type=authorization_code`;
        const res = await (0, node_fetch_1.default)(url);
        const data = await res.json();
        if (data && data.openid) {
            let userData = await wxUser_model_1.WxUserModel.findUser(data.openid);
            if (!userData) {
                userData = new wxUser_model_1.WxUserModel({
                    openid: data.openid,
                    session_key: data.session_key
                });
                await userData.save();
            }
            else {
                userData.session_key = data.session_key;
                await userData.save();
            }
            ctx.success({
                token: until_1.default.createToken(data.openid),
                nickName: userData.nickName,
                avatarUrl: userData.avatarUrl,
                views: userData.views,
                praises: userData.praises
            }, "登录成功");
        }
        return;
    }
    async updateUserInfo(ctx) {
        try {
            const { token, nickName, gender, avatarUrl } = ctx.request.body;
            if (!token) {
                ctx.fail("用户不存在");
                return;
            }
            const userData = await wxUser_model_1.WxUserModel.findUser(until_1.default.verifywxToken(token));
            if (userData) {
                await wxUser_model_1.WxUserModel.updateUser(userData.openid, {
                    openid: userData.openid,
                    session_key: userData.session_key,
                    nickName,
                    gender: gender,
                    avatarUrl
                });
                ctx.success({
                    nickName: nickName,
                    avatarUrl: avatarUrl
                }, "更新成功");
            }
            else {
                ctx.fail("用户不存在");
            }
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async getUserInfo(ctx) {
        try {
            const { token } = ctx.request.body;
            if (!token) {
                ctx.fail("用户不存在");
                return;
            }
            const userData = await wxUser_model_1.WxUserModel.findUser(until_1.default.verifywxToken(token));
            if (userData) {
                ctx.success({
                    nickName: userData.nickName,
                    avatarUrl: userData.avatarUrl,
                    views: userData.views,
                    praises: userData.praises
                }, "获取成功");
            }
            else {
                ctx.fail("用户不存在");
            }
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async checkLogin(ctx) {
        const { token } = ctx.request.query;
        if (!until_1.default.verifywxToken(token)) {
            ctx.fail("未登录");
            return;
        }
        ctx.success(null, "已登录");
    }
    async WxFeedBack(ctx) {
        const { token, docId, autor, info } = ctx.request.body;
        const openid = until_1.default.verifywxToken(token);
        if (!openid) {
            ctx.fail("用户暂未登录");
            return;
        }
        if (!info) {
            ctx.fail("提交不能为空");
            return;
        }
        try {
            const feedbackData = await wxUser_model_1.WxFeedBackModel.findFeedBack(openid);
            if (feedbackData) {
                const date = new Date(feedbackData.creatAt);
                if (new Date().getTime() - date.getTime() < 60000) {
                    ctx.fail("请间隔一分钟后在发!");
                    return;
                }
            }
            const doc = await wx_model_1.WxDocModel.getWxInfoById(Number(docId));
            if (!doc) {
                ctx.fail("文档不存在");
                return;
            }
            const data = new wxUser_model_1.WxFeedBackModel({ openid, docId, autor, info });
            await data.save();
            ctx.success(null, "提交成功");
        }
        catch (error) {
        }
    }
    async getViews(ctx) {
        const { token, page } = ctx.request.body;
        const openid = until_1.default.verifywxToken(token);
        if (!openid) {
            ctx.fail("未登录");
            return;
        }
        try {
            const userData = await wxUser_model_1.WxUserModel.findOne({ openid });
            const docData = await wxUser_model_1.WxUserModel.findOne({ openid }).populate({
                path: "views",
                options: {
                    limit: 10,
                    skip: (page - 1) * 10
                }
            });
            let history = [];
            if (docData) {
                history = docData.views;
            }
            ctx.success({
                history,
                pages: userData.views ? Math.ceil(userData.views.length / 10) : 0
            }, "查询成功");
        }
        catch (error) {
            console.log(error);
            ctx.fail("查询失败");
        }
    }
    async getPraised(ctx) {
        const { token, page } = ctx.request.body;
        const openid = until_1.default.verifywxToken(token);
        if (!openid) {
            ctx.fail("未登录");
            return;
        }
        try {
            const userData = await wxUser_model_1.WxUserModel.findOne({ openid });
            const docData = await wxUser_model_1.WxUserModel.findOne({ openid }).populate({
                path: "praises",
                options: {
                    limit: 10,
                    skip: (page - 1) * 10,
                    sort: { creatAt: -1 }
                }
            });
            let history = [];
            if (docData) {
                history = docData.praises;
            }
            ctx.success({
                history,
                pages: userData.praises ? Math.ceil(userData.praises.length / 10) : 0
            }, "查询成功");
        }
        catch (error) {
            ctx.fail("查询失败");
        }
    }
}
__decorate([
    (0, koa_swagger_decorator_1.request)("post", "/wxLogin"),
    (0, koa_swagger_decorator_1.summary)("微信小程序用户登录"),
    (0, koa_swagger_decorator_1.body)({
        code: {
            type: "string",
            require: true
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WxUser.prototype, "WxLogin", null);
__decorate([
    (0, koa_swagger_decorator_1.request)("post", "/updateUserInfo"),
    (0, koa_swagger_decorator_1.body)({
        token: { type: "string", require: true },
        nickName: { type: "string" },
        gender: { type: "number", require: false },
        avatarUrl: { type: "string" },
    }),
    (0, koa_swagger_decorator_1.summary)("更新用户信息"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WxUser.prototype, "updateUserInfo", null);
__decorate([
    (0, koa_swagger_decorator_1.request)("post", "/getUserInfo"),
    (0, koa_swagger_decorator_1.body)({
        token: { type: "string", require: true }
    }),
    (0, koa_swagger_decorator_1.summary)("获取用户信息"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WxUser.prototype, "getUserInfo", null);
__decorate([
    (0, koa_swagger_decorator_1.request)("get", "/checkLogin"),
    (0, koa_swagger_decorator_1.summary)("检测是否登录"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WxUser.prototype, "checkLogin", null);
__decorate([
    (0, koa_swagger_decorator_1.request)("post", "/WxFeedBack"),
    (0, koa_swagger_decorator_1.summary)("微信用户文档反馈"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WxUser.prototype, "WxFeedBack", null);
__decorate([
    (0, koa_swagger_decorator_1.request)("post", "/getViews"),
    (0, koa_swagger_decorator_1.summary)("获取文档阅读历史记录"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WxUser.prototype, "getViews", null);
__decorate([
    (0, koa_swagger_decorator_1.request)("post", "/getPraised"),
    (0, koa_swagger_decorator_1.summary)("获取点赞记录"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WxUser.prototype, "getPraised", null);
exports.default = WxUser;
//# sourceMappingURL=wxUser.js.map