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
var Hongbao_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HongbaoModel = void 0;
const typegoose_1 = require("@typegoose/typegoose");
let DescMap = class DescMap {
};
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], DescMap.prototype, "phone", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], DescMap.prototype, "online_paid_only", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], DescMap.prototype, "validity_delta", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], DescMap.prototype, "validity_periods", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], DescMap.prototype, "sum_condition", void 0);
DescMap = __decorate([
    (0, typegoose_1.modelOptions)({ schemaOptions: { _id: false } })
], DescMap);
let Hongbao = Hongbao_1 = class Hongbao {
    static async getHongbaos(user_id, status, limit = 10, offset = 1) {
        const data = await this.updateHongbaos(user_id);
        return await this.find({ user_id, status, present_status: 1 }, '-_id').limit(limit).skip((offset - 1) * limit);
    }
    static async getHongbaoById(id) {
        return await this.findOne({ id });
    }
    /**
     * 更新过期红包
     */
    static async updateHongbaos(user_id) {
        const nowDate = new Date();
        const hongbaoList = await this.find({ user_id: user_id, status: 0 });
        for (var i = 0; i < hongbaoList.length; i++) {
            if (new Date(hongbaoList[i].end_date) < nowDate) {
                hongbaoList[i].status = 1;
                await hongbaoList[i].save();
            }
        }
    }
};
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Number)
], Hongbao.prototype, "id", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Date)
], Hongbao.prototype, "sn", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Number)
], Hongbao.prototype, "user_id", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Number)
], Hongbao.prototype, "amount", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Number)
], Hongbao.prototype, "sum_condition", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], Hongbao.prototype, "name", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: '' }),
    __metadata("design:type", String)
], Hongbao.prototype, "phone", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Date)
], Hongbao.prototype, "begin_date", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Date)
], Hongbao.prototype, "end_date", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: 0 }),
    __metadata("design:type", Number)
], Hongbao.prototype, "status", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: 1 }),
    __metadata("design:type", Number)
], Hongbao.prototype, "present_status", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: 1 }),
    __metadata("design:type", Number)
], Hongbao.prototype, "share_status", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, type: DescMap }),
    __metadata("design:type", DescMap)
], Hongbao.prototype, "description_map", void 0);
Hongbao = Hongbao_1 = __decorate([
    (0, typegoose_1.modelOptions)({ options: { customName: 'hongbaos' }, schemaOptions: { _id: false } })
], Hongbao);
exports.HongbaoModel = (0, typegoose_1.getModelForClass)(Hongbao);
//# sourceMappingURL=hongbao.js.map