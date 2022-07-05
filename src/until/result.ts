import { Context } from "koa";

function routerResponse(){
  return async function(ctx: Context, next: () => Promise<void>): Promise<void>{
    ctx.success = function<T>(data: T, msg: string){
      ctx.body = {
        status: true,
        message: msg,
        data: data
      };
    };
    ctx.fail = function(msg: string){
      ctx.body = {
        status: false,
        message: msg
      };
    };
    await next();
  };
}

export default routerResponse;