export interface PriceAnalysis {
  id?: number;
  code?: string | null;
  status?: string | null;
  date?: Date;
  num_invoice?: string | null;
  retaceo_id: number;
  retaceo?: {
    id?: number;
    code?: string | null;
    purchase?: {
      id?: number;
      code?: string | null;
      supplier?: {
        id?: number;
        name?: string | null;
      };
      purchase_details?: Array<{
        id?: number;
        product_id?: number;
        quantity?: number | null;
        price?: number | null;
      }>;
    };
    retaceo_details?: Array<{
      id?: number;
      product_id: number;
      quantity?: number | null;
      price?: number | null;
      product?: any;
    }>;
  };
  price_analysis_details?: PriceAnalysisDetail[];
}

export interface PriceAnalysisDetail {
  id?: number;
  price_analysis_id: number;
  product_id: number;
  quantity?: number | null;
  price?: number | null;
  utility_percent?: number | null;
  product?: {
    id?: number;
    name?: string | null;
    code?: string | null;
  };
}

export interface CreatePriceAnalysisRequest {
  code?: string | null;
  status?: string | null;
  date?: Date | string | null;
  num_invoice?: string | null;
  retaceo_id: number;
  details?: CreatePriceAnalysisDetailRequest[];
}

export interface UpdatePriceAnalysisRequest {
  code?: string | null;
  status?: string | null;
  date?: Date | string | null;
  num_invoice?: string | null;
  retaceo_id?: number;
}

export interface CreatePriceAnalysisDetailRequest {
  price_analysis_id: number;
  product_id: number;
  quantity?: number | null;
  price?: number | null;
  utility_percent?: number | null;
}

export interface UpdatePriceAnalysisDetailRequest {
  product_id?: number;
  quantity?: number | null;
  price?: number | null;
  utility_percent?: number | null;
}
