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
var WxType_1, WxClass_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WxClassModel = exports.WxTypeModel = void 0;
const typegoose_1 = require("@typegoose/typegoose");
//微信小程序文档类型
let WxType = WxType_1 = class WxType {
    static async getWxTypeById(id) {
        return this.findOne({ id }, { _id: 0, __v: 0 });
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
let WxClass = WxClass_1 = class WxClass {
    //获取type类型的文档
    static async getDocByType(type, contentType, page, limit = 10) {
        return this.find({ type, contentType }, { _v: 0, _id: 0 }).sort({ creatAt: -1 }).limit(limit).skip((page - 1) * limit);
    }
    //获取某类型总条数
    static async getDocNumByType(type, contentType) {
        return this.find({ type, contentType });
    }
    //通过id获取某文档
    static async getWxInfoById(id) {
        return this.findOne({ id });
    }
    //删除某文档
    static async delDocById(id) {
        return this.remove({ id });
    }
};
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Number)
], WxClass.prototype, "id", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Number)
], WxClass.prototype, "type", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: "info" }),
    __metadata("design:type", String)
], WxClass.prototype, "contentType", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], WxClass.prototype, "title", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], WxClass.prototype, "typeName", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], WxClass.prototype, "content", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: new Date }),
    __metadata("design:type", Date)
], WxClass.prototype, "creatAt", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: "Mr Wan" }),
    __metadata("design:type", String)
], WxClass.prototype, "autor", void 0);
WxClass = WxClass_1 = __decorate([
    (0, typegoose_1.modelOptions)({ schemaOptions: { collection: "wechat" } })
], WxClass);
const WxTypeModel = (0, typegoose_1.getModelForClass)(WxType);
exports.WxTypeModel = WxTypeModel;
const WxClassModel = (0, typegoose_1.getModelForClass)(WxClass);
exports.WxClassModel = WxClassModel;
//# sourceMappingURL=wx-model.js.map