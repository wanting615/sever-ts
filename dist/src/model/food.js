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
exports.FoodModel = exports.Food = void 0;
const typegoose_1 = require("@typegoose/typegoose");
class Attribute {
}
__decorate([
    (0, typegoose_1.prop)({ default: "" }),
    __metadata("design:type", String)
], Attribute.prototype, "icon_color", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: "" }),
    __metadata("design:type", String)
], Attribute.prototype, "icon_name", void 0);
class Specification {
}
__decorate([
    (0, typegoose_1.prop)({ default: "" }),
    __metadata("design:type", String)
], Specification.prototype, "name", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, default: [] }),
    __metadata("design:type", Array)
], Specification.prototype, "values", void 0);
class Activity {
}
__decorate([
    (0, typegoose_1.prop)({ default: "" }),
    __metadata("design:type", String)
], Activity.prototype, "image_text_color", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: "" }),
    __metadata("design:type", String)
], Activity.prototype, "icon_color", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: "" }),
    __metadata("design:type", String)
], Activity.prototype, "image_text", void 0);
class Spec {
}
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], Spec.prototype, "name", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], Spec.prototype, "value", void 0);
class Specfood {
}
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Number)
], Specfood.prototype, "checkout_mode", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Number)
], Specfood.prototype, "food_id", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Boolean)
], Specfood.prototype, "is_essential", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Number)
], Specfood.prototype, "image_text", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Number)
], Specfood.prototype, "item_id", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], Specfood.prototype, "name", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Number)
], Specfood.prototype, "original_price", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Number)
], Specfood.prototype, "packing_fee", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], Specfood.prototype, "pinyin_name", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Number)
], Specfood.prototype, "price", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], Specfood.prototype, "promotion_stock", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Number)
], Specfood.prototype, "recent_popularity", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Number)
], Specfood.prototype, "recent_rating", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Number)
], Specfood.prototype, "restaurant_id", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Number)
], Specfood.prototype, "sku_id", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Boolean)
], Specfood.prototype, "sold_out", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], Specfood.prototype, "specs_name", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Number)
], Specfood.prototype, "stock", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Spec }),
    __metadata("design:type", Spec)
], Specfood.prototype, "specs", void 0);
let Food = class Food {
};
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Number)
], Food.prototype, "item_id", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Number)
], Food.prototype, "restaurant_id", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Number)
], Food.prototype, "category_id", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], Food.prototype, "name", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: "" }),
    __metadata("design:type", String)
], Food.prototype, "image_path", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: "" }),
    __metadata("design:type", String)
], Food.prototype, "tips", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: "" }),
    __metadata("design:type", String)
], Food.prototype, "description", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: "" }),
    __metadata("design:type", String)
], Food.prototype, "pinyin_name", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: 0 }),
    __metadata("design:type", Number)
], Food.prototype, "rating", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: 0 }),
    __metadata("design:type", Number)
], Food.prototype, "month_sales", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: 0 }),
    __metadata("design:type", Number)
], Food.prototype, "rating_count", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: 0 }),
    __metadata("design:type", Number)
], Food.prototype, "is_featured", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: [] }),
    __metadata("design:type", Array)
], Food.prototype, "display_times", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: [] }),
    __metadata("design:type", Array)
], Food.prototype, "attrs", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Food.prototype, "server_utc", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: false }),
    __metadata("design:type", Boolean)
], Food.prototype, "is_essential", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: 0 }),
    __metadata("design:type", Number)
], Food.prototype, "satisfy_count", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: 0 }),
    __metadata("design:type", Number)
], Food.prototype, "satisfy_rate", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Attribute }),
    __metadata("design:type", Array)
], Food.prototype, "attributes", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Specification }),
    __metadata("design:type", Array)
], Food.prototype, "specifications", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Object)
], Food.prototype, "limitation", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Activity }),
    __metadata("design:type", Activity)
], Food.prototype, "activity", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Specfood }),
    __metadata("design:type", Array)
], Food.prototype, "specfoods", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Number)
], Food.prototype, "num", void 0);
Food = __decorate([
    (0, typegoose_1.index)({ id: 1 }),
    (0, typegoose_1.modelOptions)({ options: { customName: "foods", allowMixed: 0, } })
], Food);
exports.Food = Food;
const FoodModel = (0, typegoose_1.getModelForClass)(Food);
exports.FoodModel = FoodModel;
//# sourceMappingURL=food.js.map