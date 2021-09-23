export interface SortWay {
  float_minimum_order_amount?: number;
  recent_order_num?: number;
  rating?: number;
}

export interface Filter {
  location?: {
    $near: [number, number]
  };
  'delivery_mode.id'?: number;
  'supports.id'?: {
    $all: number[]
  };
  is_premium?: boolean;
  category?: string;
}