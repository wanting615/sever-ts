import { getModelForClass, index, modelOptions, prop, ReturnModelType } from "@typegoose/typegoose";

@modelOptions({ schemaOptions: { _id: false } })
class ReplaysDetail {
  @prop({ required: true })
  replyId: number;

  @prop({ default: '' })
  username: string;

  @prop({ required: true })
  userId: number;

  @prop({ default: 'default.jpg' })
  userAvatar?: string;

  @prop()
  detail: string;

  @prop({ default: Date.now })
  time?: Date;

  @prop({ default: 0 })
  praises?: number;
}

@modelOptions({ options: { customName: 'finds', allowMixed: 0 }, schemaOptions: { _id: false } })
class Find {
  @prop({ required: true })
  id: number;

  @prop({ required: true })
  shopId: number;

  @prop({ required: true })
  vedioPath: string;

  @prop({ default: 0 })
  praises: number;

  @prop({ default: 0 })
  replys: number;

  @prop({ default: '' })
  tips: string;

  @prop({ default: Date.now })
  time: Date;

  @prop({ type: ReplaysDetail })
  replaysDetails: ReplaysDetail[];

  @prop()
  shopInfo?: any

  public static async getFinds(this: ReturnModelType<typeof Find>, page: number = 1, limit: number = 10) {
    return this.find({}, { _id: 0, __v: 0 }).sort({ time: -1 }).limit(limit).skip((page - 1) * limit);
  }

  public static async getFindById(this: ReturnModelType<typeof Find>, id: number) {
    return this.findOne({ id })
  }

  public static async getFindByShopId(this: ReturnModelType<typeof Find>, shopId: number) {
    return this.find({ shopId })
  }
}

const FindModel = getModelForClass(Find);

export { FindModel }