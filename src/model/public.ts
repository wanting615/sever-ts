
import { modelOptions, prop } from "@typegoose/typegoose";

@modelOptions({ schemaOptions: { _id: false } })
export class Activity {
  @prop()
  public description: string;
  @prop()
  public icon_color: string;
  @prop()
  public icon_name: string;
  @prop()
  public id: number;
  @prop()
  public name: string;
  @prop()
  public ranking_weight?: number;
}

@modelOptions({ schemaOptions: { _id: false } })
export class DeliveryMode {
  @prop()
  public color: string;
  @prop()
  public id: number;
  @prop()
  public is_solid: boolean;
  @prop()
  public text: string;
}

@modelOptions({ schemaOptions: { _id: false } })
export class Identification {
  @prop({ default: '' })
  company_name: string;
  @prop({ default: Date.now })
  identificate_date: Date;
  @prop({ default: '' })
  legal_person: string;
  @prop({ default: '' })
  licenses_date: string;
  @prop({ default: '' })
  licenses_number: string;
  @prop({ default: '' })
  licenses_scope: string;
  @prop({ default: '' })
  operation_period: string;
  @prop({ default: '' })
  registered_address: string;
  @prop({ default: '' })
  registered_number: string;
}

@modelOptions({ schemaOptions: { _id: false } })
export class License {
  @prop({ default: '' })
  business_license_image: string;
  @prop({ default: '' })
  catering_service_license_image: string;
}

@modelOptions({ schemaOptions: { _id: false } })
export class PiecewiseAgentFee {
  @prop()
  public tips: string
}

@modelOptions({ schemaOptions: { _id: false } })
export class Support {
  @prop()
  public id: number;
  @prop()
  public description: string;
  @prop()
  public icon_color: string;
  @prop()
  public icon_name: string;
  @prop()
  public name: string;
  constructor(opts?: Partial<Support>) {
    if (opts) {
      Object.assign(this, opts);
    }
  }
}

@modelOptions({ schemaOptions: { _id: false } })
export class SubCategories {
  @prop()
  id: number;
  @prop()
  count: number;
  @prop()
  level: number;
  @prop()
  image_url: string;
  @prop()
  name: string;
}