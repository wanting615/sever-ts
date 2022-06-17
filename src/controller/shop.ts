import { ContextRes } from "./../types/result";
import { request, summary, path } from "koa-swagger-decorator";
import { Filter, SortWay } from "../types/shop";
import { CategoryModel } from "../model/category";
import { ShopMenuModel, ShopModel, Shops, ShopDataType, ShopMenuDataType} from "../model/shop";
import Address from "../until/address";

export default class ShopController {
  @request("get", "/shops/list")
  @summary("查询商店列表")
  public static async getShopList(ctx: ContextRes<ShopDataType[]>): Promise<void> {
    const {
      latitude,//纬度
      longitude,//经度
      page = 1,//当前页
      limit = 10,//取多少条
      // keyword,
      categoryId,//商店分类
      orderBy = 2,//排序方式
      // extras,
      delivery_mode = [],//筛选配送方式
      support_ids = [], //筛选支持的商家属性
    } = ctx.request.query;
    ctx.body = {
      status: false,
      message: "",
      data: null
    };
    if (!latitude || !longitude) {//经纬度未传 return
      ctx.body.message = "latitude,longitude不能为空";
      return;
    }
    const filter: Filter = {}; //过滤集合
    const sortWay: SortWay = {};
    if (Number(orderBy)) { //排序
      switch (Number(orderBy)) {
        case 1://智能排序
          sortWay.float_minimum_order_amount = 1;
          break;
        case 2://距离最近
          filter.location = {
            $near: [Number(longitude), Number(latitude)]
          };
          break;
        case 3://销量最好
          sortWay.recent_order_num = -1;
          break;
        case 4: //起送价最低
          sortWay.float_minimum_order_amount = -1;
          break;
        case 5://配送最快
          filter.location = {
            $near: [Number(longitude), Number(latitude)]
          };
          break;
        case 6://评分最高
          sortWay.rating = -1;
          break;
      }
    }
    if (Array.isArray(delivery_mode)) { //配送方式筛选
      delivery_mode.forEach((item: string) => {
        filter["delivery_mode.id"] = Number(item);
      });
    }

    if (Array.isArray(support_ids)) {//商家属性
      const filterArr: number[] = [];
      support_ids.forEach(item => {
        if (Number(item) && (Number(item) !== 8)) {
          filterArr.push(Number(item));
        } else if (Number(item) == 8) { //品牌保证特殊处理
          filter.is_premium = true;
        }
      });

      if (filterArr.length) {
        //匹配同时拥有多种活动的数据
        filter["supports.id"] = { $all: filterArr };
      }

    }

    if (categoryId && Number(categoryId)) {//查早对应商店分类名称
      const category = await CategoryModel.getCategoryById(Number(categoryId));
      if (category.length > 0) {
        Object.assign(filter, { category: category[0].name });
      }
    }

    const shopslist = await ShopModel.getShops(filter, sortWay, Number(page), Number(limit));

    //测量距离
    const from = latitude + "," + longitude;

    let to = "";
    shopslist.forEach((item: Shops, index: number) => {
      const slpitStr = (index == shopslist.length - 1) ? "" : ";";
      to += item.latitude + "," + item.longitude + slpitStr;
    });


    try {
      if (shopslist.length) {
        const distance_duration: any = await Address.getDistance(from, to);
        shopslist.map((item, index) => {
          return Object.assign(item, distance_duration[index]);
        });
      }
    } catch (error) {
      // qq地图达到上限后会导致加车失败，需优化
      console.log("从addressComoponent获取测距数据失败", error);
      shopslist.map((item) => {
        return Object.assign(item, { distance: "10公里", order_lead_time: "40分钟" });
      });
    }
    ctx.body.status = true;
    ctx.body.message = "查询成功";
    ctx.body.data = shopslist;

  }

  @request("get", "/shop/{shopId}")
  @summary("获取商店详情")
  @path({ shopId: { type: "number", required: true } })
  public static async getShopById(ctx:  ContextRes<ShopDataType>): Promise<void>{
    const { shopId } = ctx.validatedParams;
    ctx.body = {
      status: false,
      message: "",
      data: null
    };
    if (!shopId || !Number(shopId)) {
      ctx.body.message = "餐馆id参数错误";
      return;
    }

    try {
      const data = await ShopModel.getShopById(shopId);
      ctx.body.status = true;
      ctx.body.message = "查询成功";
      ctx.body.data = data;
    } catch (error) {
      console.log(error);
      ctx.body.message = "获取餐馆详情失败";
    }
  }

  @request("get", "/shopMenu/{shopId}")
  @summary("获取餐馆食品menu")
  @path({ shopId: { type: "number", required: true } })
  public static async getShopMenu(ctx: ContextRes<ShopMenuDataType[]>): Promise<void>{
    const { shopId } = ctx.validatedParams;
    ctx.body = {
      status: false,
      message: "",
      data: null
    };
    if (!shopId || !Number(shopId)) {
      ctx.body.message = "餐馆id参数错误";
      return;
    }

    try {
      const data = await ShopMenuModel.getShopMenu(shopId);
      ctx.body.status = true;
      ctx.body.data = data;
      return;
    } catch (error) {
      console.log(error);
      ctx.body.message = "获取餐馆食品menu失败";
    }
  }
}