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
const checkPermission_1 = require("../middleware/checkPermission");
const ids_1 = require("../model/ids");
const hongbao_1 = require("../model/hongbao");
const user_1 = require("../model/user");
const formater_1 = require("../until/formater");
let HongbaoController = class HongbaoController {
    async getRatings(ctx) {
        const params = ctx.request.query;
        if (params.status === undefined) {
            ctx.body = {
                status: false,
                messsage: "status不能为空"
            };
            return;
        }
        try {
            const data = await hongbao_1.HongbaoModel.getHongbaos(Number(params.user_id), Number(params.status));
            ctx.body = {
                status: true,
                messsage: "获取红包成功",
                data
            };
        }
        catch (error) {
            console.log(error);
            ctx.body = {
                status: false,
                messsage: "获取红包失败"
            };
        }
    }
    async sendHongbaoKey(ctx) {
        const user_id = ctx.request.query.user_id;
        const id = await ids_1.IdsModel.getIds("hongbao_id");
        try {
            const user = await user_1.UserInfoModel.findUserInfo(Number(user_id));
            const sum = Math.floor(Math.random() * 10 + 1) * 5;
            const data = new hongbao_1.HongbaoModel({
                id,
                user_id,
                sn: new Date(),
                amount: Math.floor(Math.random() * 10 + 1),
                sum_condition: sum,
                name: "分享红包",
                phone: user.mobile,
                begin_date: (0, formater_1.useFormatTime)("YYYY-mm-dd", new Date()),
                end_date: (0, formater_1.GetDateStr)(new Date(), 3),
                description_map: {
                    phone: "限收货手机号为" + user.mobile ? user.mobile : "任意手机号",
                    online_paid_only: "限在线支付使用",
                    validity_periods: (0, formater_1.GetDateStr)(new Date(), 3) + "到期",
                    sum_condition: "满" + sum + "元可用",
                },
                status: 0,
                present_status: 1,
                share_status: 1
            });
            ctx.body = {
                status: true,
                message: "兑换成功",
                data
            };
        }
        catch (error) {
            ctx.body = {
                status: false,
                message: "兑换失败",
            };
        }
    }
};
__decorate([
    (0, koa_swagger_decorator_1.request)("get", "/getHongbaos"),
    (0, koa_swagger_decorator_1.summary)("获取用户红包"),
    (0, koa_swagger_decorator_1.query)({
        status: { type: "number", require: true }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HongbaoController.prototype, "getRatings", null);
__decorate([
    (0, koa_swagger_decorator_1.request)("get", "/sendHongbaoKey"),
    (0, koa_swagger_decorator_1.summary)("兑换红包"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HongbaoController.prototype, "sendHongbaoKey", null);
HongbaoController = __decorate([
    (0, koa_swagger_decorator_1.middlewaresAll)([checkPermission_1.needLogin])
], HongbaoController);
exports.default = HongbaoController;
//# sourceMappingURL=hongbao.js.map