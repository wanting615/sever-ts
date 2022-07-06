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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_swagger_decorator_1 = require("koa-swagger-decorator");
const category_1 = require("../model/category");
const shop_1 = require("../model/shop");
const address_1 = __importDefault(require("../until/address"));
class ShopController {
    static async getShopList(ctx) {
        const { latitude, //纬度
        longitude, //经度
        page = 1, //当前页
        limit = 10, //取多少条
        // keyword,
        categoryId, //商店分类
        orderBy = 2, //排序方式
        // extras,
        delivery_mode = [], //筛选配送方式
        support_ids = [], //筛选支持的商家属性
         } = ctx.request.query;
        if (!latitude || !longitude) { //经纬度未传 return
            ctx.fail("latitude,longitude不能为空");
            return;
        }
        const filter = {}; //过滤集合
        const sortWay = {};
        if (Number(orderBy)) { //排序
            switch (Number(orderBy)) {
                case 1: //智能排序
                    sortWay.float_minimum_order_amount = 1;
                    break;
                case 2: //距离最近
                    filter.location = {
                        $near: [Number(longitude), Number(latitude)]
                    };
                    break;
                case 3: //销量最好
                    sortWay.recent_order_num = -1;
                    break;
                case 4: //起送价最低
                    sortWay.float_minimum_order_amount = -1;
                    break;
                case 5: //配送最快
                    filter.location = {
                        $near: [Number(longitude), Number(latitude)]
                    };
                    break;
                case 6: //评分最高
                    sortWay.rating = -1;
                    break;
            }
        }
        if (Array.isArray(delivery_mode)) { //配送方式筛选
            delivery_mode.forEach((item) => {
                filter["delivery_mode.id"] = Number(item);
            });
        }
        if (Array.isArray(support_ids)) { //商家属性
            const filterArr = [];
            support_ids.forEach(item => {
                if (Number(item) && (Number(item) !== 8)) {
                    filterArr.push(Number(item));
                }
                else if (Number(item) == 8) { //品牌保证特殊处理
                    filter.is_premium = true;
                }
            });
            if (filterArr.length) {
                //匹配同时拥有多种活动的数据
                filter["supports.id"] = { $all: filterArr };
            }
        }
        if (categoryId && Number(categoryId)) { //查早对应商店分类名称
            const category = await category_1.CategoryModel.getCategoryById(Number(categoryId));
            if (category.length > 0) {
                Object.assign(filter, { category: category[0].name });
            }
        }
        const shopslist = await shop_1.ShopModel.getShops(filter, sortWay, Number(page), Number(limit));
        //测量距离
        const from = latitude + "," + longitude;
        let to = "";
        shopslist.forEach((item, index) => {
            const slpitStr = (index == shopslist.length - 1) ? "" : ";";
            to += item.latitude + "," + item.longitude + slpitStr;
        });
        try {
            if (shopslist.length) {
                const distance_duration = await address_1.default.getDistance(from, to);
                shopslist.map((item, index) => {
                    return Object.assign(item, distance_duration[index]);
                });
            }
        }
        catch (error) {
            // qq地图达到上限后会导致加车失败，需优化
            console.log("从addressComoponent获取测距数据失败", error);
            shopslist.map((item) => {
                return Object.assign(item, { distance: "10公里", order_lead_time: "40分钟" });
            });
        }
        ctx.success(shopslist, "查询成功");
    }
    static async getShopById(ctx) {
        const { shopId } = ctx.validatedParams;
        if (!shopId || !Number(shopId)) {
            ctx.fail("餐馆id参数错误");
            return;
        }
        try {
            const data = await shop_1.ShopModel.getShopById(shopId);
            ctx.success(data, "查询成功");
        }
        catch (error) {
            console.log(error);
            ctx.fail("获取餐馆详情失败");
        }
    }
    static async getShopMenu(ctx) {
        const { shopId } = ctx.validatedParams;
        if (!shopId || !Number(shopId)) {
            ctx.fail("餐馆id参数错误");
            return;
        }
        try {
            const data = await shop_1.ShopMenuModel.getShopMenu(shopId);
            ctx.success(data, "");
            return;
        }
        catch (error) {
            console.log(error);
            ctx.fail("获取餐馆食品menu失败");
        }
    }
}
__decorate([
    (0, koa_swagger_decorator_1.request)("get", "/shops/list"),
    (0, koa_swagger_decorator_1.summary)("查询商店列表"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ShopController, "getShopList", null);
__decorate([
    (0, koa_swagger_decorator_1.request)("get", "/shop/{shopId}"),
    (0, koa_swagger_decorator_1.summary)("获取商店详情"),
    (0, koa_swagger_decorator_1.path)({ shopId: { type: "number", required: true } }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ShopController, "getShopById", null);
__decorate([
    (0, koa_swagger_decorator_1.request)("get", "/shopMenu/{shopId}"),
    (0, koa_swagger_decorator_1.summary)("获取餐馆食品menu"),
    (0, koa_swagger_decorator_1.path)({ shopId: { type: "number", required: true } }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ShopController, "getShopMenu", null);
exports.default = ShopController;
//# sourceMappingURL=shop.js.map