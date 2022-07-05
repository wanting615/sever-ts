import { getModelForClass, modelOptions, prop, ReturnModelType } from "@typegoose/typegoose";

// 微信用户
@modelOptions({ schemaOptions: { collection: "wechatUser" } })
class WxUser{
  @prop({required: true, unique: true})
  openid: string;

  @prop({required: true})
  session_key: string;

  @prop({default: ""})
  nickName?: string; // 用户名

  @prop({default: null})
  gender?: number;
  
  @prop({default: ""})
  avatarUrl?: string;

  @prop({default: []}) // 阅读记录
  views?: number[];

  @prop({default: []}) // 点赞记录
  praises?: number[];

  @prop({default: Date.now})
  creatAt?: Date;//创建时间

  public static async findUser(this: ReturnModelType<typeof WxUser>, openid: string) {
    return this.findOne({openid});
  }

  public static async updateUser(this:ReturnModelType<typeof WxUser> , openid:string, userInfo: any){
    return this.updateOne({openid}, userInfo);
  }
}

// 文档意见提交
@modelOptions({schemaOptions: { collection: "wechatFeedback" }})
class WxFeedBack {
  @prop({required: true})
  openid: string; // 用户openid

  @prop({required: true})
  docId: number; // 文档id
  
  @prop({required: true})
  info: string; // 意见内容

  @prop({default: ""})
  autor?: string; // 提交者
  
  @prop({default: Date.now})
  creatAt?: Date;//创建时间

  public static async findFeedBack(this: ReturnModelType<typeof WxFeedBack>, openid: string){
    return await this.findOne({openid}, {$sort: {_id: -1}});
  }
}

const WxUserModel = getModelForClass(WxUser);
const WxFeedBackModel = getModelForClass(WxFeedBack);
export { WxUserModel, WxFeedBackModel};