import { query, request, summary, middlewaresAll } from "koa-swagger-decorator";
import { needLogin } from "../middleware/checkPermission";
import { IdsModel } from "../model/ids";
import { HongbaoModel } from "../model/hongbao";
import { UserInfoModel } from "../model/user";
import { GetDateStr, useFormatTime } from "../until/formater";

@middlewaresAll([needLogin])
export default class HongbaoController {
  @request("get", "/getHongbaos")
  @summary("获取用户红包")
  @query({
    status: { type: "number", require: true }
  })
  async getRatings(ctx: Ctx): Promise<void>{
    const params = ctx.request.query;
    if (params.status === undefined) {ctx.fail("status不能为空");return;}
    try {
      const data = await HongbaoModel.getHongbaos(Number(params.user_id), Number(params.status));
      ctx.success(data, "获取红包成功");
    } catch (error) {
      console.log(error);
      ctx.fail("获取红包失败");
    }
  }

  @request("get", "/sendHongbaoKey")
  @summary("兑换红包")
  async sendHongbaoKey(ctx: Ctx):Promise<void> {
    const user_id = ctx.request.query.user_id;
    const id = await IdsModel.getIds("hongbao_id");
    try {
      const user = await UserInfoModel.findUserInfo(Number(user_id));
      const sum = Math.floor(Math.random() * 10 + 1) * 5;

      const data = new HongbaoModel({
        id,
        user_id,
        sn: new Date(),
        amount: Math.floor(Math.random() * 10 + 1),
        sum_condition: sum,
        name: "分享红包",
        phone: user.mobile,
        begin_date: useFormatTime("YYYY-mm-dd", new Date()),
        end_date: GetDateStr(new Date(), 3),
        description_map: {
          phone: "限收货手机号为" + user.mobile ? user.mobile : "任意手机号",
          online_paid_only: "限在线支付使用",
          validity_periods: GetDateStr(new Date(), 3) + "到期",
          sum_condition: "满" + sum + "元可用",
        },
        status: 0,
        present_status: 1,
        share_status: 1
      });
      ctx.success(data, "兑换成功");
    } catch (error) {
      ctx.fail("兑换失败");
    }
  }
}