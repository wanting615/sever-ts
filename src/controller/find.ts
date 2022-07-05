import { body, middlewares, query, request, summary } from "koa-swagger-decorator";
import { FindModel, ReplaysDetail } from "../model/finds";
import { IdsModel } from "../model/ids";
import { ShopModel } from "../model/shop";
import { needLogin } from "../middleware/checkPermission";
import { UserInfoModel } from "../model/user";

export default class FindController {
  @request("post", "/addFind")
  @summary("添加发现")
  async addFind(ctx: Ctx): Promise<void> {
    const { shopId, vedioPath, tips } = ctx.request.body;
    if (!shopId) { ctx.fail("请填写商店id") ; return; }
    try {
      const findResult = await FindModel.getFindByShopId(Number(shopId));
      if (findResult && findResult.length > 0) {
        ctx.fail("已存在了哦");
        return;
      }
      const id = await IdsModel.getIds("find_id");
      const data = new FindModel({
        id,
        shopId,
        vedioPath,
        tips
      });
      await data.save();
      ctx.success(data,"添加成功");
    } catch (error) {
      ctx.fail("服务器异常");
      console.log(error);
    }
  }

  @request("get", "/getFind")
  @summary("获取发现")
  public static async getFindAll(ctx: Ctx): Promise<void> {
    const { page = 1, limit = 10 } = ctx.request.query;
    try {
      console.log(FindModel);
      const results = await FindModel.getFinds(Number(page), Number(limit));
      for (let i = 0; i < results.length; i++) {
        const shop = await ShopModel.getShopById(results[i].shopId);
        if (shop) {
          results[i].shopInfo = {
            name: shop.name,
            image_path: shop.image_path,
            rating: shop.rating,
            activities: shop.activities,
            is_premium: shop.is_premium,
            order_lead_time: Math.floor(Math.random() * (11) + 30),
          };
        }
      }
      ctx.success(results,"查询成功");
    } catch (error) {
      ctx.body = {
        status: false,
        message: "失败",
        data: []
      };
      console.log(error);
    }
  }

  @request("post", "/replyFind")
  @summary("回复发现")
  @middlewares([needLogin])
  @body({
    user_id: { type: "string", require: true },
    detail: { type: "string", require: true },
    id: { type: "string" }
  })
  async replyFind(ctx: Ctx): Promise<void> {
    const { user_id, detail, id } = ctx.request.body;
    if (!id) { ctx.fail("回复id不能为空");return; }
    try {
      const userInfo = await UserInfoModel.findUserInfo(Number(user_id));
      const findInfo = await FindModel.getFindById(Number(id));
      if (findInfo) {
        findInfo.replys++;
        findInfo.replaysDetails.push({
          replyId: findInfo.replys,
          username: userInfo.username,
          userId: Number(user_id),
          userAvatar: userInfo.avatar,
          detail: detail as string,
        });
        findInfo.save();
        ctx.success(findInfo.replaysDetails[findInfo.replaysDetails.length - 1],"回复成功");
      } else {
        ctx.fail("此条记录不存在");
      }
    } catch (error) {
      ctx.fail("服务器异常");
      console.log(error);
    }
  }

  @request("get", "/findPraise")
  @summary("点赞")
  @middlewares([needLogin])
  @query({
    id: { type: "string" }
  })
  async findPraise(ctx: Ctx): Promise<void> {
    const { id } = ctx.request.query;
    try {
      const find = await FindModel.getFindById(Number(id));
      if (find) {
        find.praises++;
        find.save();
        ctx.success(null, "点赞成功");
      } else {
        ctx.fail("该记录不存在");
      }
    } catch (error) {
      console.log(error);
    }
  }
}