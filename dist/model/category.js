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
var Category_1, IndexEntry_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexEntryModel = exports.CategoryModel = exports.Category = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const public_1 = require("./public");
//商铺分类
let Category = Category_1 = class Category {
    //获取所有商店分类
    static async getAllGategorys() {
        return this.find({ id: { $exists: true } }, { _id: 0, __v: 0 });
    }
    //获取所有商店分类
    static async getCategoryById(id) {
        return this.find({ 'sub_categories.id': id });
    }
};
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Number)
], Category.prototype, "id", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Number)
], Category.prototype, "count", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], Category.prototype, "image_url", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Number)
], Category.prototype, "level", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], Category.prototype, "name", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", public_1.SubCategories)
], Category.prototype, "sub_categories", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => [Number] }),
    __metadata("design:type", Array)
], Category.prototype, "ids", void 0);
Category = Category_1 = __decorate([
    (0, typegoose_1.modelOptions)({ options: { customName: 'categories' } })
], Category);
exports.Category = Category;
//首页商店分类
let IndexEntry = IndexEntry_1 = class IndexEntry {
    //获取首页分类
    static async getIndexEntrys() {
        return this.find({}, { _id: 0, __v: 0 });
    }
};
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Number)
], IndexEntry.prototype, "id", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Boolean)
], IndexEntry.prototype, "is_in_serving", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], IndexEntry.prototype, "description", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], IndexEntry.prototype, "title", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], IndexEntry.prototype, "link", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], IndexEntry.prototype, "image_url", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], IndexEntry.prototype, "icon_url", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], IndexEntry.prototype, "title_color", void 0);
IndexEntry = IndexEntry_1 = __decorate([
    (0, typegoose_1.modelOptions)({ options: { customName: 'entries' } })
], IndexEntry);
const CategoryModel = (0, typegoose_1.getModelForClass)(Category);
exports.CategoryModel = CategoryModel;
const IndexEntryModel = (0, typegoose_1.getModelForClass)(IndexEntry);
exports.IndexEntryModel = IndexEntryModel;
//# sourceMappingURL=category.js.map