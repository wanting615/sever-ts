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
var WxType_1, WxDoc_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WxDocModel = exports.WxTypeModel = void 0;
const typegoose_1 = require("@typegoose/typegoose");
//微信小程序文档类型
let WxType = WxType_1 = class WxType {
    static async getWxTypeById(id) {
        return this.findOne({ id }, { __v: 0 });
    }
    static async getWxInfoByType(type) {
        return this.findOne({ type });
    }
    static async getWxTypeAll() {
        return this.find({}, { _id: 0, __v: 0, creatAt: 0 });
    }
};
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Number)
], WxType.prototype, "id", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Number)
], WxType.prototype, "type", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], WxType.prototype, "name", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], WxType.prototype, "iconUrl", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, default: [] }),
    __metadata("design:type", Array)
], WxType.prototype, "contentTypes", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: new Date }),
    __metadata("design:type", Date)
], WxType.prototype, "creatAt", void 0);
WxType = WxType_1 = __decorate([
    (0, typegoose_1.modelOptions)({ schemaOptions: { collection: "wechatType" } })
], WxType);
//微信小程序知识文档
let WxDoc = WxDoc_1 = class WxDoc {
    //获取type类型的文档
    static async getDocByType(type, contentType, page, limit = 10) {
        return this.find({ type, contentType, disabled: { $ne: 1 } }, { _v: 0, _id: 0 }).sort({ creatAt: -1 }).limit(limit).skip((page - 1) * limit);
    }
    //获取某类型总条数
    static async getDocNumByType(type, contentType) {
        return this.find({ type, contentType, disabled: { $ne: 1 } });
    }
    //通过id获取某文档
    static async getWxInfoById(id) {
        return this.findOne({ id });
    }
    //删除某文档
    static async delDocById(id) {
        return this.remove({ id });
    }
    //获取最新文档
    static getDocByTime(page = 1, limit = 10) {
        return this.find({ disabled: { $ne: 1 } }, { _v: 0, _id: 0 }).sort({ creatAt: -1 }).limit(limit).skip((page - 1) * limit);
    }
};
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Number)
], WxDoc.prototype, "id", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Number)
], WxDoc.prototype, "type", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: "info" }),
    __metadata("design:type", String)
], WxDoc.prototype, "contentType", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], WxDoc.prototype, "title", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], WxDoc.prototype, "typeName", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], WxDoc.prototype, "content", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: Date.now }),
    __metadata("design:type", Date)
], WxDoc.prototype, "creatAt", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: "Mr Wan" }),
    __metadata("design:type", String)
], WxDoc.prototype, "autor", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: 0 }),
    __metadata("design:type", Number)
], WxDoc.prototype, "disabled", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: 1 }),
    __metadata("design:type", Number)
], WxDoc.prototype, "views", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: 0 }),
    __metadata("design:type", Number)
], WxDoc.prototype, "praises", void 0);
WxDoc = WxDoc_1 = __decorate([
    (0, typegoose_1.modelOptions)({ schemaOptions: { collection: "wechat" } })
], WxDoc);
const WxTypeModel = (0, typegoose_1.getModelForClass)(WxType);
exports.WxTypeModel = WxTypeModel;
const WxDocModel = (0, typegoose_1.getModelForClass)(WxDoc);
exports.WxDocModel = WxDocModel;
//# sourceMappingURL=wx-model.js.map