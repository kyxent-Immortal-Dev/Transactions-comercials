export interface Quote {
  id?: number;
  supplier_id: number;
  date?: Date;
  code?: string | null;
  status?: string | null;
  supplier?: any;
  quote_details?: QuoteDetail[];
}

export interface QuoteDetail {
  id?: number;
  quote_id: number;
  product_id: number;
  quantity_req?: number | null;
  price?: number | null;
  unit?: string | null;
  quantity_approved?: number | null;
  status?: string | null;
  product?: any;
}

export interface CreateQuoteRequest {
  supplier_id: number;
  code?: string | null;
  status?: string | null;
}

export interface UpdateQuoteRequest {
  supplier_id?: number;
  code?: string | null;
  status?: string | null;
}

export interface CreateQuoteDetailRequest {
  quote_id: number;
  product_id: number;
  quantity_req?: number | null;
  price?: number | null;
  unit?: string | null;
  quantity_approved?: number | null;
  status?: string | null;
}

export interface UpdateQuoteDetailRequest {
  quantity_req?: number | null;
  price?: number | null;
  unit?: string | null;
  quantity_approved?: number | null;
  status?: string | null;
}