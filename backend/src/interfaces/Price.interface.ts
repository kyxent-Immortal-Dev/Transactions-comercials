export interface Price {
  id: number;
  product_id: number;
  bill_cost: number;
  final_bill_retaceo: number;
  price: number;
  utility: number;
  date: Date;
  product?: any;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreatePriceRequest {
  product_id: number;
  bill_cost: number;
  final_bill_retaceo: number;
  price: number;
  utility: number;
  date?: Date | string;
}

export interface UpdatePriceRequest {
  product_id?: number;
  bill_cost?: number;
  final_bill_retaceo?: number;
  price?: number;
  utility?: number;
  date?: Date | string;
}

export interface PriceHistory {
  id: number;
  product_id: number;
  price_analysis_id: number;
  bill_cost: number;
  final_bill_retaceo: number;
  price: number;
  utility: number;
  date: Date;
  product?: any;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreatePriceHistoryRequest {
  product_id: number;
  price_analysis_id: number;
  bill_cost: number;
  final_bill_retaceo: number;
  price: number;
  utility: number;
  date?: Date | string;
}

export interface UpdatePriceHistoryRequest {
  product_id?: number;
  price_analysis_id?: number;
  bill_cost?: number;
  final_bill_retaceo?: number;
  price?: number;
  utility?: number;
  date?: Date | string;
}
