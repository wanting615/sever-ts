import { Context } from "koa";
import { body, middlewares, prefix, query, request, summary } from "koa-swagger-decorator";
import { User, UserAddress, UserModel, UserInfoModel, UserAddressModel } from "../model/user";
import { IdsModel } from "../model/ids";
import RsaDecrypt from "../until/rsa";
import Address from "../until/address";
import { useFormatTime } from "../until/formater";
import { needLogin } from "../middleware/checkPermission";
import { Result } from "../types/result";

@prefix("/user")
export default class UserController {
  @request('post', '/login')
  @summary("登陆")
  @body(User)
  public static async login(ctx: Context): Promise<void> {
    const body = ctx.validatedBody;
    const result: Result = { message: '', status: false, data: null }
    if (!body.token) {
      result.message = '参数不能为空';
      ctx.body = result;
      return;
    }

    let paramsStr = RsaDecrypt.decrypt(body.token);
    if (!paramsStr) {
      result.message = '参数错误';
      ctx.body = result;
      return;
    }

    let { username, password } = RsaDecrypt.strParse(paramsStr);

    if (!username) {
      result.message = '请输入用户名';
      ctx.body = result;
      return;
    }
    if (!password) {
      result.message = '请输入密码';
      ctx.body = result;
      return;
    }

    const passwordMd5 = RsaDecrypt.encryption(password);
    try {
      const user = await UserModel.findUser(username);
      if (!user) { //不存在用户-直接注册
        const user_id = await IdsModel.getIds('user_id');
        //user表创建
        // UserModel.addUser(username, passwordMd5, user_id);
        const userDoc = new UserModel({
          username,
          user_id: user_id,
          password: passwordMd5
        })
        userDoc.save();
        //UserInfo表创建信息
        let city = "上海";
        try {
          const cityInfo: any = await Address.guessPosition(ctx);
          city = cityInfo.city;
        } catch (error) {
          console.log(error)
        }
        const registe_time = useFormatTime('YYYY-mm-dd HH:MM', new Date())
        // const userInfo = await UserModel.addUserInfo(user_id, user_id, username, city, registe_time);
        const doc = new UserInfoModel({
          id: user_id,
          user_id,
          username,
          city,
          registe_time
        })
        const userInfo = await doc.save();
        result.status = true;
        result.message = '注册成功';
        result.data = userInfo;
      } else if (user.password.toString() !== passwordMd5) {//密码不对
        result.message = '密码错误';
      } else {
        const userInfo = await UserInfoModel.findUserInfo(user.user_id);
        result.status = true;
        result.message = '登陆成功';
        result.data = userInfo;
      } ``
      ctx.body = result;
    } catch (error) {
      console.log(error)
    }
  }

  @request('get', '/delUser')
  @summary('删除用户')
  @middlewares([needLogin])
  @query({
    user_id: {
      type: 'string',
      description: 'admin user_id'
    }
  })
  static async delUser(ctx: Context) {
    const { user_id } = ctx.request.query
    const user = await UserModel.findUserById(parseInt(user_id as string));
    if (user.user_id === 6) {
      await UserModel.delUser(parseInt(user_id as string));
      await UserInfoModel.delUserInfo(parseInt(user_id as string));
      ctx.body = {
        status: true,
        message: '删除成功'
      }
    } else {
      ctx.body = {
        status: false,
        message: "无权限"
      }
    }
  }


  @request('get', '/userInfo')
  @summary('查询用户详细信息')
  @middlewares([needLogin])
  static async getUserInfo(ctx: any) {
    try {
      ctx.body = {
        status: false,
        data: null,
        message: ''
      }
      const userInfo = await UserInfoModel.findUserInfo(ctx.query.user_id);
      ctx.body.status = true;
      ctx.body.message = "查询成功";
      ctx.body.data = userInfo;
    } catch (error) {
      ctx.body.message = "异常";
    }
  }

