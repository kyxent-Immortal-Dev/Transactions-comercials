import type { ProductInterface } from "./Product.interface";

export interface Price {
  id: number;
  product_id: number;
  bill_cost: number;
  final_bill_retaceo: number;
  price: number;
  utility: number;
  date: string;
  product?: ProductInterface;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePriceRequest {
  product_id: number;
  bill_cost: number;
  final_bill_retaceo: number;
  price: number;
  utility: number;
  date?: string;
}

export interface UpdatePriceRequest {
  product_id?: number;
  bill_cost?: number;
  final_bill_retaceo?: number;
  price?: number;
  utility?: number;
  date?: string;
}

export interface PriceHistory {
  id: number;
  product_id: number;
  price_analysis_id: number;
  bill_cost: number;
  final_bill_retaceo: number;
  price: number;
  utility: number;
  date: string;
  product?: ProductInterface;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePriceHistoryRequest {
  product_id: number;
  price_analysis_id: number;
  bill_cost: number;
  final_bill_retaceo: number;
  price: number;
  utility: number;
  date?: string;
}

export interface UpdatePriceHistoryRequest {
  product_id?: number;
  price_analysis_id?: number;
  bill_cost?: number;
  final_bill_retaceo?: number;
  price?: number;
  utility?: number;
  date?: string;
}
