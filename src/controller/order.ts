import { Context } from "koa";
import { body, middlewaresAll, query, request, summary } from "koa-swagger-decorator";
import { needLogin } from "./../middleware/checkPermission";
import { OrderModel } from "../model/order";
import { ShopModel } from "../model/shop";
import { UserAddressModel } from "../model/user";
import { IdsModel } from "../model/ids";
import { Result } from "./../types/result";
import { createOrderId } from "../until/formater";
import { FoodModel } from "../model/food";
import { HongbaoModel } from "../model/hongbao";

@middlewaresAll([needLogin])
export default class OrderController {
  @request("get", "/orders")
  @summary("获取订单列表")
  @query({
    page: { type: "number" },
    limit: { type: "number" },
    status: { type: "number" }
  })
  async getOrders(ctx: Context) {
    const {
      user_id,
      page = 1,
      limit = 10,
      status
    } = ctx.request.query;

    try {
      const data = await OrderModel.getOrders(Number(user_id), Number(page), Number(limit), status);
      const count = await OrderModel.getOrdersCount(Number(user_id));
      const results = [];//返回数据
      //超15分钟未支付 超时处理
      for (let i = 0; i < data.length; i++) {
        if (data[i].status === 0 && (new Date().getTime() - new Date(data[i].orderTime).getTime() > 900000)) {
          data[i].status = 4;
          data[i].save();
        }
        const shop = await ShopModel.getShopById(data[i].shopId);
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
        message: "查询成功"
      };
    } catch (error) {
      ctx.boyd = {
        status: false,
        message: "查询失败"
      };
      throw new Error(error);
    }
  }

  @request("get", "/getOrderDetail")
  @summary("获取订单详情")
  @query({
    orderId: { type: "string" }
  })
  async getOrderDetail(ctx: Context) {
    const params = ctx.request.query;
    try {
      const data = await OrderModel.getOrderById(params.orderId as string, Number(params.user_id));
      if (data && data.status === 0 && (new Date().getTime() - new Date(data.orderTime).getTime() > 900000)) {
        data.status = 4;
        await data.save();
      }
      const addressInfo = await UserAddressModel.findUserAddressById(data.addressId);
      const shopInfo = await ShopModel.getShopById(data.shopId);

      const result = {
        ...data,
        ...{
          addressName: addressInfo.address_name + addressInfo.address + addressInfo.addressDetail,
          phone: addressInfo.phone,
          userName: addressInfo.name,
          shopName: shopInfo.name
        }
      };
      ctx.body = {
        status: true,
        message: "查询成功",
        data: result
      };
    } catch (error) {
      console.log(error);
      ctx.body = {
        status: false,
        message: "订单不存在",
      };
    }
  }

