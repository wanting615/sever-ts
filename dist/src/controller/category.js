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
const category_1 = require("../model/category");
class CategoryController {
    static async getAllGategories(ctx) {
        try {
            const gategories = await category_1.CategoryModel.getAllGategorys();
            const data = [];
            let shopCount = 0;
            gategories.forEach((el) => {
                data.concat(el.sub_categories);
                shopCount += el.count;
            });
            ctx.body = {
                status: true,
                count: shopCount,
                list: data
            };
        }
        catch (error) {
            console.log(error);
            ctx.fail("查询失败");
        }
    }
    static async getIndexEntrys(ctx) {
        try {
            const data = await category_1.IndexEntryModel.getIndexEntrys();
            ctx.success(data, "查询成功");
        }
        catch (error) {
            ctx.fail("查询失败");
            throw new Error("查询失败");
        }
    }
}
__decorate([
    (0, koa_swagger_decorator_1.request)("get", "/category/list"),
    (0, koa_swagger_decorator_1.summary)("获取所有商店分类类别"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CategoryController, "getAllGategories", null);
__decorate([
    (0, koa_swagger_decorator_1.request)("get", "/shopsClassify"),
    (0, koa_swagger_decorator_1.summary)("获取首页分类"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CategoryController, "getIndexEntrys", null);
exports.default = CategoryController;
//# sourceMappingURL=category.js.map