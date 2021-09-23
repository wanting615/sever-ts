import { IdsList } from "../types/ids";
import { getModelForClass, modelOptions, prop, ReturnModelType } from "@typegoose/typegoose";

@modelOptions({ options: { customName: 'ids' } })
class Id {
  @prop()
  public restaurant_id: number;
  @prop()
  public food_id: number;
  @prop()
  public order_id: number;
  @prop()
  public user_id: number;
  @prop()
  public address_id: number;
  @prop()
  public cart_id: number;
  @prop()
  public img_id: number;
  @prop()
  public category_id: number;
  @prop()
  public item_id: number;
  @prop()
  public sku_id: number;
  @prop()
  public admin_id: number;
  @prop()
  public statis_id: number;
  @prop()
  public find_id: number;
  @prop()
  public hongbao_id: number;

  //获取自增id
  public static async getIds(this: ReturnModelType<typeof Id>, id: IdsList): Promise<number> {
    try {
      const idsData = await this.findOne();
      idsData[id] = idsData[id] ? idsData[id] : 0;
      idsData[id]++;
      await idsData.save();
      return idsData[id];
    } catch (error) {
      console.log('获取ID数据失败');
      throw new Error(error)
    }
  }
}
const IdsModel = getModelForClass(Id);

IdsModel.findOne((_error: any, data: any) => {
  if (!data) {
    const newIds = new IdsModel({
      restaurant_id: 0,
      food_id: 0,
      order_id: 0,
      user_id: 0,
      address_id: 0,
      cart_id: 0,
      img_id: 0,
      category_id: 0,
      item_id: 0,
      sku_id: 0,
      admin_id: 0,
      statis_id: 0,
      find_id: 0,
      hongbao_id: 0
    });
    newIds.save();
  }
})

export { IdsModel }