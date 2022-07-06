import UntilService from "../until";
export const needLogin = async (ctx: Ctx, next: () => Promise<undefined>): Promise<void>=> {
  const token = ctx.get("ACCESS_TOKEN"); 
  if(!token){
    ctx.body = {
      status: false,
      message: "未登录无权操作"
    };
  }else{
    // 验证token
    if(UntilService.verifyToken(token)){
      await next();
    }else{
      ctx.body = {
        status: false,
        message: "用户名和密码错误"
      };
    }
  }
  
};