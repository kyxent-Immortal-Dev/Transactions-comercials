export interface Purchase {
  id?: number;
  code?: string | null;
  status?: string | null;
  date?: Date;
  num_invoice?: string | null;
  buy_order_id: number;
  supplier_id: number;
  purchase_details?: PurchaseDetail[];
  buy_order?: any;
  supplier?: any;
}

export interface CreatePurchaseRequest {
  code?: string | null;
  status?: string | null;
  date?: Date | string | null;
  num_invoice?: string | null;
  buy_order_id: number;
  supplier_id: number;
}

export interface UpdatePurchaseRequest {
  code?: string | null;
  status?: string | null;
  date?: Date | string | null;
  num_invoice?: string | null;
  buy_order_id?: number;
  supplier_id?: number;
}

export interface PurchaseDetail {
  id?: number;
  purchase_id: number;
  product_id: number;
  quantity?: number | null;
  price?: number | null;
  unit?: string | null;
  status?: string | null;
  product?: any;
}

export interface CreatePurchaseDetailRequest {
  purchase_id: number;
  product_id: number;
  quantity?: number | null;
  price?: number | null;
  unit?: string | null;
  status?: string | null;
}

export interface UpdatePurchaseDetailRequest {
  product_id?: number;
  quantity?: number | null;
  price?: number | null;
  unit?: string | null;
  status?: string | null;
}
