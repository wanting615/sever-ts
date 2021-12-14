import { getModelForClass, modelOptions, prop, ReturnModelType } from "@typegoose/typegoose";
import { SubCategories } from "./public";

//商铺分类
@modelOptions({ options: { customName: "categories" } })
class Category {
  @prop()
  id: number;

  @prop()
  count: number;

  @prop()
  image_url: string;

  @prop()
  level: number;

  @prop()
  name: string;

  @prop()
  sub_categories: SubCategories

  @prop({ type: () => [Number] })
  ids: number[]

  //获取所有商店分类
  public static async getAllGategorys(this: ReturnModelType<typeof Category>) {
    return this.find({ id: { $exists: true } }, { _id: 0, __v: 0 });
  }

  //获取所有商店分类
  public static async getCategoryById(this: ReturnModelType<typeof Category>, id: number) {
    return this.find({ "sub_categories.id": id });
  }
}

//首页商店分类
@modelOptions({ options: { customName: "entries" } })
class IndexEntry {
  @prop()
  id: number;

  @prop()
  is_in_serving: boolean;

  @prop()
  description: string;

  @prop()
  title: string;

  @prop()
  link: string;

  @prop()
  image_url: string

  @prop()
  icon_url: string

  @prop()
  title_color: string

  //获取首页分类
  public static async getIndexEntrys(this: ReturnModelType<typeof IndexEntry>) {
    return this.find({}, { _id: 0, __v: 0 });
  }
}

const CategoryModel = getModelForClass(Category);
const IndexEntryModel = getModelForClass(IndexEntry);

export { Category, CategoryModel, IndexEntryModel };