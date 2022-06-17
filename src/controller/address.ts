import { Context, query, request, summary } from "koa-swagger-decorator";
import Address from "../until/address";

export default class AddressController {
  @request("get", "/posstion")
  @summary("通过经纬度获取本地精确地址")
  @query({
    latitude: { type: "string", required: true },
    longitude: { type: "string", required: true }
  })
  static async getLocationAddress(ctx: Context): Promise<void>{
    const { latitude, longitude } = ctx.request.query;
    if (latitude && longitude) {
      try {
        const result = await Address.getpois(latitude as string, longitude as string);
        ctx.body = {
          state: true,
          msg: "查询成功",
          address: result.result.address,
          city: result.result.address_component.province,
          latitude: latitude,
          longitude: longitude,
          name: result.result.formatted_addresses.recommend,
        };
      } catch (error) {
        ctx.body = {
          state: false,
          message: "获取地址失败"
        };
      }
    } else {
      ctx.body = {
        state: false,
        message: "参数错误"
      };
    }
  }

  @request("get", "/posstionByIp")
  @summary("通过ip获取本地精确地址")
  static async getLocationByIp(ctx: Context): Promise<void> {
    try {
      const result = await Address.guessPosition(ctx.request);
      ctx.body = {
        state: true,
        msg: "获取地址成功",
        data: result
      };
    } catch (error) {
      ctx.body = {
        state: false,
        message: "获取地址失败"
      };
    }
  }

  @request("get", "/getDistanceTime")
  @summary("通过经纬度获取本地精确地址")
  @query({
    from: { type: "string", required: true },
    to: { type: "string", required: true }
  })
  static async getDistanceTime(ctx: Context): Promise<void> {
    const { from, to } = ctx.request.query;
    if (!from || !to) {
      ctx.body = {
        status: false,
        message: "起始位置和终点位置不能为空"
      };
      return;
    }
    try {
      const time = await Address.getDistance(from as string, to as string, "tiemvalue");
      ctx.body = {
        status: true,
        message: "测量到达时间成功",
        data: time
      };
    } catch (error) {
      ctx.body = {
        status: true,
        message: "测量到达时间失败,重置默认时间",
        data: 2000
      };
    }
  }

}