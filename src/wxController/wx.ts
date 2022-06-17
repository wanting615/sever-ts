import { Context } from "koa";
import { request, summary, body, query, middlewares } from "koa-swagger-decorator";
import { WxDocModel, WxTypeModel, WxDocData} from "./wx-model";
import { ContextRes} from "../types/result";
import { IdsModel } from "../model/ids";
import { sign } from "jsonwebtoken";
import UntilService from "./until";
import { needLogin } from "./middleware/needLogin"; 

//微信小程序添加知识文档
export default class WxController {

  @request("post", "/loginWx")
  @summary("微信小程序后台登陆")
  @body({
    username: {//文档类型
      type: "string",
      require: true
    },
    password: {//内容类型
      type: "string"
    }
  })
  async loginWx(ctx: ContextRes<string>): Promise<void>{
    const { username, password } = ctx.request.body;
    if (username !== "admin" || password !== "123456") {
      ctx.body = {
        message: "账户密码错误",
        status: false
      };
      return;
    }
    const token = sign({username, password}, UntilService.tokenConfig.privateKey, { expiresIn: "1d"});
    ctx.body = {
      message: "登陆成功",
      status: true,
      data: token
    };
  }

  // --------------获取用户信息----------
  @request("get","/userInfo")
  @summary("获取用户信息")
  @middlewares([needLogin])
  async getUserInfo(ctx: ContextRes): Promise<void> {
    ctx.body = {
      status: true,
      message: "获取用户信息成功"
    };
  }

  @request("post", "/addWxLearnInfo")
  @summary("微信小程序添加文档")
  @body({
    type: {//文档类型
      type: "number",
      require: true
    },
    contentType: {//内容类型
      type: "string"
    },
    title: {//标题
      type: "string",
      require: true
    },
    content: {//内容
      type: "string",
      require: true
    },
    autor: {//作者
      type: "string",
    }
  })
  @middlewares([needLogin])
  async addWxLearnInfo(ctx: ContextRes<WxDocData>): Promise<void> {
    const params = ctx.request.body;
    ctx.body = {
      status: false,
      message: "",
      data: null
    };

    if (!params.type && Number(params.type) !== 0) {
      ctx.body.message = "请输入文档类型"; return;
    }
    if (!params.title) { ctx.body.message = "请输入文档标题"; return; }
    if (!params.content) { ctx.body.message = "内容不能为空"; return; }

    const wxType = await WxTypeModel.getWxInfoByType(Number(params.type));
    if (!wxType) {
      ctx.body.message = "文档类型不存在"; return;
    }
   
    try {
      const id = await IdsModel.getIds("wx_id");
      const data = new WxDocModel({
        id,
        type: Number(params.type),
        typeName: wxType.name,
        contentType: params.contentType,
        title: params.title,
        content: params.content,
        autor: params.autor
      });
      await data.save();
      ctx.body.status = true;
      ctx.body.message = "上传成功";
      ctx.body.data = data;
    } catch (error) {
      console.log(error);
    }
  }

  @request("get", "/delDoc")
  @summary("删除某文档")
  @query({
    id: {
      type: "number",
      require: true
    }
  })
  @middlewares([needLogin])
  async delDoc(ctx: ContextRes): Promise<void> {
    const { id } = ctx.request.query;
   ctx.body = {
      status: false,
      message: "",
      data: null
    };
    if (!id) { ctx.body.message = "id不能为空"; return; }

    try {
      const data = await WxDocModel.getWxInfoById(Number(id));
      if (!data) { ctx.body.message = "该文档不存在"; return; }
      if (data) {
        data.disabled = 1;
        await data.save();
        ctx.body.status = true;
        ctx.body.message = "删除成功";
      }
    } catch (error) {
      console.log(error);
      ctx.body.message = "删除失败";
    }
  }

  @request("post", "/updateWxLearnInfo")
  @summary("微信小程序更新文档")
  @body({
    id: {
      type: "number",
      require: true
    },
    type: {//文档类型
      type: "number",
      require: true
    },
    contentType: {//内容类型
      type: "string"
    },
    title: {//标题
      type: "string",
      require: true
    },
    content: {//内容
      type: "string",
      require: true
    },
    autor: {//作者
      type: "string",
    }
  })
  @middlewares([needLogin])
  async updateWxLearnInfo(ctx: ContextRes<WxDocData>): Promise<void> {
    const params = ctx.request.body;
   ctx.body = {
      status: false,
      message: "",
      data: null
    };
    if (!params.type && Number(params.type) !== 0) { ctx.body.message = "请输入文档类型"; return; }
    const type = await WxTypeModel.getWxInfoByType(Number(params.type));
    if (!type) { ctx.body.message = "文档类型不存在"; return; }
    if (!params.title) { ctx.body.message = "请输入文档标题"; return; }
    if (!params.content) { ctx.body.message = "内容不能为空"; return; }

    try {
      const data = await WxDocModel.getWxInfoById(Number(params.id));
      if (!data) { ctx.body.message = "该文档不存在!"; }
      data.type = Number(params.type);
      data.typeName = type.name;
      data.contentType = params.contentType as string;
      data.title = params.title as string;
      data.content = params.content as string;
      data.autor = params.autor as string;
      await data.save();
      ctx.body.status = true;
      ctx.body.message = "更新成功";
      ctx.body.data = data;
    } catch (error) {
      console.log(error);
    }
  }

  @request("get", "/getDocByType")
  @summary("获取type类型的文档")
  @query({
    type: { type: "number", require: true },
    contentType: { type: "string", require: true },
    page: { type: "number", default: 1 },
  })
  async getDocByType(ctx: Context): Promise<void> {
    const { type, contentType, page } = ctx.request.query;
    try {
      const data = await WxDocModel.getDocByType(Number(type), contentType as string, Number(page));
      const pages = await WxDocModel.getDocNumByType(Number(type), contentType as string);
      ctx.body = {
        status: true,
        message: "",
        pages: Math.ceil(pages.length / 10),
        data
      };
    } catch (error) {
      console.log(error);
    }
  }

}
