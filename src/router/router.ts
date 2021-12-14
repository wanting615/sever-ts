import { SwaggerRouter } from "koa-swagger-decorator";
import path from "path";

const router = new SwaggerRouter();

router.swagger({
  title: "elm-server",
  description: "server api",
  version: "1.0.0"
});

router.mapDir(path.resolve(__dirname, "../controller"));
router.mapDir(path.resolve(__dirname, "../wxController"));
export { router };

// import Koa from "koa";
// import KoaRouter from "koa-router";

// export function initRoutes(app: Koa<Koa.DefaultState, Koa.DefaultContext>, router:  KoaRouter<any, {}>){

// }