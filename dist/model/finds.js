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
var Find_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindModel = void 0;
const typegoose_1 = require("@typegoose/typegoose");
let ReplaysDetail = class ReplaysDetail {
};
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Number)
], ReplaysDetail.prototype, "replyId", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: "" }),
    __metadata("design:type", String)
], ReplaysDetail.prototype, "username", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Number)
], ReplaysDetail.prototype, "userId", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: "default.jpg" }),
    __metadata("design:type", String)
], ReplaysDetail.prototype, "userAvatar", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], ReplaysDetail.prototype, "detail", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: Date.now }),
    __metadata("design:type", Date)
], ReplaysDetail.prototype, "time", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: 0 }),
    __metadata("design:type", Number)
], ReplaysDetail.prototype, "praises", void 0);
ReplaysDetail = __decorate([
    (0, typegoose_1.modelOptions)({ schemaOptions: { _id: false } })
], ReplaysDetail);
let Find = Find_1 = class Find {
    static async getFinds(page = 1, limit = 10) {
        return await this.find({}, { _id: 0, __v: 0 }).sort({ time: -1 }).limit(limit).skip((page - 1) * limit);
    }
    static async getFindById(id) {
        return await this.findOne({ id });
    }
    static async getFindByShopId(shopId) {
        return await this.find({ shopId });
    }
};
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Number)
], Find.prototype, "id", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Number)
], Find.prototype, "shopId", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], Find.prototype, "vedioPath", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: 0 }),
    __metadata("design:type", Number)
], Find.prototype, "praises", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: 0 }),
    __metadata("design:type", Number)
], Find.prototype, "replys", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: "" }),
    __metadata("design:type", String)
], Find.prototype, "tips", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Find.prototype, "time", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: ReplaysDetail }),
    __metadata("design:type", Array)
], Find.prototype, "replaysDetails", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Object)
], Find.prototype, "shopInfo", void 0);
Find = Find_1 = __decorate([
    (0, typegoose_1.modelOptions)({ options: { allowMixed: 0 }, schemaOptions: { _id: false, collection: "finds" } })
], Find);
const FindModel = (0, typegoose_1.getModelForClass)(Find);
exports.FindModel = FindModel;
//# sourceMappingURL=finds.js.map