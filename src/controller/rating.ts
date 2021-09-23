import { Context } from 'koa';
import { query, request, summary } from "koa-swagger-decorator";
import { RatingModel } from "../model/rating";

export default class RatingController {
  @request('get', '/rating/getFind')
  @summary('获取商店评价列表')
  @query({
    shopId: { type: 'number', require: true }
  })
  async getRatings(ctx: Context) {
    const shopId = ctx.query.shopId;
    const data = await RatingModel.getRatings(Number(shopId));
    ctx.body = {
      state: true,
      message: '查询成功',
      data
    }
  }

  @request('get', '/rating/scroes')
  @summary('查询评价分数')
  @query({
    shopId: { type: 'number', require: true }
  })
  async getScores(ctx: Context) {
    const shopId = ctx.query.shopId;
    const data = await RatingModel.getScores(Number(shopId));
    ctx.body = {
      state: true,
      message: '查询成功',
      data
    }
  }

  @request('get', '/rating/tags')
  @summary('查询评价分类')
  @query({
    shopId: { type: 'number', require: true }
  })
  async getTags(ctx: Context) {
    const shopId = ctx.query.shopId;
    const data = await RatingModel.getTags(Number(shopId));
    ctx.body = {
      state: true,
      message: '查询成功',
      data
    }
  }
}