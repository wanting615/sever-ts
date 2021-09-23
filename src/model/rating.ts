import { ReturnModelType } from '@typegoose/typegoose';
import { getModelForClass } from '@typegoose/typegoose';
import { Ref } from '@typegoose/typegoose';
import { modelOptions, prop } from '@typegoose/typegoose';
@modelOptions({ schemaOptions: { _id: false } })
class RatingItem {
  @prop({ required: true })
  food_id: number;

  @prop({ required: true })
  food_name: string;

  @prop({ default: '' })
  image_hash: string;

  @prop({ default: 1 })
  is_valid: number;
}

@modelOptions({ schemaOptions: { _id: false } })
class RatingIDetail {
  @prop({ required: true })
  username: string;

  @prop({ default: '' })
  avatar?: string;

  @prop()
  rated_at: string;

  @prop({ default: 0 })
  compare_rating?: number;

  @prop()
  rating_star: number;

  @prop({ default: '' })
  rating_text?: string;

  @prop({ default: '' })
  time_spent_desc?: string;

  @prop({ type: String })
  tags: string[];

  @prop({ type: RatingItem })
  item_ratings: RatingItem[]
}

@modelOptions({ schemaOptions: { _id: false } })
class Tag {
  @prop()
  name: string;

  @prop({ default: false })
  unsatisfied: boolean;

  @prop({ default: 0 })
  count: number
}

@modelOptions({ schemaOptions: { _id: false } })
class Score {
  @prop({ default: 0 })
  service_score: number;
  @prop({ default: 0 })
  overall_score: number;
  @prop({ default: 0 })
  order_rating_amount: number;
  @prop({ default: 0 })
  food_score: number;
  @prop({ default: 0 })
  deliver_time: number;
  @prop({ default: 0 })
  compare_rating: number;

}


/**
 * 评价表
 */
@modelOptions({ options: { customName: 'ratings' }, schemaOptions: { _id: false } })
class Rating {
  @prop({ required: true })
  restaurant_id: number;

  @prop({ ref: () => Tag })
  tags: Ref<Tag[]>;

  @prop({ ref: () => Score })
  scores: Score;

  @prop({ type: RatingIDetail })
  ratings: RatingIDetail[];

  public static async getRatings(this: ReturnModelType<typeof Rating>, shopId: number) {
    try {
      const data = await this.findOne({ restaurant_id: shopId });
      return data.ratings;
    } catch (error) {
      console.log(error)
      return []
    }
  }

  public static async getScores(this: ReturnModelType<typeof Rating>, shopId: number) {
    try {
      const data = await this.findOne({ restaurant_id: shopId });
      return data.scores;
    } catch (error) {
      console.log(error)
      return null
    }
  }

  public static async getTags(this: ReturnModelType<typeof Rating>, shopId: number) {
    try {
      const data = await this.findOne({ restaurant_id: shopId });
      return data.tags;
    } catch (error) {
      console.log(error)
      return []
    }
  }
}

const RatingModel = getModelForClass(Rating);

export { RatingModel }


