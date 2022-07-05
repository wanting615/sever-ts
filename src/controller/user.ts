import { body, middlewares, prefix, query, request, summary } from "koa-swagger-decorator";
import { User, UserAddress, UserModel, UserInfoModel, UserAddressModel } from "../model/user";
import { IdsModel } from "../model/ids";
import RsaDecrypt from "../until/rsa";
import Address from "../until/address";
import { useFormatTime } from "../until/formater";
import { needLogin } from "../middleware/checkPermission";

@prefix("/user")
export default class UserController {
  @request("post", "/login")
  @summary("登陆")
  @body(User)
  public static async login(ctx: Ctx): Promise<void> {
    const body = ctx.validatedBody;
    ctx.body = { message: "", status: false, data: null };
    if (!body.token) {
      ctx.fail("参数不能为空");
      return;
    }

    const paramsStr = RsaDecrypt.decrypt(body.token);
    if (!paramsStr) {
      ctx.fail("参数错误");
      return;
    }

    const { username, password } = RsaDecrypt.strParse(paramsStr);

    if (!username) {
      ctx.fail("请输入用户名");
      return;
    }
    if (!password) {
      ctx.fail("请输入密码");
      return;
    }

    const passwordMd5 = RsaDecrypt.encryption(password);
    try {
      const user = await UserModel.findUser(username);
      if (!user) { //不存在用户-直接注册
        const user_id = await IdsModel.getIds("user_id");
        //user表创建
        // UserModel.addUser(username, passwordMd5, user_id);
        const userDoc = new UserModel({
          username,
          user_id: user_id,
          password: passwordMd5
        });
        userDoc.save();
        //UserInfo表创建信息
        let city = "上海";
        try {
          const cityInfo: any = await Address.guessPosition(ctx);
          city = cityInfo.city;
        } catch (error) {
          console.log(error);
        }
        const registe_time = useFormatTime("YYYY-mm-dd HH:MM", new Date());
        // const userInfo = await UserModel.addUserInfo(user_id, user_id, username, city, registe_time);
        const doc = new UserInfoModel({
          id: user_id,
          user_id,
          username,
          city,
          registe_time
        });
        const userInfo = await doc.save();
        ctx.success(userInfo, "注册成功");
      } else if (user.password.toString() !== passwordMd5) {//密码不对
        ctx.fail("密码错误");
      } else {
        const userInfo = await UserInfoModel.findUserInfo(user.user_id);
        ctx.success(userInfo, "登陆成功");
      }
    } catch (error) {
      console.log(error);
    }
  }

  @request("get", "/delUser")
  @summary("删除用户")
  @middlewares([needLogin])
  @query({
    user_id: {
      type: "string",
      description: "admin user_id"
    }
  })
  static async delUser(ctx: Ctx): Promise<void> {
    const { user_id } = ctx.request.query;
    const user = await UserModel.findUserById(parseInt(user_id as string));
    if (user.user_id === 6) {
      await UserModel.delUser(parseInt(user_id as string));
      await UserInfoModel.delUserInfo(parseInt(user_id as string));
      ctx.success(null, "删除成功");
    } else {
      ctx.fail("无权限");
    }
  }


  @request("get", "/userInfo")
  @summary("查询用户详细信息")
  @middlewares([needLogin])
  static async getUserInfo(ctx: Ctx): Promise<void> {
    try {
      const userInfo = await UserInfoModel.findUserInfo(Number(ctx.query.user_id));
      ctx.success(userInfo, "删除成功");
    } catch (error) {
      ctx.fail("异常");
    }
  }

