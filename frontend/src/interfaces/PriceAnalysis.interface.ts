import type { ProductInterface } from "./Product.interface";
import type { Retaceo } from "./Retaceo.interface";

export interface PriceAnalysis {
  id: number;
  retaceo_id: number;
  date: string;
  status: string;
  retaceo?: Retaceo;
  price_analysis_details?: PriceAnalysisDetail[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PriceAnalysisDetail {
  id: number;
  price_analysis_id: number;
  product_id: number;
  quantity: number;
  bill_cost: number;
  final_bill_retaceo: number;
  price: number;
  utility_percent: number;
  product?: ProductInterface;
}

export interface CreatePriceAnalysisRequest {
  retaceo_id: number;
  date?: string;
  status: string;
  details?: CreatePriceAnalysisDetailRequest[];
}

export interface UpdatePriceAnalysisRequest {
  retaceo_id?: number;
  date?: string;
  status?: string;
}

export interface CreatePriceAnalysisDetailRequest {
  price_analysis_id: number;
  product_id: number;
  quantity: number;
  bill_cost: number;
  final_bill_retaceo: number;
  price: number;
  utility_percent: number;
}

export interface UpdatePriceAnalysisDetailRequest {
  product_id?: number;
  quantity?: number;
  bill_cost?: number;
  final_bill_retaceo?: number;
  price?: number;
  utility_percent?: number;
}
