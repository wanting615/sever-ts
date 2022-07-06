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
var WxUser_1, WxFeedBack_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WxFeedBackModel = exports.WxUserModel = void 0;
const typegoose_1 = require("@typegoose/typegoose");
// 微信用户
let WxUser = WxUser_1 = class WxUser {
    static async findUser(openid) {
        return this.findOne({ openid });
    }
    static async updateUser(openid, userInfo) {
        return this.updateOne({ openid }, userInfo);
    }
};
__decorate([
    (0, typegoose_1.prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], WxUser.prototype, "openid", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], WxUser.prototype, "session_key", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: "" }),
    __metadata("design:type", String)
], WxUser.prototype, "nickName", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: null }),
    __metadata("design:type", Number)
], WxUser.prototype, "gender", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: "" }),
    __metadata("design:type", String)
], WxUser.prototype, "avatarUrl", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number, default: [] }) // 阅读记录
    ,
    __metadata("design:type", Array)
], WxUser.prototype, "views", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number, default: [] }) // 点赞记录
    ,
    __metadata("design:type", Array)
], WxUser.prototype, "praises", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: Date.now }),
    __metadata("design:type", Date)
], WxUser.prototype, "creatAt", void 0);
WxUser = WxUser_1 = __decorate([
    (0, typegoose_1.modelOptions)({ schemaOptions: { collection: "wechatUser" }, options: { allowMixed: 0 } })
], WxUser);
// 文档意见提交
let WxFeedBack = WxFeedBack_1 = class WxFeedBack {
    static async findFeedBack(openid) {
        return await this.findOne({ openid }, { $sort: { _id: -1 } });
    }
};
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], WxFeedBack.prototype, "openid", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Number)
], WxFeedBack.prototype, "docId", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], WxFeedBack.prototype, "info", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: "" }),
    __metadata("design:type", String)
], WxFeedBack.prototype, "autor", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: Date.now }),
    __metadata("design:type", Date)
], WxFeedBack.prototype, "creatAt", void 0);
WxFeedBack = WxFeedBack_1 = __decorate([
    (0, typegoose_1.modelOptions)({ schemaOptions: { collection: "wechatFeedback" } })
], WxFeedBack);
const WxUserModel = (0, typegoose_1.getModelForClass)(WxUser);
exports.WxUserModel = WxUserModel;
const WxFeedBackModel = (0, typegoose_1.getModelForClass)(WxFeedBack);
exports.WxFeedBackModel = WxFeedBackModel;
//# sourceMappingURL=wxUser-model.js.map