  @request("post", "/addUserAddress")
  @summary("添加收货地址 or 更新收货地址")
  @middlewares([needLogin])
  @body(UserAddress)
  static async addUserAddress(ctx: Ctx): Promise<void> {
    const {
      user_id,
      id,
      name,
      sex,
      phone,
      lng,
      lat,
      city,
      adname,
      address,
      addressName,
      addressDetail,
      tag,
    } = ctx.request.body;

    if (!name) { ctx.fail("收货人姓名不能为空"); return; }
    if (!phone) { ctx.fail("收货人手机号不能为空"); return; }
    if (!lng || !lat) { ctx.fail("用户定位失败"); return; }
    if (!city || !address || !addressName || !addressDetail) { ctx.fail("收货人地址不能为空"); return; }
    try {
      const userAddressInfo = {
        name,
        phone,
        sex,
        st_geohash: lat + "," + lng,
        city_name: city,
        area_name: adname,
        address_name: addressName,
        address,
        addressDetail,
        tag,
        tag_type: tag === "家" ? 1 : tag === "公司" ? 2 : 3
      };
      let userAddress;
      if (id) {
        userAddress = await UserAddressModel.updateUserAddress(Number(user_id), Number(id), userAddressInfo);
      } else {
        const id = await IdsModel.getIds("address_id");
        userAddress = new UserAddressModel(Object.assign(userAddressInfo, {
          id,
          user_id: Number(user_id),
        }));
        await userAddress.save();
      }
      ctx.success(userAddress, "修改成功");
    } catch (error) {
      ctx.fail("服务器异常");
      throw new Error(error);
    }
  }

  @request("get", "/delUserAddress")
  @summary("删除收货地址")
  @middlewares([needLogin])
  @query({
    id: { type: "number" }
  })
  static async delUserAddress(ctx: Ctx): Promise<void> {
    try {
      const { id, user_id } = ctx.request.query;
      if (!id) {
        ctx.fail("id不能位空");
        return;
      }
      const userAddress = await UserAddressModel.findUserAddressById(Number(id));
      if (!userAddress) { ctx.fail("用户地址不存在"); return; }
      if (userAddress.user_id !== Number(user_id)) { ctx.fail("非法操作"); return; }
      UserAddressModel.delUserAddress(Number(user_id), Number(id));
      ctx.success(null, "删除成功");
    } catch (error) {
      throw new Error(error);
    }
  }

  @request("get", "/getUserAddress")
  @summary("获取收货地址")
  @middlewares([needLogin])
  static async getUserAddress(ctx: Ctx): Promise<void> {
    const user_id = Number(ctx.request.query.user_id);
    try {
      const addresses = await UserAddressModel.findUserAddress(user_id);
      const data: any[] = [];
      addresses.forEach(item => {
        data.push({
          id: item.id,
          name: item.name,
          sex: item.sex,
          phone: item.phone,
          lng: item.st_geohash.split(",")[0],
          lat: item.st_geohash.split(",")[1],
          city: item.city_name,
          adname: item.area_name,
          address: item.address,
          addressDetail: item.addressDetail,
          addressName: item.address_name,
          tag: item.tag
        });
      });
      ctx.success(data, "查询成功");
    } catch (error) {
      ctx.fail("查询失败");
      throw new Error(error);
    }
  }

  @request("get", "/getUserAddressByTime")
  @summary("获取收货地址 外带到收货地址所需时间")
  @middlewares([needLogin])
  @query({
    from: { type: "string" }
  })
  static async getUserAddressByTime(ctx: Ctx): Promise<void> {
    const user_id = Number(ctx.request.query.user_id);
    const from = ctx.request.query.from;
    try {
      const addresses = await UserAddressModel.findUserAddress(user_id);
      const data: any[] = [];
      let to = "";
      addresses.forEach((item, index) => {
        to = index === (addresses.length - 1) ? to + item.st_geohash : to + item.st_geohash + ";";
      });
      const timeArr = await Address.getDistanceTime(from as string, to);
      addresses.forEach((item, index) => {
        data.push({
          id: item.id,
          name: item.name,
          sex: item.sex,
          phone: item.phone,
          lng: item.st_geohash.split(",")[0],
          lat: item.st_geohash.split(",")[1],
          city: item.city_name,
          adname: item.area_name,
          address: item.address,
          addressDetail: item.addressDetail,
          addressName: item.address_name,
          tag: item.tag,
          orderLeadTime: timeArr[index].order_lead_time
        });
      });
      ctx.success(data, "查询成功");
    } catch (error) {
      ctx.fail("查询失败");
      throw new Error(error);
    }
  }

}