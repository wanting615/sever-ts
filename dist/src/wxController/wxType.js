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
const wx_model_1 = require("./model/wx-model");
const ids_1 = require("../model/ids");
const needLogin_1 = require("./middleware/needLogin");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
//微信小程序添加知识文档
class WxController {
    async addWxtype(ctx) {
        const { name, contentTypes, iconUrl } = ctx.request.body;
        if (!name) {
            ctx.fail("请输入文档类型");
            return;
        }
        if (!contentTypes) {
            ctx.fail("请输入子文档类型");
            return;
        }
        if (!iconUrl) {
            ctx.fail("请上传文档类型icon");
        }
        try {
            const arr = contentTypes.split(",");
            const id = await ids_1.IdsModel.getIds("wx_type_id");
            const data = new wx_model_1.WxTypeModel({
                id,
                type: id,
                name,
                iconUrl,
                contentTypes: arr
            });
            await data.save();
            ctx.success(data, "添加成功");
        }
        catch (error) {
            ctx.fail("添加失败");
        }
    }
    async updateWxtype(ctx) {
        const { id, name, contentTypes, iconUrl } = ctx.request.body;
        if (!id) {
            ctx.fail("文档不存在");
            return;
        }
        if (!name) {
            ctx.fail("请输入文档类型");
            return;
        }
        if (!contentTypes) {
            ctx.fail("请输入子文档类型");
            return;
        }
        if (!iconUrl) {
            ctx.fail("请上传文档类型icon");
        }
        try {
            const data = await wx_model_1.WxTypeModel.getWxTypeById(Number(id));
            if (!data) {
                ctx.fail("文档不存在");
                return;
            }
            const arr = contentTypes.split(",");
            data.name = name;
            data.contentTypes = arr;
            data.iconUrl = iconUrl;
            await data.save();
            ctx.success(data, "更新成功");
        }
        catch (error) {
            console.log(error);
            ctx.fail("更新失败");
        }
    }
    async getTypeList(ctx) {
        try {
            const data = await wx_model_1.WxTypeModel.getWxTypeAll();
            ctx.success(data, "");
        }
        catch (error) {
            console.log(error);
        }
    }
    async uploadTypeImg(ctx) {
        try {
            const file = ctx.request.files.file; // 获取上传文件
            // 创建可读流
            if (Array.isArray(file)) {
                return;
            }
            const reader = fs_1.default.createReadStream(file.path);
            //assets/icons/
            const filePath = path_1.default.join(path_1.default.resolve(__dirname, "../.."), "webContent/static/assets/icons/") + `${file.name}`;
            // 创建可写流
            const upStream = fs_1.default.createWriteStream(filePath);
            // 可读流通过管道写入可写流
            reader.pipe(upStream);
            ctx.body = {
                status: true,
                message: "文件上传成功",
                url: `assets/icons/${file.name}`,
            };
        }
        catch (error) {
            console.log(error);
            ctx.fail("上传异常");
        }
    }
}
__decorate([
    (0, koa_swagger_decorator_1.request)("post", "/addWxtype"),
    (0, koa_swagger_decorator_1.summary)("微信小程序添加文档类型"),
    (0, koa_swagger_decorator_1.body)({
        name: { type: "string", require: true },
        contentTypes: { type: "string", require: true },
        iconUrl: { type: "string", require: true }
    }),
    (0, koa_swagger_decorator_1.middlewares)([needLogin_1.needLogin]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WxController.prototype, "addWxtype", null);
__decorate([
    (0, koa_swagger_decorator_1.request)("post", "/updateWxtype"),
    (0, koa_swagger_decorator_1.summary)("微信小程序添加文档类型"),
    (0, koa_swagger_decorator_1.body)({
        name: { type: "string", require: true },
        contentTypes: { type: "string", require: true },
        iconUrl: { type: "string", require: true },
        id: { type: "number", require: true }
    }),
    (0, koa_swagger_decorator_1.middlewares)([needLogin_1.needLogin]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WxController.prototype, "updateWxtype", null);
__decorate([
    (0, koa_swagger_decorator_1.request)("get", "/getTypeList"),
    (0, koa_swagger_decorator_1.summary)("获取所有文档类型"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WxController.prototype, "getTypeList", null);
__decorate([
    (0, koa_swagger_decorator_1.request)("post", "/uploadTypeImg"),
    (0, koa_swagger_decorator_1.summary)("上传文档类型图片"),
    (0, koa_swagger_decorator_1.middlewares)([needLogin_1.needLogin]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WxController.prototype, "uploadTypeImg", null);
exports.default = WxController;
//# sourceMappingURL=wxType.js.map