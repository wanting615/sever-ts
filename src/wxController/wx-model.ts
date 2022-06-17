import { getModelForClass, modelOptions, prop, ReturnModelType} from "@typegoose/typegoose";
import { ResultDataType } from "../types/result";

//微信小程序文档类型
@modelOptions({ schemaOptions: { collection: "wechatType" } })
class WxType {
  @prop({ required: true })
  id: number;

  @prop({ required: true })
  type: number;//文档类型 html or css or ts or node or...

  @prop({ required: true })
  name: string;//名称html or css or ts or node or...

  @prop({ required: true })
  iconUrl: string;//文档类型icon

  @prop({ type: String, default: [] })
  contentTypes: string[];

  @prop({ default: new Date })
  creatAt?: Date;//创建时间

  public static async getWxTypeById(this: ReturnModelType<typeof WxType>, id: number): Promise<ResultDataType<WxType>> {
    return this.findOne({ id }, { _id: 0, __v: 0 });
  }

  public static async getWxInfoByType(this: ReturnModelType<typeof WxType>, type: number): Promise<ResultDataType<WxType>> {
    return this.findOne({ type });
  }

  public static async getWxTypeAll(this: ReturnModelType<typeof WxType>): Promise<ResultDataType<WxType>[]> {
    return this.find({}, { _id: 0, __v: 0, creatAt: 0 });
  }
}

//微信小程序知识文档
@modelOptions({ schemaOptions: { collection: "wechat" } })
class WxDoc {
  @prop({ required: true })
  id: number;

  @prop({ required: true })
  type: number;//文档类型 html or css or ts or node or...

  @prop({ default: "info" })
  contentType: string;//内容类型---info or question or other

  @prop({ required: true })
  title: string;//标题

  @prop({ required: true })
  typeName: string;//类型名称

  @prop({ required: true })
  content: string;//内容

  @prop({ default: new Date })
  creatAt?: Date;//创建时间

  @prop({ default: "Mr Wan" })
  autor?: string;

  @prop({ default: 0})
  disabled: number; // 是否删除 删除disabled为1
  //获取type类型的文档
  public static async getDocByType(this: ReturnModelType<typeof WxDoc>, type: number, contentType: string, page: number, limit: number = 10): Promise<ResultDataType<WxDoc>[]>  {
    return this.find({ type, contentType,disabled: {$ne: 1} }, { _v: 0, _id: 0 }).sort({ creatAt: -1 }).limit(limit).skip((page - 1) * limit);
  }

  //获取某类型总条数
  public static async getDocNumByType(this: ReturnModelType<typeof WxDoc>, type: number, contentType: string): Promise<ResultDataType<WxDoc>[]>  {
    return this.find({ type, contentType, disabled: {$ne: 1}});
  }

  //通过id获取某文档
  public static async getWxInfoById(this: ReturnModelType<typeof WxDoc>, id: number): Promise<ResultDataType<WxDoc>> {
    return this.findOne({ id });
  }

  //删除某文档
  public static async delDocById(this: ReturnModelType<typeof WxDoc>, id: number): Promise<ResultDataType<WxDoc>>  {
    return this.remove({ id });
  }
}

const WxTypeModel = getModelForClass(WxType);
const WxDocModel = getModelForClass(WxDoc);

type WxTypeData = ResultDataType<WxType>;
type WxDocData = ResultDataType<WxDoc>;

export { WxTypeModel, WxDocModel, WxTypeData, WxDocData};