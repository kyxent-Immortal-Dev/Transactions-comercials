export interface ExpenseType {
  id?: number;
  name: string;
  description?: string | null;
  is_required?: boolean | null;
}

export interface CreateExpenseTypeRequest {
  name: string;
  description?: string | null;
  is_required?: boolean | null;
}

export interface UpdateExpenseTypeRequest {
  name?: string;
  description?: string | null;
  is_required?: boolean | null;
}

export interface OrderLog {
  id?: number;
  buy_order_id: number;
  date: Date;
  item: string;
  value: number;
  expense_type: string;
}

export interface CreateOrderLogRequest {
  buy_order_id: number;
  date: Date;
  item: string;
  value: number;
  expense_type: string;
}

export interface UpdateOrderLogRequest {
  buy_order_id?: number;
  date?: Date;
  item?: string;
  value?: number;
  expense_type?: string;
}

export interface Retaceo {
  id?: number;
  code?: string | null;
  num_invoice?: string | null;
  date?: Date;
  status?: string | null;
  purchase_id: number;
  retaceo_details?: RetaceoDetail[];
  purchase?: any;
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
  product?: any;
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
