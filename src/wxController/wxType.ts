import { Context } from 'koa';
import { request, summary, body } from "koa-swagger-decorator";
import { WxTypeModel } from "./wx-model";
import { Result } from '../types/result';
import { IdsModel } from '../model/ids';

//微信小程序添加知识文档
export default class WxController {
  @request('post', '/addWxtype')
  @summary('微信小程序添加知识积累内容')
  @body({
    name: {//文档类型
      type: 'string',
      require: true
    },
    contentTypes: {
      type: 'string',
      require: true
    }
  })
  async addWxtype(ctx: Context) {
    const { name, contentTypes } = ctx.request.body;
    const result: Result = ctx.body = {
      status: false,
      message: '',
      data: null
    }
    if (!name) { result.message = "请输入文档类型"; return; }
    if (!contentTypes) { result.message = "请输入子文档类型"; return }
    try {
      const arr = contentTypes.split(",");
      const id = await IdsModel.getIds('wx_type_id');
      const data = new WxTypeModel({
        id,
        type: id,
        name,
        contentTypes: arr
      })
      await data.save();
      result.status = true;
      result.message = "添加成功";
      result.data = data;
    } catch (error) {
      console.log(error)
      result.message = "添加失败";
    }
  }

  @request('get', '/getTypeList')
  @summary('获取所有文档类型')
  async getTypeList(ctx: Context) {
    try {
      const data = await WxTypeModel.getWxTypeAll();
      ctx.body = {
        status: true,
        message: '',
        data
      }
    } catch (error) {
      console.log(error)
    }
  }
}
