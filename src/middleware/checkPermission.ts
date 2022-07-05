import { UserModel } from "../model/user";
import RsaDecrypt from "./../until/rsa";

//登陆校验
export const needLogin = async (ctx: Ctx, next: () => Promise<undefined>): Promise<void> => {
  const token = ctx.header.access_token || ctx.query.token;
  if (!token) {
    ctx.fail("请登陆！");
    return;
  }
  const paramsStr = RsaDecrypt.decrypt(token as string);
  if (!paramsStr) {
    ctx.fail("token失效");
    return;
  }

  const params = RsaDecrypt.strParse(paramsStr);
  if (!params.username || !params.password) {
    ctx.fail("不合法的token");
    return;
  }

  const user = await UserModel.findUser(params.username);
  if (!user || user.password !== RsaDecrypt.encryption(params.password)) {
    ctx.fail("token已失效");
    return;
  }
  ctx.query.user_id = String(user.user_id);
  ctx.request.body.user_id = user.user_id;
  await next();
};