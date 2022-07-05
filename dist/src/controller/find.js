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
const finds_1 = require("../model/finds");
const ids_1 = require("../model/ids");
const shop_1 = require("../model/shop");
const checkPermission_1 = require("../middleware/checkPermission");
const user_1 = require("../model/user");
class FindController {
    async addFind(ctx) {
        const { shopId, vedioPath, tips } = ctx.request.body;
        if (!shopId) {
            ctx.fail("请填写商店id");
            return;
        }
        try {
            const findResult = await finds_1.FindModel.getFindByShopId(Number(shopId));
            if (findResult && findResult.length > 0) {
                ctx.fail("已存在了哦");
                return;
            }
            const id = await ids_1.IdsModel.getIds("find_id");
            const data = new finds_1.FindModel({
                id,
                shopId,
                vedioPath,
                tips
            });
            await data.save();
            ctx.success(data, "添加成功");
        }
        catch (error) {
            ctx.fail("服务器异常");
            console.log(error);
        }
    }
    static async getFindAll(ctx) {
        const { page = 1, limit = 10 } = ctx.request.query;
        try {
            console.log(finds_1.FindModel);
            const results = await finds_1.FindModel.getFinds(Number(page), Number(limit));
            for (let i = 0; i < results.length; i++) {
                const shop = await shop_1.ShopModel.getShopById(results[i].shopId);
                if (shop) {
                    results[i].shopInfo = {
                        name: shop.name,
                        image_path: shop.image_path,
                        rating: shop.rating,
                        activities: shop.activities,
                        is_premium: shop.is_premium,
                        order_lead_time: Math.floor(Math.random() * (11) + 30),
                    };
                }
            }
            ctx.success(results, "查询成功");
        }
        catch (error) {
            ctx.body = {
                status: false,
                message: "失败",
                data: []
            };
            console.log(error);
        }
    }
    async replyFind(ctx) {
        const { user_id, detail, id } = ctx.request.body;
        if (!id) {
            ctx.fail("回复id不能为空");
            return;
        }
        try {
            const userInfo = await user_1.UserInfoModel.findUserInfo(Number(user_id));
            const findInfo = await finds_1.FindModel.getFindById(Number(id));
            if (findInfo) {
                findInfo.replys++;
                findInfo.replaysDetails.push({
                    replyId: findInfo.replys,
                    username: userInfo.username,
                    userId: Number(user_id),
                    userAvatar: userInfo.avatar,
                    detail: detail,
                });
                findInfo.save();
                ctx.success(findInfo.replaysDetails[findInfo.replaysDetails.length - 1], "回复成功");
            }
            else {
                ctx.fail("此条记录不存在");
            }
        }
        catch (error) {
            ctx.fail("服务器异常");
            console.log(error);
        }
    }
    async findPraise(ctx) {
        const { id } = ctx.request.query;
        try {
            const find = await finds_1.FindModel.getFindById(Number(id));
            if (find) {
                find.praises++;
                find.save();
                ctx.success(null, "点赞成功");
            }
            else {
                ctx.fail("该记录不存在");
            }
        }
        catch (error) {
            console.log(error);
        }
    }
}
__decorate([
    (0, koa_swagger_decorator_1.request)("post", "/addFind"),
    (0, koa_swagger_decorator_1.summary)("添加发现"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FindController.prototype, "addFind", null);
__decorate([
    (0, koa_swagger_decorator_1.request)("post", "/replyFind"),
    (0, koa_swagger_decorator_1.summary)("回复发现"),
    (0, koa_swagger_decorator_1.middlewares)([checkPermission_1.needLogin]),
    (0, koa_swagger_decorator_1.body)({
        user_id: { type: "string", require: true },
        detail: { type: "string", require: true },
        id: { type: "string" }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FindController.prototype, "replyFind", null);
__decorate([
    (0, koa_swagger_decorator_1.request)("get", "/findPraise"),
    (0, koa_swagger_decorator_1.summary)("点赞"),
    (0, koa_swagger_decorator_1.middlewares)([checkPermission_1.needLogin]),
    (0, koa_swagger_decorator_1.query)({
        id: { type: "string" }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FindController.prototype, "findPraise", null);
__decorate([
    (0, koa_swagger_decorator_1.request)("get", "/getFind"),
    (0, koa_swagger_decorator_1.summary)("获取发现"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FindController, "getFindAll", null);
exports.default = FindController;
//# sourceMappingURL=find.js.map