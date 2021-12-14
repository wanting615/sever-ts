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
Object.defineProperty(exports, "__esModule", { value: true });
const koa_swagger_decorator_1 = require("koa-swagger-decorator");
const wx_model_1 = require("./wx-model");
const ids_1 = require("../model/ids");
//微信小程序添加知识文档
class WxController {
    async loginWx(ctx) {
        const { username, password } = ctx.request.body;
        if (username !== "admin" || password !== "123456") {
            ctx.body = {
                message: "账户密码错误",
                status: false
            };
            return;
        }
        ctx.body = {
            message: "登陆成功",
            status: true,
            data: username + "&" + password
        };
    }
    async addWxLearnInfo(ctx) {
        const params = ctx.request.body;
        const result = ctx.body = {
            status: false,
            message: "",
            data: null
        };
        if (!params.type && Number(params.type) !== 0) {
            result.message = "请输入文档类型";
            return;
        }
        const type = await wx_model_1.WxTypeModel.getWxInfoByType(Number(params.type));
        if (!type) {
            result.message = "文档类型不存在";
            return;
        }
        if (!params.title) {
            result.message = "请输入文档标题";
            return;
        }
        if (!params.content) {
            result.message = "内容不能为空";
            return;
        }
        try {
            const id = await ids_1.IdsModel.getIds("wx_id");
            const data = new wx_model_1.WxClassModel({
                id,
                type: Number(params.type),
                typeName: type.name,
                contentType: params.contentType,
                title: params.title,
                content: params.content,
                autor: params.autor
            });
            await data.save();
            result.status = true;
            result.message = "上传成功";
            result.data = data;
        }
        catch (error) {
            console.log(error);
        }
    }
    async delDoc(ctx) {
        const { id } = ctx.request.query;
        const result = ctx.body = {
            status: false,
            message: "",
            data: null
        };
        if (!id) {
            result.message = "id不能为空";
            return;
        }
        try {
            const data = await wx_model_1.WxClassModel.getWxInfoById(Number(id));
            if (!data) {
                result.message = "该文档不存在";
                return;
            }
            if (data) {
                data.remove();
                result.status = true;
                result.message = "删除成功";
            }
        }
        catch (error) {
            console.log(error);
            result.message = "删除失败";
        }
    }
    async updateWxLearnInfo(ctx) {
        const params = ctx.request.body;
        const result = ctx.body = {
            status: false,
            message: "",
            data: null
        };
        if (!params.type && Number(params.type) !== 0) {
            result.message = "请输入文档类型";
            return;
        }
        const type = await wx_model_1.WxTypeModel.getWxInfoByType(Number(params.type));
        if (!type) {
            result.message = "文档类型不存在";
            return;
        }
        if (!params.title) {
            result.message = "请输入文档标题";
            return;
        }
        if (!params.content) {
            result.message = "内容不能为空";
            return;
        }
        try {
            const data = await wx_model_1.WxClassModel.getWxInfoById(Number(params.id));
            if (!data) {
                result.message = "该文档不存在!";
            }
            data.type = Number(params.type);
            data.typeName = type.name;
            data.contentType = params.contentType;
            data.title = params.title;
            data.content = params.content;
            data.autor = params.autor;
            await data.save();
            result.status = true;
            result.message = "更新成功";
            result.data = data;
        }
        catch (error) {
            console.log(error);
        }
    }
    async getDocByType(ctx) {
        const { type, contentType, page } = ctx.request.query;
        try {
            const data = await wx_model_1.WxClassModel.getDocByType(Number(type), contentType, Number(page));
            const pages = await wx_model_1.WxClassModel.getDocNumByType(Number(type), contentType);
            ctx.body = {
                status: true,
                message: "",
                pages: Math.ceil(pages.length / 10),
                data
            };
        }
        catch (error) {
            console.log(error);
        }
    }
}
__decorate([
    (0, koa_swagger_decorator_1.request)("post", "/loginWx"),
    (0, koa_swagger_decorator_1.summary)("微信小程序后台登陆"),
    (0, koa_swagger_decorator_1.body)({
        username: {
            type: "string",
            require: true
        },
        password: {
            type: "string"
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WxController.prototype, "loginWx", null);
__decorate([
    (0, koa_swagger_decorator_1.request)("post", "/addWxLearnInfo"),
    (0, koa_swagger_decorator_1.summary)("微信小程序添加文档"),
    (0, koa_swagger_decorator_1.body)({
        type: {
            type: "number",
            require: true
        },
        contentType: {
            type: "string"
        },
        title: {
            type: "string",
            require: true
        },
        content: {
            type: "string",
            require: true
        },
        autor: {
            type: "string",
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WxController.prototype, "addWxLearnInfo", null);
__decorate([
    (0, koa_swagger_decorator_1.request)("get", "/delDoc"),
    (0, koa_swagger_decorator_1.summary)("删除某文档"),
    (0, koa_swagger_decorator_1.query)({
        id: {
            type: "number",
            require: true
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WxController.prototype, "delDoc", null);
__decorate([
    (0, koa_swagger_decorator_1.request)("post", "/updateWxLearnInfo"),
    (0, koa_swagger_decorator_1.summary)("微信小程序更新文档"),
    (0, koa_swagger_decorator_1.body)({
        id: {
            type: "number",
            require: true
        },
        type: {
            type: "number",
            require: true
        },
        contentType: {
            type: "string"
        },
        title: {
            type: "string",
            require: true
        },
        content: {
            type: "string",
            require: true
        },
        autor: {
            type: "string",
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WxController.prototype, "updateWxLearnInfo", null);
__decorate([
    (0, koa_swagger_decorator_1.request)("get", "/getDocByType"),
    (0, koa_swagger_decorator_1.summary)("获取type类型的文档"),
    (0, koa_swagger_decorator_1.query)({
        type: { type: "number", require: true },
        contentType: { type: "string", require: true },
        page: { type: "number", default: 1 },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WxController.prototype, "getDocByType", null);
exports.default = WxController;
//# sourceMappingURL=wx.js.map