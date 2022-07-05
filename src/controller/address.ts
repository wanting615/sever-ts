import { query, request, summary } from "koa-swagger-decorator";
import Address from "../until/address";

export default class AddressController {
  @request("get", "/posstion")
  @summary("通过经纬度获取本地精确地址")
  @query({
    latitude: { type: "string", required: true },
    longitude: { type: "string", required: true }
  })
  static async getLocationAddress(ctx: Ctx): Promise<void>{
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
        ctx.fail("获取地址失败");
      }
    } else {
      ctx.fail("参数错误");
    }
  }

  @request("get", "/posstionByIp")
  @summary("通过ip获取本地精确地址")
  static async getLocationByIp(ctx: Ctx): Promise<void> {
    try {
      const result = await Address.guessPosition(ctx.request);
      ctx.success(result,"获取地址成功");
    } catch (error) {
      ctx.fail("获取地址失败");
    }
  }

  @request("get", "/getDistanceTime")
  @summary("通过经纬度获取本地精确地址")
  @query({
    from: { type: "string", required: true },
    to: { type: "string", required: true }
  })
  static async getDistanceTime(ctx: Ctx): Promise<void> {
    const { from, to } = ctx.request.query;
    if (!from || !to) {
      ctx.fail("起始位置和终点位置不能为空");
      return;
    }
    try {
      const time = await Address.getDistance(from as string, to as string, "tiemvalue");
      ctx.success(time,"测量到达时间成功");
    } catch (error) {
      ctx.success(2000,"测量到达时间失败,重置默认时间");
    }
  }

}