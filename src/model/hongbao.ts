import { getModelForClass, modelOptions, prop, ReturnModelType } from "@typegoose/typegoose";

@modelOptions({ schemaOptions: { _id: false } })
class DescMap {
  @prop({ required: true })
  phone: string;//限制手机号使用

  @prop({ required: true })
  online_paid_only: string;//限制在线使用

  @prop()
  validity_delta?: string;//多少天后使用

  @prop({ required: true })
  validity_periods: string;//什么时候到期

  @prop({ required: true })
  sum_condition: String//满多少使用
}

@modelOptions({ options: { customName: 'hongbaos' }, schemaOptions: { _id: false } })
class Hongbao {
  @prop({ required: true })
  id: number;

  @prop({ required: true })
  sn: Date;

  @prop({ required: true })
  user_id: number;//用户id

  @prop({ required: true })
  amount: number;//红包大小

  @prop({ required: true })
  sum_condition: number;//满多少金额可用

  @prop({ required: true })
  name: string;//红包名称

  @prop({ default: '' })
  phone?: string;//手机号

  @prop({ required: true })
  begin_date: Date;//开始时间

  @prop({ required: true })
  end_date: Date;//结束时间

  @prop({ default: 0 })
  status?: number;//红包状态

  @prop({ default: 1 })
  present_status?: number;//当前状态

  @prop({ default: 1 })
  share_status?: number;//是否是分享红包

  @prop({ required: true, type: DescMap })
  description_map: DescMap;

  public static async getHongbaos(this: ReturnModelType<typeof Hongbao>, user_id: number, status: number, limit = 10, offset = 1) {
    const data = await this.updateHongbaos(user_id);
    return await this.find({ user_id, status, present_status: 1 }, '-_id').limit(limit).skip((offset - 1) * limit);
  }

  public static async getHongbaoById(this: ReturnModelType<typeof Hongbao>, id: number) {
    return await this.findOne({ id })
  }

  /**
   * 更新过期红包
   */
  public static async updateHongbaos(this: ReturnModelType<typeof Hongbao>, user_id: number) {
    const nowDate = new Date();
    const hongbaoList = await this.find({ user_id: user_id, status: 0 });
    for (var i = 0; i < hongbaoList.length; i++) {
      if (new Date(hongbaoList[i].end_date) < nowDate) {
        hongbaoList[i].status = 1
        await hongbaoList[i].save();
      }
    }
  }
}

export const HongbaoModel = getModelForClass(Hongbao);

