import { getModelForClass, modelOptions, prop, ReturnModelType } from "@typegoose/typegoose";
type Type = 'html' | 'css' | 'typescript' | 'javascript' | 'network' | 'vue' | 'other';


@modelOptions({ schemaOptions: { collection: 'wechatType' } })
class WxType {
  @prop({ required: true })
  id: number;

  @prop({ required: true })
  type: number;//文档类型 html or css or ts or node or...

  @prop({ required: true })
  name: string;//名称

  @prop({ type: String, default: [] })
  contentTypes: string[];

  @prop({ default: new Date })
  creatAt?: Date;//创建时间

  public static async getWxTypeById(this: ReturnModelType<typeof WxType>, id: number) {
    return this.findOne({ id }, { _id: 0, __v: 0 });
  }

  public static async getWxTypeAll(this: ReturnModelType<typeof WxType>) {
    return this.find({}, { _id: 0, __v: 0, creatAt: 0 });
  }
}

//微信小程序知识文档
@modelOptions({ schemaOptions: { collection: 'wechat' } })
class WxClass {
  @prop({ required: true })
  id: number;

  @prop({ required: true })
  type: number;//文档类型 html or css or ts or node or...

  @prop({ default: 'info' })
  contentType?: string;//内容类型---info or question or other

  @prop({ required: true })
  title: string;//标题

  @prop({ required: true })
  content: string;//内容

  @prop({ default: new Date })
  creatAt?: Date;//创建时间

  @prop({ default: "Mr Wan" })
  autor?: string;

  public static async getWxInfoList(this: ReturnModelType<typeof WxClass>, type: number, page: number, limit: number = 10) {
    return this.find({ type }, { _v: 0, _id: 0 }).sort({ creatAt: -1 }).limit(limit).skip((page - 1) * limit);
  }

  public static async getWxInfoById(this: ReturnModelType<typeof WxClass>, id: number) {
    return this.findOne({ id }, { _v: 0, _id: 0 });
  }
}

const WxTypeModel = getModelForClass(WxType);
const WxClassModel = getModelForClass(WxClass);


export { WxTypeModel, WxClassModel }