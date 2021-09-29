import { getModelForClass, index, modelOptions, prop, Ref } from "@typegoose/typegoose";

class Attribute {
  @prop({ default: '' })
  icon_color: string

  @prop({ default: '' })
  icon_name: string
}
class Specification {
  @prop({ default: '' })
  name: string

  @prop({ type: String, default: [] })
  values: string[]
}
class Activity {
  @prop({ default: '' })
  image_text_color: string

  @prop({ default: '' })
  icon_color: string

  @prop({ default: '' })
  image_text: string
}

class Spec {
  @prop()
  name: string;//规格名称
  @prop()
  value: string;//规格名称
}

class Specfood {
  @prop()
  checkout_mode: number;

  @prop()
  food_id: number;

  @prop()
  is_essential: boolean;//必点品

  @prop()
  image_text: number;

  @prop()
  item_id: number;//item id

  @prop()
  name: string;//食品名称

  @prop()
  original_price: number;//原价

  @prop()
  packing_fee: number;//打包价格

  @prop()
  pinyin_name: string;//pinyin名字

  @prop()
  price: number;//现价

  @prop()
  promotion_stock: string;

  @prop()
  recent_popularity: number;//最近留下

  @prop()
  recent_rating: number;//最近评分

  @prop()
  restaurant_id: number;//餐馆id

  @prop()
  sku_id: number;//规格id

  @prop()
  sold_out: boolean;//已售罄

  @prop()
  specs_name: string;//规格名称

  @prop()
  stock: number;//库存数量

  @prop({ type: Spec })
  specs: Spec;

}

@index({ id: 1 })
@modelOptions({ options: { customName: 'foods', allowMixed: 0, } })
class Food {
  @prop({ required: true })
  item_id: number;//id

  @prop({ required: true })
  restaurant_id: number;//餐馆id

  @prop({ required: true })
  category_id: number;//分类id

  @prop({ required: true })
  name: string;//名

  @prop({ default: '' })
  image_path: string;//图片路径

  @prop({ default: '' })
  tips: string;//标签

  @prop({ default: '' })
  description: string;//描述

  @prop({ default: '' })
  pinyin_name: string;

  @prop({ default: 0 })
  rating: number;//评分

  @prop({ default: 0 })
  month_sales: number;//月售

  @prop({ default: 0 })
  rating_count: number;//评分数量

  @prop({ default: 0 })
  is_featured: number;

  @prop({ default: [] })
  display_times: string[];

  @prop({ default: [] })
  attrs: any[];

  @prop({ default: Date.now })
  server_utc: Date;

  @prop({ default: false })
  is_essential: boolean;

  @prop({ default: 0 })
  satisfy_count: number;

  @prop({ default: 0 })
  satisfy_rate: number;

  @prop({ type: Attribute })
  attributes: Attribute[];

  @prop({ type: Specification })
  specifications: Specification[];

  @prop()
  limitation: any;

  @prop({ type: Activity })
  activity: Activity;

  @prop({ type: Specfood })
  specfoods: Specfood[];

  @prop()
  num?: number;
}

const FoodModel = getModelForClass(Food);

export { Food, FoodModel }