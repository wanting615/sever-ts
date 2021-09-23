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
const find_1 = require("../model/find");
const ids_1 = require("../model/ids");
const shop_1 = require("../model/shop");
const checkPermission_1 = require("../middleware/checkPermission");
const user_1 = require("../model/user");
class FindController {
    async addFind(ctx) {
        const { shopId, vedioPath, tips } = ctx.request.body;
        const result = ctx.body = {
            status: false,
            message: '',
            data: null
        };
        if (!shopId) {
            result.message = "请填写商店id";
            return;
        }
        ;
        try {
            const findResult = await find_1.FindModel.getFindByShopId(shopId);
            if (findResult && findResult.length > 0) {
                result.message = "已存在了哦";
                return;
            }
            const id = await ids_1.IdsModel.getIds('find_id');
            const data = new find_1.FindModel({
                id,
                shopId,
                vedioPath,
                tips
            });
            await data.save();
            result.status = true;
            result.message = "添加成功";
            result.data = data;
        }
        catch (error) {
            result.message = "服务器异常";
            console.log(error);
        }
    }
    async getFinds(ctx) {
        const { page = 1, limit = 10 } = ctx.request.query;
        try {
            const results = await find_1.FindModel.getFinds(Number(page), Number(limit));
            for (let i = 0; i < results.length; i++) {
                const shop = await shop_1.ShopModel.getShopById(results[i].shopId);
                results[i].shopInfo = {
                    name: shop.name,
                    image_path: shop.image_path,
                    rating: shop.rating,
                    activities: shop.activities,
                    is_premium: shop.is_premium,
                    order_lead_time: Math.floor(Math.random() * (11) + 30),
                };
            }
            ctx.body = {
                status: true,
                message: '查询成功',
                data: results
            };
        }
        catch (error) {
            ctx.body = {
                status: false,
                message: '失败',
                data: []
            };
            console.log(error);
        }
    }
    async replyFind(ctx) {
        const { user_id, detail, id } = ctx.request.body;
        const result = ctx.body = {
            status: false,
            message: '',
            data: null
        };
        if (!id) {
            result.message = "回复id不能为空";
            return;
        }
        try {
            const userInfo = await user_1.UserInfoModel.findUserInfo(user_id);
            const findInfo = await find_1.FindModel.getFindById(Number(id));
            if (findInfo) {
                findInfo.replys++;
                findInfo.replaysDetails.push({
                    replyId: findInfo.replys,
                    username: userInfo.username,
                    userId: user_id,
                    userAvatar: userInfo.avatar,
                    detail: detail,
                });
                findInfo.save();
                ctx.body = {
                    status: true,
                    message: '回复成功',
                    data: findInfo.replaysDetails[findInfo.replaysDetails.length - 1]
                };
            }
            else {
                ctx.body = {
                    status: true,
                    message: '此条记录不存在',
                };
            }
        }
        catch (error) {
            result.message = "服务器异常";
            console.log(error);
        }
    }
    async findPraise(ctx) {
        const { id } = ctx.request.query;
        try {
            const find = await find_1.FindModel.getFindById(Number(id));
            if (find) {
                find.praises++;
                find.save();
                ctx.body = {
                    status: true,
                    message: '点赞成功',
                };
            }
            else {
                ctx.body = {
                    status: false,
                    message: '该记录不存在'
                };
            }
        }
        catch (error) {
            console.log(error);
        }
    }
}
__decorate([
    (0, koa_swagger_decorator_1.request)('post', '/addFind'),
    (0, koa_swagger_decorator_1.summary)('添加发现'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FindController.prototype, "addFind", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('get', '/getFind'),
    (0, koa_swagger_decorator_1.summary)('获取发现'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FindController.prototype, "getFinds", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('post', '/replyFind'),
    (0, koa_swagger_decorator_1.summary)('回复发现'),
    (0, koa_swagger_decorator_1.middlewares)([checkPermission_1.needLogin]),
    (0, koa_swagger_decorator_1.body)({
        user_id: { type: 'string', require: true },
        detail: { type: 'string', require: true },
        id: { type: 'string' }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FindController.prototype, "replyFind", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('get', '/findPraise'),
    (0, koa_swagger_decorator_1.summary)('点赞'),
    (0, koa_swagger_decorator_1.middlewares)([checkPermission_1.needLogin]),
    (0, koa_swagger_decorator_1.query)({
        id: { type: 'string' }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FindController.prototype, "findPraise", null);
exports.default = FindController;
//# sourceMappingURL=find.js.map