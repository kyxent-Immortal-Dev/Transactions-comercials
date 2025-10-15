export interface Retaceo {
  id?: number;
  code?: string | null;
  num_invoice?: string | null;
  date?: Date;
  status?: string | null;
  purchase_id: number;
  retaceo_details?: RetaceoDetail[];
  purchase?: Purchase;
}

export interface CreateRetaceoRequest {
  code?: string | null;
  num_invoice?: string | null;
  date?: Date | string | null;
  status?: string | null;
  purchase_id: number;
}

export interface UpdateRetaceoRequest {
  code?: string | null;
  num_invoice?: string | null;
  date?: Date | string | null;
  status?: string | null;
  purchase_id?: number;
}

export interface RetaceoDetail {
  id?: number;
  retaceo_id: number;
  product_id: number;
  quantity?: number | null;
  price?: number | null;
  status?: string | null;
  product?: Product;
}

export interface CreateRetaceoDetailRequest {
  retaceo_id: number;
  product_id: number;
  quantity?: number | null;
  price?: number | null;
  status?: string | null;
}

export interface UpdateRetaceoDetailRequest {
  product_id?: number;
  quantity?: number | null;
  price?: number | null;
  status?: string | null;
}

// Helper interfaces for nested objects
interface Purchase {
  id?: number;
  code?: string | null;
  supplier?: Supplier;
  buy_order?: BuyOrder;
}

interface Supplier {
  id?: number;
  name?: string | null;
}

interface BuyOrder {
  id?: number;
  code?: string | null;
}

interface Product {
  id?: number;
  name?: string | null;
  code?: string | null;
}
