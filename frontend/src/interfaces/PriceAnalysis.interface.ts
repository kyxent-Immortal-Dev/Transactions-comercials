import type { ProductInterface } from "./Product.interface";
import type { Retaceo } from "./Retaceo.interface";
import type { Price, PriceHistory } from "./Price.interface";

export interface PriceAnalysis {
  id: number;
  retaceo_id: number;
  code?: string | null;
  date?: string;
  status?: string | null;
  num_invoice?: string | null;
  retaceo?: Retaceo;
  price_analysis_details?: PriceAnalysisDetail[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PriceAnalysisDetail {
  id: number;
  price_analysis_id: number;
  product_id: number;
  quantity?: number | null;
  price?: number | null;
  utility_percent?: number | null;
  product?: ProductInterface;
}

export interface CreatePriceAnalysisRequest {
  retaceo_id: number;
  date?: string;
  status?: string;
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
  quantity?: number;
  price?: number;
  utility_percent?: number;
}

export interface UpdatePriceAnalysisDetailRequest {
  product_id?: number;
  quantity?: number;
  price?: number;
  utility_percent?: number;
}

export interface ApplyPriceAnalysisResponse {
  analysis: PriceAnalysis;
  updatedProducts: ProductInterface[];
  priceRecords: Price[];
  priceHistoryRecords: PriceHistory[];
}
