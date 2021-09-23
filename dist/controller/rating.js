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
const koa_swagger_decorator_1 = require("koa-swagger-decorator");
const rating_1 = require("../model/rating");
class RatingController {
    async getRatings(ctx) {
        const shopId = ctx.query.shopId;
        const data = await rating_1.RatingModel.getRatings(Number(shopId));
        ctx.body = {
            state: true,
            message: '查询成功',
            data
        };
    }
    async getScores(ctx) {
        const shopId = ctx.query.shopId;
        const data = await rating_1.RatingModel.getScores(Number(shopId));
        ctx.body = {
            state: true,
            message: '查询成功',
            data
        };
    }
    async getTags(ctx) {
        const shopId = ctx.query.shopId;
        const data = await rating_1.RatingModel.getTags(Number(shopId));
        ctx.body = {
            state: true,
            message: '查询成功',
            data
        };
    }
}
__decorate([
    (0, koa_swagger_decorator_1.request)('get', '/rating/getFind'),
    (0, koa_swagger_decorator_1.summary)('获取商店评价列表'),
    (0, koa_swagger_decorator_1.query)({
        shopId: { type: 'number', require: true }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RatingController.prototype, "getRatings", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('get', '/rating/scroes'),
    (0, koa_swagger_decorator_1.summary)('查询评价分数'),
    (0, koa_swagger_decorator_1.query)({
        shopId: { type: 'number', require: true }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RatingController.prototype, "getScores", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('get', '/rating/tags'),
    (0, koa_swagger_decorator_1.summary)('查询评价分类'),
    (0, koa_swagger_decorator_1.query)({
        shopId: { type: 'number', require: true }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RatingController.prototype, "getTags", null);
exports.default = RatingController;
//# sourceMappingURL=rating.js.map