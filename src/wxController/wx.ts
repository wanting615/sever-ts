import { Context } from 'koa';
import { request, summary, body, query } from "koa-swagger-decorator";
import { WxClassModel, WxTypeModel } from "./wx-model";
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
  @summary('微信小程序添加文档')
  @body({
    type: {//文档类型
      type: 'number',
      require: true
    },
    contentType: {//内容类型
      type: 'string'
    },
    title: {//标题
      type: 'string',
      require: true
    },
    content: {//内容
      type: 'string',
      require: true
    },
    autor: {//作者
      type: 'string',
    }
  })
  async addWxLearnInfo(ctx: Context) {
    const params = ctx.request.body;
    const result: Result = ctx.body = {
      status: false,
      message: '',
      data: null
    }

    if (!params.type && Number(params.type) !== 0) {
      result.message = "请输入文档类型"; return;
    }
    const type = await WxTypeModel.getWxInfoByType(Number(params.type));
    if (!type) {
      result.message = "文档类型不存在"; return;
    }

    if (!params.title) { result.message = "请输入文档标题"; return }
    if (!params.content) { result.message = "内容不能为空"; return }
    try {
      const id = await IdsModel.getIds('wx_id');
      const data = new WxClassModel({
        id,
        type: Number(params.type),
        typeName: type.name,
        contentType: params.contentType,
        title: params.title,
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

  @request('get', "/delDoc")
  @summary("删除某文档")
  @query({
    id: {
      type: 'number',
      require: true
    }
  })
  async delDoc(ctx: Context) {
    const { id } = ctx.request.query;
    const result: Result = ctx.body = {
      status: false,
      message: '',
      data: null
    }
    if (!id) { result.message = "id不能为空"; return; }

    try {
      const data = await WxClassModel.getWxInfoById(Number(id));
      if (!data) { result.message = '该文档不存在'; return }
      if (data) {
        data.remove();
        result.status = true;
        result.message = "删除成功";
      }
    } catch (error) {
      console.log(error);
      result.message = "删除失败";
    }
  }

  @request('post', '/updateWxLearnInfo')
  @summary('微信小程序更新文档')
  @body({
    id: {
      type: 'number',
      require: true
    },
    type: {//文档类型
      type: 'number',
      require: true
    },
    contentType: {//内容类型
      type: 'string'
    },
    title: {//标题
      type: 'string',
      require: true
    },
    content: {//内容
      type: 'string',
      require: true
    },
    autor: {//作者
      type: 'string',
    }
  })
  async updateWxLearnInfo(ctx: Context) {
    const params = ctx.request.body;
    const result: Result = ctx.body = {
      status: false,
      message: '',
      data: null
    }

    if (!params.type && Number(params.type) !== 0) { result.message = "请输入文档类型"; return; }
    const type = await WxTypeModel.getWxInfoByType(Number(params.type));
    if (!type) { result.message = "文档类型不存在"; return; }
    if (!params.title) { result.message = "请输入文档标题"; return }
    if (!params.content) { result.message = "内容不能为空"; return }

    try {
      const data = await WxClassModel.getWxInfoById(Number(params.id));
      if (!data) { result.message = "该文档不存在!" };
      data.type = Number(params.type);
      data.typeName = type.name;
      data.contentType = params.contentType;
      data.title = params.title;
      data.content = params.content;
      data.autor = params.autor;
      await data.save();
      result.status = true;
      result.message = "更新成功";
      result.data = data;
    } catch (error) {
      console.log(error)
    }
  }

  @request('get', "/getDocByType")
  @summary('获取type类型的文档')
  @query({
    type: { type: 'number', require: true },
    contentType: { type: 'string', require: true },
    page: { type: "number", default: 1 },
  })
  async getDocByType(ctx: Context) {
    const { type, contentType, page } = ctx.request.query;
    try {
      const data = await WxClassModel.getDocByType(Number(type), contentType as string, Number(page));
      const pages = await WxClassModel.getDocNumByType(Number(type), contentType as string);
      ctx.body = {
        status: true,
        message: '',
        pages: Math.ceil(pages.length / 10),
        data
      }
    } catch (error) {
      console.log(error)
    }
  }

}
