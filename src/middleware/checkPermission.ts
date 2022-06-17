import { ContextRes } from "./../types/result";
import { UserModel } from "../model/user";
import RsaDecrypt from "./../until/rsa";

interface Result {
  status: boolean;
  message: string
}
//登陆校验
export const needLogin = async (ctx: ContextRes, next: () => Promise<undefined>): Promise<void> => {
  ctx.body = {
    status: false,
    message: ""
  };
  const token = ctx.header.access_token || ctx.query.token;
  if (!token) {
    ctx.body.message = "请登陆！";
    return;
  }
  const paramsStr = RsaDecrypt.decrypt(token as string);
  if (!paramsStr) {
    ctx.body.message = "token失效";
    return;
  }

  const params = RsaDecrypt.strParse(paramsStr);
  if (!params.username || !params.password) {
    ctx.body.message = "不合法的token";
    return;
  }

  const user = await UserModel.findUser(params.username);
  if (!user || user.password !== RsaDecrypt.encryption(params.password)) {
    ctx.body.message = "token已失效";
    return;
  }
  ctx.query.user_id = String(user.user_id);
  ctx.request.body.user_id = user.user_id;
  await next();
};