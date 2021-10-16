import { Context } from 'koa';
import { request, summary, body } from "koa-swagger-decorator";
import { WxClassModel } from "./wx-model";
import { Result } from '../types/result';
import { IdsModel } from '../model/ids';

//微信小程序添加知识文档
export default class WxController {
  @request('post', '/loginWx')
  @summary('微信小程序后台登陆')
  @body({
    username: {//文档类型
      type: 'string',
      require: true
    },
    password: {//内容类型
      type: 'string'
    }
  })
  async loginWx(ctx: Context) {
    const { username, password } = ctx.request.body;
    if (username !== 'admin' || password !== '123456') {
      ctx.body = {
        message: '账户密码错误',
        status: false
      }
      return;
    }
    ctx.body = {
      message: '登陆成功',
      status: true,
      data: username + '&' + password
    }
  }

  @request('post', '/addWxLearnInfo')
  @summary('微信小程序添加知识积累内容')
  @body({
    type: {//文档类型
      type: 'string',
      require: true
    },
    contentType: {//内容类型
      type: 'string'
    },
    title: {//标题
      type: 'number',
      require: true
    },
    content: {//内容
      type: 'string',
      require: true
    },
    autor: {//内容
      type: 'string',
    }
  })
  async addWxLearnInfo(ctx: Context) {
    const docType = "html|css|typescript|javascript|network|vue|react"
    const params = ctx.request.body;
    const result: Result = ctx.body = {
      status: false,
      message: '',
      data: null
    }

    if (!params.type) { result.message = "请输入文档类型"; return; }
    if (!params.title) { result.message = "请输入文档标题"; return }
    if (!params.content) { result.message = "内容不能为空"; return }

    if (docType.indexOf(params.type) === -1) {
      params.type = "other";
    }
    try {
      const id = await IdsModel.getIds('wx_id');
      const data = new WxClassModel({
        id,
        type: params.type,
        contentType: params.contentType,
        title: Number(params.title),
        content: params.content,
        autor: params.autor
      })
      await data.save();
      result.status = true;
      result.message = "上传成功";
      result.data = data;
    } catch (error) {
      console.log(error)
    }
  }

}