  @request('post', '/addUserAddress')
  @summary('添加收货地址 or 更新收货地址')
  @middlewares([needLogin])
  @body(UserAddress)
  static async addUserAddress(ctx: Context) {
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
    const result: Result = {
      status: false,
      message: '',
      data: null
    };
    ctx.body = result;

    if (!name) { result.message = "收货人姓名不能为空"; return };
    if (!phone) { result.message = "收货人手机号不能为空"; return };
    if (!lng || !lat) { result.message = "用户定位失败"; return };
    if (!city || !address || !addressName || !addressDetail) { result.message = "收货人地址不能为空"; return };
    try {
      const userAddressInfo = {
        name,
        phone,
        sex,
        st_geohash: lat + ',' + lng,
        city_name: city,
        area_name: adname,
        address_name: addressName,
        address,
        addressDetail,
        tag,
        tag_type: tag === '家' ? 1 : tag === '公司' ? 2 : 3
      }
      let userAddress;
      if (id) {
        userAddress = await UserAddressModel.updateUserAddress(Number(user_id), Number(id), userAddressInfo);
      } else {
        const id = await IdsModel.getIds('address_id');
        userAddress = new UserAddressModel(Object.assign(userAddressInfo, {
          id,
          user_id: Number(user_id),
        }));
        await userAddress.save();
      }
      result.status = true;
      result.message = "修改成功";
      result.data = userAddress
    } catch (error) {
      result.message = '服务器异常';
      throw new Error(error)
    }
  }

  @request('get', "/delUserAddress")
  @summary('删除收货地址')
  @middlewares([needLogin])
  @query({
    id: { type: "number" }
  })
  static async delUserAddress(ctx: Context) {
    try {
      const { id, user_id } = ctx.request.query;
      const result: Result = ctx.body = {
        status: false,
        message: "",
        data: null
      }
      if (!id) {
        result.message = "id不能位空";
        return;
      }
      const userAddress = await UserAddressModel.findUserAddressById(Number(id));
      if (!userAddress) { result.message = "用户地址不存在"; return }
      if (userAddress.user_id !== Number(user_id)) { result.message = "非法操作"; return };
      UserAddressModel.delUserAddress(Number(user_id), Number(id));
      result.status = true;
      result.message = "删除成功";
    } catch (error) {
      throw new Error(error)
    }
  }

  @request('get', "/getUserAddress")
  @summary('获取收货地址')
  @middlewares([needLogin])
  static async getUserAddress(ctx: Context) {
    const user_id = Number(ctx.request.query.user_id);
    const result: Result = ctx.body = {
      status: false,
      message: "",
      data: null
    }
    try {
      const addresses = await UserAddressModel.findUserAddress(user_id);
      const data: any[] = [];
      addresses.forEach(item => {
        data.push({
          id: item.id,
          name: item.name,
          sex: item.sex,
          phone: item.phone,
          lng: item.st_geohash.split(',')[0],
          lat: item.st_geohash.split(',')[1],
          city: item.city_name,
          adname: item.area_name,
          address: item.address,
          addressDetail: item.addressDetail,
          addressName: item.address_name,
          tag: item.tag
        })
      })
      result.status = true;
      result.data = data;
    } catch (error) {
      result.message = "查询失败";
      throw new Error(error)
    }
  }

  @request('get', "/getUserAddressByTime")
  @summary('获取收货地址 外带到收货地址所需时间')
  @middlewares([needLogin])
  @query({
    from: { type: "string" }
  })
  static async getUserAddressByTime(ctx: Context) {
    const user_id = Number(ctx.request.query.user_id);
    const from = ctx.request.query.from;
    const result: Result = ctx.body = {
      status: false,
      message: "",
      data: null
    }
    try {
      const addresses = await UserAddressModel.findUserAddress(user_id);
      const data: any[] = [];
      let to = '';
      addresses.forEach((item, index) => {
        to = index === (addresses.length - 1) ? to + item.st_geohash : to + item.st_geohash + ";"
      })
      const timeArr = await Address.getDistanceTime(from as string, to);
      addresses.forEach((item, index) => {
        data.push({
          id: item.id,
          name: item.name,
          sex: item.sex,
          phone: item.phone,
          lng: item.st_geohash.split(',')[0],
          lat: item.st_geohash.split(',')[1],
          city: item.city_name,
          adname: item.area_name,
          address: item.address,
          addressDetail: item.addressDetail,
          addressName: item.address_name,
          tag: item.tag,
          orderLeadTime: timeArr[index].order_lead_time
        })
      })
      result.status = true;
      result.data = data;
    } catch (error) {
      result.message = "查询失败";
      throw new Error(error)
    }
  }

}