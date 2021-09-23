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
const checkPermission_1 = require("./../middleware/checkPermission");
const order_1 = require("../model/order");
const shop_1 = require("../model/shop");
const user_1 = require("../model/user");
const ids_1 = require("../model/ids");
const formater_1 = require("../until/formater");
const food_1 = require("../model/food");
const hongbao_1 = require("../model/hongbao");
let OrderController = class OrderController {
    async getOrders(ctx) {
        const { user_id, page = 1, limit = 10, status } = ctx.request.query;
        try {
            const data = await order_1.OrderModel.getOrders(Number(user_id), Number(page), Number(limit), status);
            const count = await order_1.OrderModel.getOrdersCount(Number(user_id));
            const results = []; //返回数据
            //超15分钟未支付 超时处理
            for (var i = 0; i < data.length; i++) {
                if (data[i].status === 0 && (new Date().getTime() - new Date(data[i].orderTime).getTime() > 900000)) {
                    data[i].status = 4;
                    data[i].save();
                }
                const shop = await shop_1.ShopModel.getShopById(data[i].shopId);
                const foods = data[i].foods.map((food) => {
                    return {
                        id: food.item_id,
                        name: food.name,
                        imagePath: food.image_path,
                        price: food.specfoods[0].price,
                        num: food.num
                    };
                });
                results.push({
                    orderId: data[i].orderId,
                    shopId: data[i].shopId,
                    shopName: shop.name,
                    imagePath: shop.image_path,
                    activities: shop.activities,
                    status: data[i].status,
                    foods: foods,
                    payAmount: data[i].payAmount,
                    scoreInfo: data[i].scoreInfo
                });
            }
            ctx.body = {
                status: true,
                data: results,
                pages: Math.ceil(count / 10),
                message: '查询成功'
            };
        }
        catch (error) {
            ctx.boyd = {
                status: false,
                message: '查询失败'
            };
            throw new Error(error);
        }
    }
    async getOrderDetail(ctx) {
        const params = ctx.request.query;
        try {
            let data = await order_1.OrderModel.getOrderById(params.orderId, Number(params.user_id));
            if (data && data.status === 0 && (new Date().getTime() - new Date(data.orderTime).getTime() > 900000)) {
                data.status = 4;
                await data.save();
            }
            const addressInfo = await user_1.UserAddressModel.findUserAddressById(data.addressId);
            const shopInfo = await shop_1.ShopModel.getShopById(data.shopId);
            const result = Object.assign(Object.assign({}, data), {
                addressName: addressInfo.address_name + addressInfo.address + addressInfo.addressDetail,
                phone: addressInfo.phone,
                userName: addressInfo.name,
                shopName: shopInfo.name
            });
            ctx.body = {
                status: true,
                message: '查询成功',
                data: result
            };
        }
        catch (error) {
            console.log(error);
            ctx.body = {
                status: false,
                message: '订单不存在',
            };
        }
    }
    async createOrder(ctx) {
        const params = ctx.request.body;
        const result = ctx.body = {
            status: false,
            message: '',
            data: null
        };
        if (!params.addressId) {
            result.message = "地址不能位空";
            return;
        }
        ;
        if (!params.foodIds) {
            result.message = "食物id不能为空";
            return;
        }
        ;
        if (!params.tableware) {
            result.message = "餐具必选";
            return;
        }
        ;
        try {
            //生成orderId
            const id = await ids_1.IdsModel.getIds('order_id');
            const orderId = (0, formater_1.createOrderId)(id, ctx.request.body.user_id);
            //计算价格 总原价 优惠后总价格 打包价格
            let originalTotalAmount = 0; //总原价
            let totalAmount = 0; //计算打折优惠后总价格
            let packingFee = 0; //食物打包价格
            const foods = []; //食物列表
            for (var i = 0; i < params.foodIds.length; i++) {
                const food = await food_1.FoodModel.findOne({ item_id: params.foodIds[i].id });
                const foodObject = food.toObject();
                originalTotalAmount += (foodObject.specfoods[0].original_price ? foodObject.specfoods[0].original_price : foodObject.specfoods[0].price) * params.foodIds[i].num;
                totalAmount += foodObject.specfoods[0].price * params.foodIds[i].num;
                packingFee += foodObject.specfoods[0].packing_fee * params.foodIds[i].num;
                foodObject.num = Number(params.foodIds[i].num);
                foods.push(Object.assign(foodObject));
            }
            const shop = await shop_1.ShopModel.getShopById(params.shopId);
            //配送费
            const deliveryFee = shop.float_delivery_fee;
            //满减 满60减8 满30减5 //此处设定为死值  暂需功能配置满减活动值
            const active = [{ amount: 30, reduce: 5 }, { amount: 60, reduce: 8 }];
            //满减优惠金额
            let discountAmount = 0;
            active.forEach(item => {
                if (item.amount <= originalTotalAmount) {
                    discountAmount = item.reduce;
                }
                ;
            });
            //红包
            let redbagAmount = 0;
            let redBag = null;
            if (params.hongbaoId) {
                const hongbao = await hongbao_1.HongbaoModel.getHongbaoById(params.hongbaoId);
                if (hongbao.status === 0 && hongbao.sum_condition < originalTotalAmount) {
                    redbagAmount = hongbao.amount;
                    redBag = {
                        id: hongbao.id,
                        name: hongbao.name,
                        amount: hongbao.amount
                    };
                }
            }
            //配送信息
            const delivery = {
                name: shop.delivery_mode ? shop.delivery_mode.text : "商家配送",
                personName: '高大上',
                timeType: params.deliveryTimeType,
                amount: deliveryFee,
                discountAmount: 3 //免配送费
            };
            //实付金额 = 总优惠后总价格+打包价格 + 配送费 - 满减优惠金额 - 红包 - 3(免配送费3元)
            const payAmount = totalAmount + packingFee + deliveryFee - discountAmount - redbagAmount - delivery.discountAmount;
            const data = new order_1.OrderModel({
                userId: params.user_id,
                orderId: orderId,
                shopId: params.shopId,
                foods: foods,
                totalAmount: totalAmount,
                originalTotalAmount: originalTotalAmount,
                payAmount: payAmount,
                packingFee: packingFee,
                discountAmount: discountAmount,
                redBag: redBag,
                invoice: params.invoice,
                delivery: delivery,
                tableware: params.tableware,
                remarks: params.remarks,
                addressId: params.addressId, //用户配送地址id
            });
            data.save();
            result.status = true;
            result.message = "创建订单成功";
            result.data = data;
        }
        catch (error) {
            console.log(error);
            result.message = "服务端异常,结算失败";
        }
    }
    async payOrder(ctx) {
        const { user_id, orderId } = ctx.request.query;
        const result = ctx.body = {
            status: false,
            message: '',
            data: null
        };
        try {
            const data = await order_1.OrderModel.getOrderById(orderId, Number(user_id));
            if (!data) {
                result.message = "订单不存在";
                return;
            }
            if (data.status !== 0) {
                result.message = "订单支付已超时";
                return;
            }
            ;
            data.status = 1;
            await data.save();
            result.status = true;
            result.message = "支付成功";
            result.data = data;
        }
        catch (error) {
            console.log(error);
            result.message = "支付异常";
        }
    }
    async comfirmReceipt(ctx) {
        const { user_id, orderId } = ctx.request.query;
        const result = ctx.body = {
            status: false,
            message: '',
            data: null
        };
        try {
            const data = await order_1.OrderModel.getOrderById(orderId, Number(user_id));
            if (!data) {
                result.message = "订单不存在";
                return;
            }
            if (data.status === 1) {
                result.message = "订单状态异常";
                return;
            }
            ;
            data.status = 4;
            await data.save();
            result.status = true;
            result.message = "取消订单成功";
            result.data = data;
        }
        catch (error) {
            console.log(error);
            ctx.message = "订单异常";
        }
    }
};
__decorate([
    (0, koa_swagger_decorator_1.request)('get', '/orders'),
    (0, koa_swagger_decorator_1.summary)('获取订单列表'),
    (0, koa_swagger_decorator_1.query)({
        page: { type: 'number' },
        limit: { type: 'number' },
        status: { type: 'number' }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getOrders", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('get', '/getOrderDetail'),
    (0, koa_swagger_decorator_1.summary)('获取订单详情'),
    (0, koa_swagger_decorator_1.query)({
        orderId: { type: 'string' }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getOrderDetail", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('post', '/createOrder'),
    (0, koa_swagger_decorator_1.summary)('创建订单'),
    (0, koa_swagger_decorator_1.body)({
        addressId: { type: 'number', require: true },
        foodIds: {
            type: 'array', require: true, item: {
                id: { type: 'number' },
                num: { type: 'number' } //食物数量
            }
        },
        tableware: { type: 'string', require: true },
        shopId: { type: 'number', require: true },
        invoice: {
            invoiceType: { type: "number" },
            header: { type: 'string' },
            taxesNum: { type: 'string' } //税号或社会信用代码
        },
        remarks: { type: 'sting', require: true },
        hongbaoId: { type: 'number' } //红包id
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "createOrder", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('get', '/payOrder'),
    (0, koa_swagger_decorator_1.summary)('支付订单'),
    (0, koa_swagger_decorator_1.query)({
        orderId: { type: 'string', require: true }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "payOrder", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('get', '/comfirmReceipt'),
    (0, koa_swagger_decorator_1.summary)('确认收货'),
    (0, koa_swagger_decorator_1.query)({
        orderId: { type: 'string', require: true }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "comfirmReceipt", null);
OrderController = __decorate([
    (0, koa_swagger_decorator_1.middlewaresAll)([checkPermission_1.needLogin])
], OrderController);
exports.default = OrderController;
//# sourceMappingURL=order.js.map