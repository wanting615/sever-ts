import { body, request, summary } from "koa-swagger-decorator";
import fetch from "node-fetch";
import { WxInfo } from "./config";
import { WxUserModel, WxFeedBackModel} from "./model/wxUser-model";
import { WxDocModel }from "./model/wx-model";
import UntilService from "./until";

export default  class WxUser{
  @request("post","/wxLogin")
  @summary("微信小程序用户登录")
  @body({
    code: {
      type: "string",
      require: true
    }
  })
  async WxLogin(ctx: Ctx): Promise<void>{
    const code = ctx.request.body.code;
    if(!code){
      ctx.fail("code为空");
      return;
    }
    const url  = `https://api.weixin.qq.com/sns/jscode2session?appid=${WxInfo.appid}&secret=${WxInfo.appSecret}&js_code=${code}&grant_type=authorization_code`;
    const res = await fetch(url);
    const data = await res.json();
    if(data && data.openid){
      let  userData = await WxUserModel.findUser(data.openid);
      if(!userData){
        userData = new WxUserModel({
          openid: data.openid,
          session_key: data.session_key
        });
        await userData.save();
      }else{
        userData.session_key = data.session_key;
        await userData.save();
      }
      ctx.success({
        token: UntilService.createToken(data.openid),
        nickName: userData.nickName,
        avatarUrl: userData.avatarUrl,
        views: userData.views,
        praises: userData.praises
      },"登录成功");
    }
    return;
  }

  @request("post","/updateUserInfo")
  @body({
    token: {type: "string", require: true},
    nickName: {type: "string"},
    gender: {type: "number", require: false}, 
    avatarUrl: {type: "string"},
  })
  @summary("更新用户信息")
  async updateUserInfo(ctx: Ctx): Promise<void>{
    try {
      const { token, nickName, gender, avatarUrl} = ctx.request.body;
      if(!token){
        ctx.fail("用户不存在");
        return;
      }
      const userData = await WxUserModel.findUser(UntilService.verifywxToken(token));
      if(userData){
        await WxUserModel.updateUser(userData.openid, {
          openid: userData.openid,
          session_key: userData.session_key,
          nickName,
          gender: gender,
          avatarUrl
        });
        ctx.success({
          nickName: nickName,
          avatarUrl: avatarUrl
        },"更新成功");
      }else{
        ctx.fail("用户不存在");
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  @request("post","/getUserInfo")
  @body({
    token: {type: "string", require: true}
  })
  @summary("获取用户信息")
  async getUserInfo(ctx: Ctx): Promise<void>{
    try {
      const { token } = ctx.request.body;
      if(!token){
        ctx.fail("用户不存在");
        return;
      }
      const userData = await WxUserModel.findUser(UntilService.verifywxToken(token));
      if(userData){
        ctx.success({
          nickName: userData.nickName,
          avatarUrl: userData.avatarUrl,
          views: userData.views,
          praises: userData.praises
        }, "获取成功");
      }else{
        ctx.fail("用户不存在");
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  @request("get","/checkLogin")
  @summary("检测是否登录")
  async checkLogin(ctx: Ctx): Promise<void>{
    const { token } = ctx.request.query;
    if(!UntilService.verifywxToken(token as string)){ 
      ctx.fail("未登录");
      return;
    }
    ctx.success(null,"已登录");
  }

  @request("post", "/WxFeedBack")
  @summary("微信用户文档反馈")
  async WxFeedBack(ctx: Ctx): Promise<void>{
    const { token, docId, autor, info} = ctx.request.body;
    const openid = UntilService.verifywxToken(token);
    if(!openid){ 
      ctx.fail("用户暂未登录");
      return;
    }
    if(!info){
      ctx.fail("提交不能为空");
      return;
    }
    try {
      const feedbackData = await WxFeedBackModel.findFeedBack(openid);
      if(feedbackData){
        const date = new Date(feedbackData.creatAt);
        if(new Date().getTime() - date.getTime() < 60000){
          ctx.fail("请间隔一分钟后在发!");
          return;
        }
      }
      const doc = await WxDocModel.getWxInfoById(Number(docId));
      if(!doc){
        ctx.fail("文档不存在");
        return;
      }
      const data = new WxFeedBackModel({openid,docId,autor,info});
      await data.save();
      ctx.success(null,"提交成功");
    } catch (error) {
      
    }
  }

  @request("post", "/getViews")
  @summary("获取文档阅读历史记录")
  async getViews(ctx: Ctx): Promise<void> {
    const { token, page } = ctx.request.body;
    const openid = UntilService.verifywxToken(token as string);
    if(!openid){ 
      ctx.fail("未登录");
      return;
    }
    
    try {
      const userData =  await WxUserModel.findOne({openid});
      const docData = await WxUserModel.findOne({openid}).populate({
        path: "views",
        options: {
          limit: 10,
          skip: (page -1 ) * 10
        }
      });
      let history: unknown = [];
      if(docData){
        history = docData.views;
      }
      
      ctx.success({
        history,
        pages: userData.views ? Math.ceil(userData.views.length / 10) : 0
      }, "查询成功");
    } catch (error) {
      console.log(error);
      ctx.fail("查询失败");
    }    
  }
  @request("post", "/getPraised")
  @summary("获取点赞记录")
  async getPraised(ctx: Ctx): Promise<void> {
    const { token, page } = ctx.request.body;
    const openid = UntilService.verifywxToken(token as string);
    if(!openid){ 
      ctx.fail("未登录");
      return;
    }
    
    try {
      const userData =  await WxUserModel.findOne({openid});
      const docData = await WxUserModel.findOne({openid}).populate({
        path: "praises",
        options: {
          limit: 10,
          skip: (page -1 ) * 10,
          sort: {creatAt: -1}
        }
      });
      let history: unknown = [];
      if(docData){
        history = docData.praises;
      }
      ctx.success({
        history,
        pages: userData.praises ? Math.ceil(userData.praises.length / 10) : 0
      }, "查询成功");
    } catch (error) {
      ctx.fail("查询失败");
    }    
  }
}