import { Supplier } from './Supplier.interface';
import { Product } from './Product.interface';
import { Quote } from './Quote.interface';

export interface BuyOrder {
  id?: number;
  supplier_id: number;
  quote_id?: number;
  date?: string;
  code?: string;
  status?: string;
  date_arrival?: string;
  supplier?: Supplier;
  quote?: Quote;
  buy_order_details?: BuyOrderDetail[];
}

export interface BuyOrderDetail {
  id?: number;
  buy_order_id: number;
  product_id: number;
  quantity?: number;
  price?: number;
  unit?: string;
  status?: string;
  product?: Product;
}

export interface CreateBuyOrderRequest {
  supplier_id: number;
  quote_id?: number;
  code?: string;
  status?: string;
  date_arrival?: string;
}

export interface UpdateBuyOrderRequest {
  supplier_id?: number;
  quote_id?: number;
  code?: string;
  status?: string;
  date_arrival?: string;
}

export interface CreateBuyOrderDetailRequest {
  buy_order_id: number;
  product_id: number;
  quantity?: number;
  price?: number;
  unit?: string;
  status?: string;
}

export interface UpdateBuyOrderDetailRequest {
  quantity?: number;
  price?: number;
  unit?: string;
  status?: string;
}