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
const address_1 = __importDefault(require("../until/address"));
class AddressController {
    static async getLocationAddress(ctx) {
        const { latitude, longitude } = ctx.request.query;
        if (latitude && longitude) {
            try {
                const result = await address_1.default.getpois(latitude, longitude);
                ctx.body = {
                    state: true,
                    msg: "查询成功",
                    address: result.result.address,
                    city: result.result.address_component.province,
                    latitude: latitude,
                    longitude: longitude,
                    name: result.result.formatted_addresses.recommend,
                };
            }
            catch (error) {
                ctx.fail("获取地址失败");
            }
        }
        else {
            ctx.fail("参数错误");
        }
    }
    static async getLocationByIp(ctx) {
        try {
            const result = await address_1.default.guessPosition(ctx.request);
            ctx.success(result, "获取地址成功");
        }
        catch (error) {
            ctx.fail("获取地址失败");
        }
    }
    static async getDistanceTime(ctx) {
        const { from, to } = ctx.request.query;
        if (!from || !to) {
            ctx.fail("起始位置和终点位置不能为空");
            return;
        }
        try {
            const time = await address_1.default.getDistance(from, to, "tiemvalue");
            ctx.success(time, "测量到达时间成功");
        }
        catch (error) {
            ctx.success(2000, "测量到达时间失败,重置默认时间");
        }
    }
}
__decorate([
    (0, koa_swagger_decorator_1.request)("get", "/posstion"),
    (0, koa_swagger_decorator_1.summary)("通过经纬度获取本地精确地址"),
    (0, koa_swagger_decorator_1.query)({
        latitude: { type: "string", required: true },
        longitude: { type: "string", required: true }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AddressController, "getLocationAddress", null);
__decorate([
    (0, koa_swagger_decorator_1.request)("get", "/posstionByIp"),
    (0, koa_swagger_decorator_1.summary)("通过ip获取本地精确地址"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AddressController, "getLocationByIp", null);
__decorate([
    (0, koa_swagger_decorator_1.request)("get", "/getDistanceTime"),
    (0, koa_swagger_decorator_1.summary)("通过经纬度获取本地精确地址"),
    (0, koa_swagger_decorator_1.query)({
        from: { type: "string", required: true },
        to: { type: "string", required: true }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AddressController, "getDistanceTime", null);
exports.default = AddressController;
//# sourceMappingURL=address.js.map