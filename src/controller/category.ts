import { Context } from "koa";
import { request, summary } from "koa-swagger-decorator";
import { SubCategories } from "../model/public";
import { Category, CategoryModel, IndexEntryModel } from "../model/category";

export default class CategoryController {
  @request("get", "/category/list")
  @summary("获取所有商店分类类别")
  static async getAllGategories(ctx: Context) {
    try {
      const gategories = await CategoryModel.getAllGategorys();
      const data: SubCategories[] = [];
      let shopCount = 0;
      gategories.forEach((el: Category) => {
        data.concat(el.sub_categories);
        shopCount += el.count;
      });
      ctx.body = {
        status: true,
        count: shopCount,
        list: data
      };

    } catch (error) {
      console.log(error);
      ctx.body = {
        status: false,
        message: "查询失败"
      };
    }
  }

  @request("get", "/shopsClassify")
  @summary("获取首页分类")
  static async getIndexEntrys(ctx: Context) {
    try {
      const data: any = await IndexEntryModel.getIndexEntrys();
      ctx.body = {
        status: true,
        msg: "查询成功",
        data
      };

    } catch (error) {
      ctx.body = {
        status: false,
        message: "查询失败"
      };
      throw new Error("查询失败");
    }
  }

}