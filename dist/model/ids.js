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
var Id_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdsModel = void 0;
const typegoose_1 = require("@typegoose/typegoose");
let Id = Id_1 = class Id {
    //获取自增id
    static async getIds(id) {
        try {
            const idsData = await this.findOne();
            idsData[id] = idsData[id] ? idsData[id] : 0;
            idsData[id]++;
            await idsData.save();
            return idsData[id];
        }
        catch (error) {
            console.log('获取ID数据失败');
            throw new Error(error);
        }
    }
};
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Number)
], Id.prototype, "restaurant_id", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Number)
], Id.prototype, "food_id", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Number)
], Id.prototype, "order_id", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Number)
], Id.prototype, "user_id", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Number)
], Id.prototype, "address_id", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Number)
], Id.prototype, "cart_id", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Number)
], Id.prototype, "img_id", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Number)
], Id.prototype, "category_id", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Number)
], Id.prototype, "item_id", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Number)
], Id.prototype, "sku_id", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Number)
], Id.prototype, "admin_id", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Number)
], Id.prototype, "statis_id", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Number)
], Id.prototype, "find_id", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Number)
], Id.prototype, "hongbao_id", void 0);
Id = Id_1 = __decorate([
    (0, typegoose_1.modelOptions)({ options: { customName: 'ids' } })
], Id);
const IdsModel = (0, typegoose_1.getModelForClass)(Id);
exports.IdsModel = IdsModel;
IdsModel.findOne((_error, data) => {
    if (!data) {
        const newIds = new IdsModel({
            restaurant_id: 0,
            food_id: 0,
            order_id: 0,
            user_id: 0,
            address_id: 0,
            cart_id: 0,
            img_id: 0,
            category_id: 0,
            item_id: 0,
            sku_id: 0,
            admin_id: 0,
            statis_id: 0,
            find_id: 0,
            hongbao_id: 0
        });
        newIds.save();
    }
});
//# sourceMappingURL=ids.js.map