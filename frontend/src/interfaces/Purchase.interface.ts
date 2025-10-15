export interface Purchase {
  id?: number;
  code?: string | null;
  status?: string | null;
  date?: Date;
  num_invoice?: string | null;
  buy_order_id: number;
  supplier_id: number;
  purchase_details?: PurchaseDetail[];
  buy_order?: BuyOrder;
  supplier?: Supplier;
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
  product?: Product;
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

// Helper interfaces
interface BuyOrder {
  id?: number;
  code?: string | null;
}

interface Supplier {
  id?: number;
  name?: string | null;
}

interface Product {
  id?: number;
  name?: string | null;
  code?: string | null;
}
