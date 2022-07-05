import { DocumentType, getModelForClass, index, modelOptions, prop, ReturnModelType } from "@typegoose/typegoose";
import { Column_desc } from "../types/user";

//用户
@modelOptions({ schemaOptions: { _id: false } })
class User {
  @prop({ required: true })
  public user_id: number;

  @prop({ required: true })
  public username: string;

  @prop({ required: true })
  public password: string;

  @prop()
  public name: string;

  //查询用户
  public static async findUser(this: ReturnModelType<typeof User>, username: string) {
    return this.findOne({ username });
  }

  //查询用户 by userid
  public static async findUserById(this: ReturnModelType<typeof User>, user_id: number) {
    return this.findOne({ user_id });
  }
  //删除用户
  public static async delUser(this: ReturnModelType<typeof User>, user_id: number) {
    return await this.deleteOne({ user_id });
  }

  //修改密码
  public static async changePwd(this: DocumentType<User>, password: string): Promise<void> {
    this.password = password;
    this.save();
  }
}

//用户信息
@index({ id: 1 })
@modelOptions({ options: { allowMixed: 0, customName: "userinfos" }, schemaOptions: { _id: false } })
class UserInfo {
  @prop({ default: "default.jpg" })
  public avatar: string;

  @prop({ default: 0 })
  public balance: number;

  @prop({ default: 0 })
  public brand_member_new: number;

  @prop({ default: 0 })
  public current_address_id: number;

  @prop({ default: 0 })
  public current_invoice_id: number;

  @prop({ default: 0 })
  public delivery_card_expire_days: number;

  @prop({ default: "" })
  public email: string;

  @prop({ default: 3 })
  public gift_amount: number;

  @prop()
  public city: string;

  @prop()
  public registe_time: string;

  @prop()
  public id: number;

  @prop()
  public user_id: number;

  @prop({ default: 1 })
  public is_active: number;

  @prop({ default: false })
  public is_email_valid: boolean;

  @prop({ default: true })
  public is_mobile_valid: boolean;

  @prop({ default: "" })
  public mobile: string;

  @prop({ default: 0 })
  public point: number;

  @prop()
  public username: string;

  @prop({
    default: {
      game_desc: "玩游戏领红包",
      game_image_hash: "05f108ca4e0c543488799f0c7c708cb1jpeg",
      game_is_show: 1,
      game_link: "https://gamecenter.faas.ele.me",
      gift_mall_desc: "0元好物在这里",
    }
  })
  public column_desc: Column_desc;

  //查询用户信息
  public static async findUserInfo(this: ReturnModelType<typeof UserInfo>, user_id: number) {
    return this.findOne({ user_id }, { __v: 0 });
  }

  //删除用户信息
  public static async delUserInfo(this: ReturnModelType<typeof UserInfo>, user_id: number) {
    return this.deleteOne({ user_id });
  }
}

//用户收货地址
@modelOptions({ options: { customName: "addresses" } })
class UserAddress {
  @prop()
  public id?: number;

  @prop()//用户id
  public user_id?: number;

  @prop()//姓名
  public name: string;

  @prop()//手机号
  public phone: string;

  @prop({ default: "" })//性别
  public sex: string;

  @prop()//经纬度
  public st_geohash: string;

  @prop({ default: "" })//城市name
  public city_name: string;

  @prop({ default: "" })//区名
  public area_name: string;

  @prop()//市级、小区、街道
  public address: string;

  @prop()//详细地址
  public addressDetail: string;

  @prop()//地址名
  public address_name: string;

  @prop()//标签 家or公司or..
  public tag: string;

  @prop()//标签类型
  public tag_type: number;

  @prop({ default: true })//是否绑定手机
  public phone_had_bound?: boolean;

  @prop({ default: 1 })//是否有效
  public is_valid?: number;

  @prop({ default: Date.now })//创建时间
  public created_at?: Date;

  @prop({ default: false })//是否默认
  public is_user_default?: boolean;
  //通过id 查询用户地址
  public static async findUserAddressById(this: ReturnModelType<typeof UserAddress>, id: number) {
    return this.findOne({ id }, { _id: 0, __v: 0 });
  }
  //通过user_id 查询用户地址
  public static async findUserAddress(this: ReturnModelType<typeof UserAddress>, user_id: number) {
    return this.find({ user_id }, { _id: 0, __v: 0 });
  }

  //通过user_id 更新用户地址
  public static async updateUserAddress(this: ReturnModelType<typeof UserAddress>, user_id: number, id: number, userAddressInfo: UserAddress): Promise<unknown> {
    return this.updateOne({ user_id: user_id, id: id }, userAddressInfo);
  }

  //删除用户地址
  //通过user_id 查询用户地址
  public static async delUserAddress(this: ReturnModelType<typeof UserAddress>, user_id: number, id: number): Promise<unknown>  {
    return this.deleteOne({ user_id, id });
  }

}


const UserModel = getModelForClass(User);
const UserInfoModel = getModelForClass(UserInfo);
const UserAddressModel = getModelForClass(UserAddress);

export { UserModel, UserInfoModel, UserAddressModel, User, UserAddress};