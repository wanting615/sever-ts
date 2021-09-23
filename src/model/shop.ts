import { getModelForClass, modelOptions, prop, Ref, ReturnModelType } from "@typegoose/typegoose";
import { Activity, DeliveryMode, Identification, License, PiecewiseAgentFee, Support } from "./public";
import { Filter, SortWay } from "../types/shop";
import { Food } from "./food";


@modelOptions({ options: { customName: 'shops' }, schemaOptions: { _id: false } })
class Shops {
  @prop({ required: true })
  id: number;

  @prop()
  address: string;

  @prop({ default: '' })
  description: string;

  @prop({ default: '' })
  order_lead_time: string;

  @prop({ default: '' })
  distance: string;

  @prop({ type: () => [Number], index: '2d' })
  location: number[];

  @prop({ default: 0 })
  float_delivery_fee: number;

  @prop({ default: 0 })
  float_minimum_order_amount: number;

  @prop()
  category: string;

  @prop({ default: '' })
  image_path: string;

  @prop({ default: false })
  is_premium: boolean;

  @prop({ default: false })
  is_new: boolean;

  @prop()
  latitude: number;

  @prop()
  longitude: number;

  @prop({ required: true })
  name!: string;

  @prop({ required: true })
  phone!: string;

  @prop()
  public piecewise_agent_fee: PiecewiseAgentFee

  @prop({ default: '欢迎光临，用餐高峰请提前下单，谢谢' })
  promotion_info: string;

  @prop({ default: 0 })
  rating: number;

  @prop({ default: 0 })
  rating_count: number;

  @prop({ default: 0 })
  recent_order_num: number;

  @prop({ default: 0 })
  status: number;

  @prop({ type: () => [String], default: ['08:30/20:30'] })
  opening_hours: string[];

  @prop({ type: Activity })
  activities: Activity;

  @prop({ type: Identification })
  identification: Identification;

  @prop({ type: DeliveryMode })
  delivery_mode: DeliveryMode;

  @prop({ type: License })
  license: License;

  @prop({ type: Support, _id: false })
  public supports: Support[]


  //获取商铺列表
  public static async getShops(this: ReturnModelType<typeof Shops>, filter: Filter, sortWay: SortWay, page: number, limit: number) {
    return this.find(filter, { _id: 0, __v: 0 }).sort(sortWay).limit(limit).skip((page - 1) * limit)
  }

  //获取商铺详情-id
  public static async getShopById(this: ReturnModelType<typeof Shops>, shopId: number) {
    return this.findOne({ id: shopId }, { _id: 0, __v: 0 })
  }
}

//商店菜单栏
@modelOptions({ options: { customName: 'menus' } })
class ShopMenu {
  @prop({ required: true })
  id: number;

  @prop({ default: true })
  is_selected: boolean;

  @prop({ default: '' })
  icon_url: string;

  @prop({ required: true })
  iconname_url: string;

  @prop({ required: true })
  restaurant_id: number;

  @prop({ default: 1 })
  type: string;

  @prop({ ref: () => Food })
  identification: Ref<Food>;

  //获取商铺食品--按分类
  public static async getShopMenu(this: ReturnModelType<typeof ShopMenu>, shopId: number) {
    return this.find({ restaurant_id: shopId })
  }
}

const ShopModel = getModelForClass(Shops);

const ShopMenuModel = getModelForClass(ShopMenu);

export { ShopModel, Shops, ShopMenuModel }