  @request("post", "/createOrder")
  @summary("创建订单")
  @body({
    addressId: { type: "number", require: true },//配送地址id
    foodIds: {
      type: "array", require: true, item: {//食物清单
        id: { type: "number" },//食物id
        num: { type: "number" }//食物数量
      }
    },
    tableware: { type: "string", require: true },//餐具
    shopId: { type: "number", require: true },//商店id
    invoice: { //发票信息
      invoiceType: { type: "number" },//发票类型
      header: { type: "string" },//抬头
      taxesNum: { type: "string" }//税号或社会信用代码
    },
    remarks: { type: "sting", require: true },//备注
    hongbaoId: { type: "number" }//红包id
  })
  async createOrder(ctx: Context) {
    const params = ctx.request.body;
    const result: Result = ctx.body = {
      status: false,
      message: "",
      data: null
    };
    if (!params.addressId) { result.message = "地址不能位空"; return; }
    if (!params.foodIds) { result.message = "食物id不能为空"; return; }
    if (!params.tableware) { result.message = "餐具必选"; return; }

    try {
      //生成orderId
      const id = await IdsModel.getIds("order_id");
      const orderId = createOrderId(id, ctx.request.body.user_id);

      //计算价格 总原价 优惠后总价格 打包价格
      let originalTotalAmount = 0;//总原价
      let totalAmount = 0;//计算打折优惠后总价格
      let packingFee = 0;//食物打包价格
      const foods = [];//食物列表
      for (let i = 0; i < params.foodIds.length; i++) {
        const food = await FoodModel.findOne({ item_id: params.foodIds[i].id });
        const foodObject = food.toObject();
        originalTotalAmount += (foodObject.specfoods[0].original_price ? foodObject.specfoods[0].original_price : foodObject.specfoods[0].price) * params.foodIds[i].num;
        totalAmount += foodObject.specfoods[0].price * params.foodIds[i].num;
        packingFee += foodObject.specfoods[0].packing_fee * params.foodIds[i].num;
        foodObject.num = Number(params.foodIds[i].num);
        foods.push(Object.assign(foodObject));
      }

      const shop = await ShopModel.getShopById(params.shopId);
      //配送费
      const deliveryFee = shop.float_delivery_fee;
      //满减 满60减8 满30减5 //此处设定为死值  暂需功能配置满减活动值
      const active = [{ amount: 30, reduce: 5 }, { amount: 60, reduce: 8 }];
      //满减优惠金额
      let discountAmount = 0;
      active.forEach(item => {
        if (item.amount <= originalTotalAmount) { discountAmount = item.reduce; }
      });
      //红包
      let redbagAmount = 0;
      let redBag = null;
      if (params.hongbaoId) {
        const hongbao = await HongbaoModel.getHongbaoById(params.hongbaoId);
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
        name: shop.delivery_mode ? shop.delivery_mode.text : "商家配送",//配送名称
        personName: "高大上",//配送人
        timeType: params.deliveryTimeType,//配送时间方式
        amount: deliveryFee,//配送费
        discountAmount: 3//免配送费
      };

      //实付金额 = 总优惠后总价格+打包价格 + 配送费 - 满减优惠金额 - 红包 - 3(免配送费3元)
      const payAmount = totalAmount + packingFee + deliveryFee - discountAmount - redbagAmount - delivery.discountAmount;

      const data = new OrderModel({
        userId: params.user_id,
        orderId: orderId,
        shopId: params.shopId,//商店id-
        foods: foods,//食物-
        totalAmount: totalAmount,//总金额 -
        originalTotalAmount: originalTotalAmount,//总原价-
        payAmount: payAmount,//实付金额 -
        packingFee: packingFee,//打包费-
        discountAmount: discountAmount,//优惠金额-
        redBag: redBag,//红包信息-
        invoice: params.invoice,//发票信息
        delivery: delivery,//配送信息
        tableware: params.tableware,//餐具
        remarks: params.remarks,//用户备注
        addressId: params.addressId,//用户配送地址id
      });
      data.save();
      result.status = true;
      result.message = "创建订单成功";
      result.data = data;
    } catch (error) {
      console.log(error);
      result.message = "服务端异常,结算失败";
    }
  }

  @request("get", "/payOrder")
  @summary("支付订单")
  @query({
    orderId: { type: "string", require: true }
  })
  async payOrder(ctx: Context) {
    const { user_id, orderId } = ctx.request.query;
    const result: Result = ctx.body = {
      status: false,
      message: "",
      data: null
    };
    try {
      const data = await OrderModel.getOrderById(orderId as string, Number(user_id));
      if (!data) { result.message = "订单不存在"; return; }
      if (data.status !== 0) { result.message = "订单支付已超时"; return; }
      data.status = 1;
      await data.save();
      result.status = true;
      result.message = "支付成功";
      result.data = data;
    } catch (error) {
      console.log(error);
      result.message = "支付异常";
    }
  }

  @request("get", "/comfirmReceipt")
  @summary("确认收货")
  @query({
    orderId: { type: "string", require: true }
  })
  async comfirmReceipt(ctx: Context) {
    const { user_id, orderId } = ctx.request.query;
    const result: Result = ctx.body = {
      status: false,
      message: "",
      data: null
    };
    try {
      const data = await OrderModel.getOrderById(orderId as string, Number(user_id));
      if (!data) { result.message = "订单不存在"; return; }
      if (data.status === 1) { result.message = "订单状态异常"; return; }
      data.status = 4;
      await data.save();
      result.status = true;
      result.message = "取消订单成功";
      result.data = data;
    } catch (error) {
      console.log(error);
      ctx.message = "订单异常";
    }
  }
}