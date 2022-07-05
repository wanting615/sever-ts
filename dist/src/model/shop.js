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
var Shops_1, ShopMenu_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopMenuModel = exports.Shops = exports.ShopModel = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const public_1 = require("./public");
const food_1 = require("./food");
let Shops = Shops_1 = class Shops {
    //获取商铺列表
    static async getShops(filter, sortWay, page, limit) {
        return this.find(filter, { _id: 0, __v: 0 }).sort(sortWay).limit(limit).skip((page - 1) * limit);
    }
    //获取商铺详情-id
    static async getShopById(shopId) {
        return this.findOne({ id: shopId }, { _id: 0, __v: 0 });
    }
};
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Number)
], Shops.prototype, "id", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], Shops.prototype, "address", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: "" }),
    __metadata("design:type", String)
], Shops.prototype, "description", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: "" }),
    __metadata("design:type", String)
], Shops.prototype, "order_lead_time", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: "" }),
    __metadata("design:type", String)
], Shops.prototype, "distance", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => [Number], index: "2d" }),
    __metadata("design:type", Array)
], Shops.prototype, "location", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: 0 }),
    __metadata("design:type", Number)
], Shops.prototype, "float_delivery_fee", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: 0 }),
    __metadata("design:type", Number)
], Shops.prototype, "float_minimum_order_amount", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], Shops.prototype, "category", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: "" }),
    __metadata("design:type", String)
], Shops.prototype, "image_path", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: false }),
    __metadata("design:type", Boolean)
], Shops.prototype, "is_premium", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: false }),
    __metadata("design:type", Boolean)
], Shops.prototype, "is_new", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Number)
], Shops.prototype, "latitude", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Number)
], Shops.prototype, "longitude", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], Shops.prototype, "name", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], Shops.prototype, "phone", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", public_1.PiecewiseAgentFee)
], Shops.prototype, "piecewise_agent_fee", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: "欢迎光临，用餐高峰请提前下单，谢谢" }),
    __metadata("design:type", String)
], Shops.prototype, "promotion_info", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: 0 }),
    __metadata("design:type", Number)
], Shops.prototype, "rating", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: 0 }),
    __metadata("design:type", Number)
], Shops.prototype, "rating_count", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: 0 }),
    __metadata("design:type", Number)
], Shops.prototype, "recent_order_num", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: 0 }),
    __metadata("design:type", Number)
], Shops.prototype, "status", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => [String], default: ["08:30/20:30"] }),
    __metadata("design:type", Array)
], Shops.prototype, "opening_hours", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: public_1.Activity }),
    __metadata("design:type", public_1.Activity)
], Shops.prototype, "activities", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: public_1.Identification }),
    __metadata("design:type", public_1.Identification)
], Shops.prototype, "identification", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: public_1.DeliveryMode }),
    __metadata("design:type", public_1.DeliveryMode)
], Shops.prototype, "delivery_mode", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: public_1.License }),
    __metadata("design:type", public_1.License)
], Shops.prototype, "license", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: public_1.Support, _id: false }),
    __metadata("design:type", Array)
], Shops.prototype, "supports", void 0);
Shops = Shops_1 = __decorate([
    (0, typegoose_1.modelOptions)({ options: { customName: "shops" }, schemaOptions: { _id: false } })
], Shops);
exports.Shops = Shops;
//商店菜单栏
let ShopMenu = ShopMenu_1 = class ShopMenu {
    //获取商铺食品--按分类
    static async getShopMenu(shopId) {
        return this.find({ restaurant_id: shopId });
    }
};
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Number)
], ShopMenu.prototype, "id", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: true }),
    __metadata("design:type", Boolean)
], ShopMenu.prototype, "is_selected", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: "" }),
    __metadata("design:type", String)
], ShopMenu.prototype, "icon_url", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], ShopMenu.prototype, "iconname_url", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Number)
], ShopMenu.prototype, "restaurant_id", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: 1 }),
    __metadata("design:type", String)
], ShopMenu.prototype, "type", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: food_1.Food }),
    __metadata("design:type", food_1.Food)
], ShopMenu.prototype, "identification", void 0);
ShopMenu = ShopMenu_1 = __decorate([
    (0, typegoose_1.modelOptions)({ options: { customName: "menus" } })
], ShopMenu);
const ShopModel = (0, typegoose_1.getModelForClass)(Shops);
exports.ShopModel = ShopModel;
const ShopMenuModel = (0, typegoose_1.getModelForClass)(ShopMenu);
exports.ShopMenuModel = ShopMenuModel;
//# sourceMappingURL=shop.js.map