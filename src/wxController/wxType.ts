import { request, summary, body, middlewares } from "koa-swagger-decorator";
import { WxTypeModel } from "./model/wx-model";
import { IdsModel } from "../model/ids";
import { needLogin } from "./middleware/needLogin";
import fs from "fs";
import path from "path";


//微信小程序添加知识文档
export default class WxController {
  @request("post", "/addWxtype")
  @summary("微信小程序添加文档类型")
  @body({
    name: {type: "string",require: true},
    contentTypes: {type: "string",require: true},
    iconUrl: {type: "string",require: true}
  })
  @middlewares([needLogin])
  async addWxtype(ctx: Ctx): Promise<void> {
    const { name, contentTypes, iconUrl } = ctx.request.body;
    
    if (!name) { ctx.fail("请输入文档类型"); return; }
    if (!contentTypes) { ctx.fail("请输入子文档类型"); return; }
    if (!iconUrl) { ctx.fail("请上传文档类型icon"); }
    try {
      const arr = (contentTypes as string).split(",");
      const id = await IdsModel.getIds("wx_type_id");
      const data = new WxTypeModel({
        id,
        type: id,
        name,
        iconUrl,
        contentTypes: arr
      });
      await data.save();
      ctx.success(data,"添加成功");
    } catch (error) {
      ctx.fail("添加失败");
    }
  }

  @request("get", "/getTypeList")
  @summary("获取所有文档类型")
  async getTypeList(ctx: Ctx): Promise<void> {
    try {
      const data = await WxTypeModel.getWxTypeAll();
      ctx.success(data,"");
    } catch (error) {
      console.log(error);
    }
  }

  @request("post", "/uploadTypeImg")
  @summary("上传文档类型图片")
  @middlewares([needLogin])
  async uploadTypeImg(ctx: Ctx): Promise<void> {
    try {
      const file = ctx.request.files.file; // 获取上传文件
      // 创建可读流
      if (Array.isArray(file)) { return; }
      const reader = fs.createReadStream(file.path);
      //assets/icons/
      const filePath = path.join(path.resolve(__dirname, ".."), "public/static/assets/icons/") + `${file.name}`;
      // 创建可写流
      const upStream = fs.createWriteStream(filePath);
      // 可读流通过管道写入可写流
      reader.pipe(upStream);
      ctx.body = {
        status: true,
        message: "文件上传成功",
        url: `assets/icons/${file.name}`,
      };

    } catch (error) {
      console.log(error);
      ctx.fail("上传异常");
    }
  }
}
