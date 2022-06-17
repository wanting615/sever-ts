import { getModelForClass, modelOptions, prop, ReturnModelType } from "@typegoose/typegoose";
import { ResultDataType } from "../types/result";
import { Food } from "./food";

@modelOptions({ schemaOptions: { _id: false } })
class RedBag {//红包信息
  @prop({ required: true })
  id: number;//红包id 

  @prop({ required: true })
  name: string;//红包名称 

  @prop({ required: true })
  amount: number;//红包金额 
}

@modelOptions({ schemaOptions: { _id: false } })
class Invoice {//发票信息
  @prop({ default: 2 })
  invoiceType?: number;//1公司2个人

  @prop({ required: true })
  header: string;//抬头

  @prop({ required: true })
  taxesNum: string;//税号或社会信用代码
}

@modelOptions({ schemaOptions: { _id: false } })
class Delivery {//配送信息
  @prop({ required: true })
  name: string;//配送名称

  @prop({ required: true })
  personName: string;//配送人员名称

  @prop({ default: "尽快送达" })
  timeType?: string;//配送方式

  @prop({ default: 0 })
  amount?: number;//配送费用

  @prop({ default: 0 })
  discountAmount?: number;//配送减免费
}

@modelOptions({ schemaOptions: { _id: false } })
class ScoreInfo {//订单评价
  @prop({ default: 5 })
  delivery?: number;//配送评价分

  @prop({ default: 5 })
  shop?: number;//商店评价分
}

@modelOptions({ options: { customName: "orders" }, schemaOptions: { _id: false } })
class Order {
  @prop({ required: true })
  userId: number;

  @prop({ required: true })
  orderId: string;//订单id

  @prop({ default: 0 })
  status: number;//订单状态 0 未支付，1 已支付 2已完成 4 已取消

  @prop({ default: Date.now })
  orderTime: Date;//订单创建时间

  @prop({ default: "" })
  remarks?: string;//备注

  @prop({ required: true })
  shopId: number;

  @prop({ type: Food })
  foods: Food[];//订单食物清单

  @prop({ required: true })
  addressId: number;//地址id 

  @prop({ required: true })
  totalAmount: number;//打折后总金额

  @prop({ required: true })
  originalTotalAmount: number;//总原价

  @prop({ required: true })
  packingFee: number;//打包费

  @prop({ required: true })
  payAmount: number;//实付金额

  @prop({ default: 0 })
  discountAmount?: number;

  @prop({ default: 0 })
  subsidyAmount?: number;//补贴金额

  @prop({ default: false })
  is_new?: boolean;//是否新用户下单

  @prop({ default: 0 })
  isNewAmount?: number;//新用户立减金额

  @prop({ default: 0 })
  fullMinus?: number;//满减金额

  @prop({ default: "" })
  tableware: string;//餐具

  @prop({ type: RedBag })
  redBag?: RedBag;//红包

  @prop({ type: Invoice })
  invoice?: Invoice;//发票

  @prop({ type: Delivery })
  delivery?: Delivery;//配送信息

  @prop({ type: ScoreInfo })
  scoreInfo?: ScoreInfo;//订单评价

  //获取用户订单
  public static async getOrders(this: ReturnModelType<typeof Order>, userId: number, page: number, limit: number, status: string | string[] | undefined) {
    const filters: any = status === undefined ? { userId } : { userId, status };
    const data = await this.find(filters, { _id: 0, __v: 0 }).sort({ orderTime: -1 }).limit(limit).skip(Number(page - 1) * Number(limit));
    return data;
  }
  //获取用户订单数量
  public static async getOrdersCount(this: ReturnModelType<typeof Order>, userId: number) {
    return this.count({ userId });
  }
  //获取订单详情
  public static async getOrderById(this: ReturnModelType<typeof Order>, orderId: string, userId: number) {
    return this.findOne({ orderId, userId });
  }
}
export type OrderDataType = ResultDataType<Order>;

export const OrderModel = getModelForClass(Order);