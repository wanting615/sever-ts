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
var Order_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModel = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const food_1 = require("./food");
let RedBag = class RedBag {
};
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Number)
], RedBag.prototype, "id", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], RedBag.prototype, "name", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Number)
], RedBag.prototype, "amount", void 0);
RedBag = __decorate([
    (0, typegoose_1.modelOptions)({ schemaOptions: { _id: false } })
], RedBag);
let Invoice = class Invoice {
};
__decorate([
    (0, typegoose_1.prop)({ default: 2 }),
    __metadata("design:type", Number)
], Invoice.prototype, "invoiceType", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], Invoice.prototype, "header", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], Invoice.prototype, "taxesNum", void 0);
Invoice = __decorate([
    (0, typegoose_1.modelOptions)({ schemaOptions: { _id: false } })
], Invoice);
let Delivery = class Delivery {
};
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], Delivery.prototype, "name", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], Delivery.prototype, "personName", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: '尽快送达' }),
    __metadata("design:type", String)
], Delivery.prototype, "timeType", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: 0 }),
    __metadata("design:type", Number)
], Delivery.prototype, "amount", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: 0 }),
    __metadata("design:type", Number)
], Delivery.prototype, "discountAmount", void 0);
Delivery = __decorate([
    (0, typegoose_1.modelOptions)({ schemaOptions: { _id: false } })
], Delivery);
let ScoreInfo = class ScoreInfo {
};
__decorate([
    (0, typegoose_1.prop)({ default: 5 }),
    __metadata("design:type", Number)
], ScoreInfo.prototype, "delivery", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: 5 }),
    __metadata("design:type", Number)
], ScoreInfo.prototype, "shop", void 0);
ScoreInfo = __decorate([
    (0, typegoose_1.modelOptions)({ schemaOptions: { _id: false } })
], ScoreInfo);
let Order = Order_1 = class Order {
    //获取用户订单
    static async getOrders(userId, page, limit, status) {
        const filters = status === undefined ? { userId } : { userId, status };
        const data = await this.find(filters, { _id: 0, __v: 0 }).sort({ orderTime: -1 }).limit(limit).skip(Number(page - 1) * Number(limit));
        return data;
    }
    //获取用户订单数量
    static async getOrdersCount(userId) {
        return this.count({ userId });
    }
    //获取订单详情
    static async getOrderById(orderId, userId) {
        return this.findOne({ orderId, userId });
    }
};
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Number)
], Order.prototype, "userId", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], Order.prototype, "orderId", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: 0 }),
    __metadata("design:type", Number)
], Order.prototype, "status", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Order.prototype, "orderTime", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: '' }),
    __metadata("design:type", String)
], Order.prototype, "remarks", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Number)
], Order.prototype, "shopId", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: food_1.Food }),
    __metadata("design:type", Array)
], Order.prototype, "foods", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Number)
], Order.prototype, "addressId", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Number)
], Order.prototype, "totalAmount", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Number)
], Order.prototype, "originalTotalAmount", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Number)
], Order.prototype, "packingFee", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Number)
], Order.prototype, "payAmount", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: 0 }),
    __metadata("design:type", Number)
], Order.prototype, "discountAmount", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: 0 }),
    __metadata("design:type", Number)
], Order.prototype, "subsidyAmount", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: false }),
    __metadata("design:type", Boolean)
], Order.prototype, "is_new", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: 0 }),
    __metadata("design:type", Number)
], Order.prototype, "isNewAmount", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: 0 }),
    __metadata("design:type", Number)
], Order.prototype, "fullMinus", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: '' }),
    __metadata("design:type", String)
], Order.prototype, "tableware", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: RedBag }),
    __metadata("design:type", RedBag)
], Order.prototype, "redBag", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Invoice }),
    __metadata("design:type", Invoice)
], Order.prototype, "invoice", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Delivery }),
    __metadata("design:type", Delivery)
], Order.prototype, "delivery", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: ScoreInfo }),
    __metadata("design:type", ScoreInfo)
], Order.prototype, "scoreInfo", void 0);
Order = Order_1 = __decorate([
    (0, typegoose_1.modelOptions)({ options: { customName: 'orders' }, schemaOptions: { _id: false } })
], Order);
exports.OrderModel = (0, typegoose_1.getModelForClass)(Order);
//# sourceMappingURL=order.js.map