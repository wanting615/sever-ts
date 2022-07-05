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
var Rating_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatingModel = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const typegoose_2 = require("@typegoose/typegoose");
let RatingItem = class RatingItem {
};
__decorate([
    (0, typegoose_2.prop)({ required: true }),
    __metadata("design:type", Number)
], RatingItem.prototype, "food_id", void 0);
__decorate([
    (0, typegoose_2.prop)({ required: true }),
    __metadata("design:type", String)
], RatingItem.prototype, "food_name", void 0);
__decorate([
    (0, typegoose_2.prop)({ default: "" }),
    __metadata("design:type", String)
], RatingItem.prototype, "image_hash", void 0);
__decorate([
    (0, typegoose_2.prop)({ default: 1 }),
    __metadata("design:type", Number)
], RatingItem.prototype, "is_valid", void 0);
RatingItem = __decorate([
    (0, typegoose_2.modelOptions)({ schemaOptions: { _id: false } })
], RatingItem);
let RatingIDetail = class RatingIDetail {
};
__decorate([
    (0, typegoose_2.prop)({ required: true }),
    __metadata("design:type", String)
], RatingIDetail.prototype, "username", void 0);
__decorate([
    (0, typegoose_2.prop)({ default: "" }),
    __metadata("design:type", String)
], RatingIDetail.prototype, "avatar", void 0);
__decorate([
    (0, typegoose_2.prop)(),
    __metadata("design:type", String)
], RatingIDetail.prototype, "rated_at", void 0);
__decorate([
    (0, typegoose_2.prop)({ default: 0 }),
    __metadata("design:type", Number)
], RatingIDetail.prototype, "compare_rating", void 0);
__decorate([
    (0, typegoose_2.prop)(),
    __metadata("design:type", Number)
], RatingIDetail.prototype, "rating_star", void 0);
__decorate([
    (0, typegoose_2.prop)({ default: "" }),
    __metadata("design:type", String)
], RatingIDetail.prototype, "rating_text", void 0);
__decorate([
    (0, typegoose_2.prop)({ default: "" }),
    __metadata("design:type", String)
], RatingIDetail.prototype, "time_spent_desc", void 0);
__decorate([
    (0, typegoose_2.prop)({ type: String }),
    __metadata("design:type", Array)
], RatingIDetail.prototype, "tags", void 0);
__decorate([
    (0, typegoose_2.prop)({ type: RatingItem }),
    __metadata("design:type", Array)
], RatingIDetail.prototype, "item_ratings", void 0);
RatingIDetail = __decorate([
    (0, typegoose_2.modelOptions)({ schemaOptions: { _id: false } })
], RatingIDetail);
let Tag = class Tag {
};
__decorate([
    (0, typegoose_2.prop)(),
    __metadata("design:type", String)
], Tag.prototype, "name", void 0);
__decorate([
    (0, typegoose_2.prop)({ default: false }),
    __metadata("design:type", Boolean)
], Tag.prototype, "unsatisfied", void 0);
__decorate([
    (0, typegoose_2.prop)({ default: 0 }),
    __metadata("design:type", Number)
], Tag.prototype, "count", void 0);
Tag = __decorate([
    (0, typegoose_2.modelOptions)({ schemaOptions: { _id: false } })
], Tag);
let Score = class Score {
};
__decorate([
    (0, typegoose_2.prop)({ default: 0 }),
    __metadata("design:type", Number)
], Score.prototype, "service_score", void 0);
__decorate([
    (0, typegoose_2.prop)({ default: 0 }),
    __metadata("design:type", Number)
], Score.prototype, "overall_score", void 0);
__decorate([
    (0, typegoose_2.prop)({ default: 0 }),
    __metadata("design:type", Number)
], Score.prototype, "order_rating_amount", void 0);
__decorate([
    (0, typegoose_2.prop)({ default: 0 }),
    __metadata("design:type", Number)
], Score.prototype, "food_score", void 0);
__decorate([
    (0, typegoose_2.prop)({ default: 0 }),
    __metadata("design:type", Number)
], Score.prototype, "deliver_time", void 0);
__decorate([
    (0, typegoose_2.prop)({ default: 0 }),
    __metadata("design:type", Number)
], Score.prototype, "compare_rating", void 0);
Score = __decorate([
    (0, typegoose_2.modelOptions)({ schemaOptions: { _id: false } })
], Score);
/**
 * 评价表
 */
let Rating = Rating_1 = class Rating {
    static async getRatings(shopId) {
        try {
            const data = await this.findOne({ restaurant_id: shopId });
            return data.ratings;
        }
        catch (error) {
            console.log(error);
            return [];
        }
    }
    static async getScores(shopId) {
        try {
            const data = await this.findOne({ restaurant_id: shopId });
            return data.scores;
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
    static async getTags(shopId) {
        try {
            const data = await this.findOne({ restaurant_id: shopId });
            return data.tags;
        }
        catch (error) {
            console.log(error);
            return [];
        }
    }
};
__decorate([
    (0, typegoose_2.prop)({ required: true }),
    __metadata("design:type", Number)
], Rating.prototype, "restaurant_id", void 0);
__decorate([
    (0, typegoose_2.prop)({ type: Tag }),
    __metadata("design:type", Array)
], Rating.prototype, "tags", void 0);
__decorate([
    (0, typegoose_2.prop)({ type: Score }),
    __metadata("design:type", Score)
], Rating.prototype, "scores", void 0);
__decorate([
    (0, typegoose_2.prop)({ type: RatingIDetail }),
    __metadata("design:type", Array)
], Rating.prototype, "ratings", void 0);
Rating = Rating_1 = __decorate([
    (0, typegoose_2.modelOptions)({ options: { customName: "ratings" }, schemaOptions: { _id: false } })
], Rating);
const RatingModel = (0, typegoose_1.getModelForClass)(Rating);
exports.RatingModel = RatingModel;
//# sourceMappingURL=rating.js.map