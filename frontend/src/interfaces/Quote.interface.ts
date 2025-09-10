import { Supplier } from './Supplier.interface';
import { Product } from './Product.interface';

export interface Quote {
  id?: number;
  supplier_id: number;
  date?: string;
  code?: string;
  status?: string;
  supplier?: Supplier;
  quote_details?: QuoteDetail[];
}

export interface QuoteDetail {
  id?: number;
  quote_id: number;
  product_id: number;
  quantity_req?: number;
  price?: number;
  unit?: string;
  quantity_approved?: number;
  status?: string;
  product?: Product;
}

export interface CreateQuoteRequest {
  supplier_id: number;
  code?: string;
  status?: string;
}

export interface UpdateQuoteRequest {
  supplier_id?: number;
  code?: string;
  status?: string;
}

export interface CreateQuoteDetailRequest {
  quote_id: number;
  product_id: number;
  quantity_req?: number;
  price?: number;
  unit?: string;
  quantity_approved?: number;
  status?: string;
}

export interface UpdateQuoteDetailRequest {
  quantity_req?: number;
  price?: number;
  unit?: string;
  quantity_approved?: number;
  status?: string;
}