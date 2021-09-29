import { Context } from 'koa';
import { body, middlewares, query, request, summary } from "koa-swagger-decorator";
import { Result } from './../types/result.d';
import { FindModel } from "../model/find";
import { IdsModel } from "../model/ids";
import { ShopModel } from '../model/shop';
import { needLogin } from '../middleware/checkPermission';
import { UserInfoModel } from '../model/user';

export default class FindController {
  @request('post', '/addFind')
  @summary('添加发现')
  async addFind(ctx: Context) {
    const { shopId, vedioPath, tips } = ctx.request.body;
    const result: Result = ctx.body = {
      status: false,
      message: '',
      data: null
    }
    if (!shopId) { result.message = "请填写商店id"; return };
    try {
      const findResult = await FindModel.getFindByShopId(shopId);
      if (findResult && findResult.length > 0) {
        result.message = "已存在了哦";
        return
      }
      const id = await IdsModel.getIds('find_id');
      const data = new FindModel({
        id,
        shopId,
        vedioPath,
        tips
      })
      await data.save();
      result.status = true;
      result.message = "添加成功";
      result.data = data;
    } catch (error) {
      result.message = "服务器异常";
      console.log(error);
    }
  }

  @request('get', '/getFind')
  @summary('获取发现')
  public static async getFindAll(ctx: Context) {
    const { page = 1, limit = 10 } = ctx.request.query;
    try {
      console.log(FindModel)
      const results = await FindModel.getFinds(Number(page), Number(limit));
      for (let i = 0; i < results.length; i++) {
        const shop = await ShopModel.getShopById(results[i].shopId);
        results[i].shopInfo = {
          name: shop.name,
          image_path: shop.image_path,
          rating: shop.rating,
          activities: shop.activities,
          is_premium: shop.is_premium,
          order_lead_time: Math.floor(Math.random() * (11) + 30),
        }
      }
      ctx.body = {
        status: true,
        message: '查询成功',
        data: results
      }
    } catch (error) {
      ctx.body = {
        status: false,
        message: '失败',
        data: []
      }
      console.log(error)
    }
  }

  @request('post', '/replyFind')
  @summary('回复发现')
  @middlewares([needLogin])
  @body({
    user_id: { type: 'string', require: true },
    detail: { type: 'string', require: true },
    id: { type: 'string' }
  })
  async replyFind(ctx: Context) {
    const { user_id, detail, id } = ctx.request.body;
    const result: Result = ctx.body = {
      status: false,
      message: '',
      data: null
    }
    if (!id) { result.message = "回复id不能为空"; return }
    try {
      const userInfo = await UserInfoModel.findUserInfo(user_id);
      const findInfo = await FindModel.getFindById(Number(id));
      if (findInfo) {
        findInfo.replys++;
        findInfo.replaysDetails.push({
          replyId: findInfo.replys,
          username: userInfo.username,
          userId: user_id,
          userAvatar: userInfo.avatar,
          detail: detail,
        })
        findInfo.save()
        ctx.body = {
          status: true,
          message: '回复成功',
          data: findInfo.replaysDetails[findInfo.replaysDetails.length - 1]
        }
      } else {
        ctx.body = {
          status: true,
          message: '此条记录不存在',
        }
      }
    } catch (error) {
      result.message = "服务器异常";
      console.log(error);
    }
  }

  @request('get', '/findPraise')
  @summary('点赞')
  @middlewares([needLogin])
  @query({
    id: { type: 'string' }
  })
  async findPraise(ctx: Context) {
    const { id } = ctx.request.query;
    try {
      const find = await FindModel.getFindById(Number(id));
      if (find) {
        find.praises++;
        find.save();
        ctx.body = {
          status: true,
          message: '点赞成功',
        }
      } else {
        ctx.body = {
          status: false,
          message: '该记录不存在'
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
}