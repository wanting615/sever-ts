import { Context } from 'koa';
import { request, summary, body } from "koa-swagger-decorator";
import { WxTypeModel } from "./wx-model";
import { Result } from '../types/result';
import { IdsModel } from '../model/ids';
import fs from 'fs';
import path from 'path';
import { localPath } from '../config/path';

//微信小程序添加知识文档
export default class WxController {
  @request('post', '/addWxtype')
  @summary('微信小程序添加文档类型')
  @body({
    name: {//文档类型
      type: 'string',
      require: true
    },
    contentTypes: {
      type: 'string',
      require: true
    },
    iconUrl: {
      type: 'string',
      require: true
    }
  })
  async addWxtype(ctx: Context) {
    const { name, contentTypes, iconUrl } = ctx.request.body;
    const result: Result = ctx.body = {
      status: false,
      message: '',
      data: null
    }
    if (!name) { result.message = "请输入文档类型"; return; }
    if (!contentTypes) { result.message = "请输入子文档类型"; return }
    if (!iconUrl) { result.message = "请上传文档类型icon" }
    try {
      const arr = contentTypes.split(",");
      const id = await IdsModel.getIds('wx_type_id');
      const data = new WxTypeModel({
        id,
        type: id,
        name,
        iconUrl,
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

  @request('post', "/uploadTypeImg")
  @summary("上传文档类型图片")
  async uploadTypeImg(ctx: Context) {
    try {
      const file = ctx.request.files.file; // 获取上传文件
      // 创建可读流
      if (Array.isArray(file)) { return };
      const reader = fs.createReadStream(file.path);
      //assets/icons/
      const filePath = path.join(path.resolve(__dirname, ".."), 'public/static/assets/icons/') + `${file.name}`;
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
      console.log(error)
      ctx.body = {
        status: false,
        message: "上传异常",
      };
    }
  }
}
