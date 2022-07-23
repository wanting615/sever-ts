import { request, summary, body, query, middlewares } from "koa-swagger-decorator";
import { WxDocModel, WxTypeModel} from "./model/wx-model";
import { WxUserModel } from "./model/wxUser-model";
import { IdsModel } from "../model/ids";
import { sign } from "jsonwebtoken";
import UntilService from "./until";
import { needLogin } from "./middleware/needLogin";

//微信小程序添加知识文档
export default class WxController {

  @request("post", "/loginWx")
  @summary("微信小程序后台登陆")
  @body({
    username: {type: "string",require: true},
    password: {type: "string"}
  })
  async loginWx(ctx: Ctx): Promise<void>{
    const { username, password } = ctx.request.body;
    if (username !== "admin" || password !== "123456") {
      ctx.fail("账户密码错误");
      return;
    }
    const token = sign({username, password}, UntilService.tokenConfig.privateKey, { expiresIn: "1d"});
    ctx.success(token,"登陆成功");
  }

  // --------------获取用户信息----------
  @request("get","/userInfo")
  @summary("获取用户信息")
  @middlewares([needLogin])
  async getUserInfo(ctx: Ctx): Promise<void> {
    ctx.body = {
      status: true,
      message: "获取用户信息成功"
    };
  }

  @request("post", "/addWxLearnInfo")
  @summary("微信小程序添加文档")
  @body(
    {type: {type: "number",require: true},//文档类型
    contentType: {type: "string"},//内容类型
    title: {type: "string",require: true},//标题
    content: {type: "string",require: true},//内容
    autor: {type: "string",}//作者
  })
  @middlewares([needLogin])
  async addWxLearnInfo(ctx: Ctx): Promise<void> {
    const params = ctx.request.body;
    if (!params.type && Number(params.type) !== 0) {
      ctx.fail("请输入文档类型"); return;
    }
    if (!params.title) { ctx.fail("请输入文档标题"); return; }
    if (!params.content) { ctx.fail("内容不能为空"); return; }

    const wxType = await WxTypeModel.getWxInfoByType(Number(params.type));
    if (!wxType) {
      ctx.fail("文档类型不存在"); return;
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
        autor: params.autor,
        creatAt: new Date()
      });
      await data.save();
      ctx.success(data,"上传成功");
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
  async delDoc(ctx: Ctx): Promise<void> {
    const { id } = ctx.request.query;
    if (!id) { ctx.fail("id不能为空"); return; }

    try {
      const data = await WxDocModel.getWxInfoById(Number(id));
      if (!data) { ctx.fail("该文档不存在"); return; }
      if (data) {
        data.disabled = 1;
        await data.save();
        ctx.success(data,"删除成功");
      }
    } catch (error) {
      console.log(error);
      ctx.fail("删除失败");
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
  async updateWxLearnInfo(ctx: Ctx): Promise<void> {
    const params = ctx.request.body;
    if (!params.type && Number(params.type) !== 0) { ctx.fail("请输入文档类型"); return; }
    const type = await WxTypeModel.getWxInfoByType(Number(params.type));
    if (!type) { ctx.fail("文档类型不存在"); return; }
    if (!params.title) { ctx.fail("请输入文档标题"); return; }
    if (!params.content) { ctx.fail("内容不能为空"); return; }

    try {
      const data = await WxDocModel.getWxInfoById(Number(params.id));
      if (!data) { ctx.fail("该文档不存在"); return;}
      data.type = Number(params.type);
      data.typeName = type.name;
      data.contentType = params.contentType as string;
      data.title = params.title as string;
      data.content = params.content as string;
      data.autor = params.autor as string;
      await data.save();
      ctx.success(data,"更新成功");
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
  async getDocByType(ctx: Ctx): Promise<void> {
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

  @request("get", "/getReadDoc")
  @summary("阅读量")
  @query({id: {type: "number",require: true}, token: {type: "string"}})
  async getReadDoc(ctx: Ctx): Promise<void>{
    try {
      const { token, id } = ctx.request.query;
      const data = await WxDocModel.getWxInfoById(Number(id));
      const user = await WxUserModel.findUser(UntilService.verifywxToken(token as string));
      if(!data || !user){ ctx.fail("用户未登录"); return; }
      const views = user.views || [];
      if(views.includes(data._id)){ ctx.fail("用户已阅读"); return; }
      if(data.views) { 
        data.views++;
      }else{
        data.views = 1;
      }
      if(views.length >= 50){ views.pop();} // 最多存储50条
      views.unshift(data._id);
      user.views = views;
      await user.save();
      await data.save();
      ctx.success(null, "");
    } catch (error) {
      
    }
  }

  @request("get", "/getPraises")
  @summary("阅读量")
  @query({id: {type: "number",require: true}, token: {type: "string"}})
  async getPraises(ctx: Ctx): Promise<void>{
    try {
      const { token, id } = ctx.request.query;
      if(!token || !id){ ctx.fail("token和id不能为空"); return; }
      const data = await WxDocModel.getWxInfoById(Number(id));
      const user = await WxUserModel.findUser(UntilService.verifywxToken(token as string));
      if(!data || !user){ ctx.fail("用户未登录"); return; }
      const praises = user.praises || [];
      if(praises.includes(data._id)){ ctx.fail("用户已阅读"); return; }
      if(data.praises) { 
        data.praises++;
      }else{
        data.praises = 1;
      }
      if(praises.length >= 50){ praises.pop();} // 最多存储50条
      praises.unshift(data._id);
      user.praises = praises;
      await user.save();
      await data.save();
      ctx.success(null, "");
    } catch (error) {
      
    }
  }

  @request("get","/getNewsDoc")
  @summary("获取最新文档")
  @query({page: {type: "number"}})
  async getNewsDoc(ctx: Ctx): Promise<void> {
    try{
      const { page } = ctx.request.query;
      const data = await WxDocModel.getDocByTime(Number(page));
      ctx.success(data,"查询成功");
    }catch(error){
      ctx.fail("查询失败");
    }
  }
}
