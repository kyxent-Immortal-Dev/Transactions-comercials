export interface BuyOrder {
  id?: number;
  supplier_id: number;
  quote_id?: number;
  date?: Date;
  code?: string;
  status?: string;
  date_arrival?: Date;
  supplier?: any;
  quote?: any;
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
  product?: any;
}

export interface CreateBuyOrderRequest {
  supplier_id: number;
  quote_id?: number;
  code?: string;
  status?: string;
  date_arrival?: Date | string;
}

export interface UpdateBuyOrderRequest {
  supplier_id?: number;
  quote_id?: number;
  code?: string;
  status?: string;
  date_arrival?: Date | string;
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