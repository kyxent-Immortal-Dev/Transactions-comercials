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
  code: string;
  date?: Date;
  buy_order_id?: number | null;
  supplier_id: number;
  invoice_number?: string | null;
  invoice_date?: Date | null;
  policy_number?: string | null;
  policy_date?: Date | null;
  fob_total: number;
  freight: number;
  insurance: number;
  dai: number;
  other_expenses: number;
  iva_percentage?: number | null;
  iva_amount?: number | null;
  cif_total?: number | null;
  created_at?: Date;
  retaceo_details?: RetaceoDetail[];
}

export interface CreateRetaceoRequest {
  code: string;
  buy_order_id?: number | null;
  supplier_id: number;
  invoice_number?: string | null;
  invoice_date?: Date | null;
  policy_number?: string | null;
  policy_date?: Date | null;
  fob_total: number;
  freight: number;
  insurance: number;
  dai: number;
  other_expenses: number;
  iva_percentage?: number | null;
  iva_amount?: number | null;
  cif_total?: number | null;
}

export interface UpdateRetaceoRequest {
  code?: string;
  buy_order_id?: number | null;
  supplier_id?: number;
  invoice_number?: string | null;
  invoice_date?: Date | null;
  policy_number?: string | null;
  policy_date?: Date | null;
  fob_total?: number;
  freight?: number;
  insurance?: number;
  dai?: number;
  other_expenses?: number;
  iva_percentage?: number | null;
  iva_amount?: number | null;
  cif_total?: number | null;
}

export interface RetaceoDetail {
  id?: number;
  retaceo_id: number;
  product_id: number;
  quantity: number;
  fob_cost: number;
  freight_cost: number;
  freight_percent: number;
  expenses_cost: number;
  expenses_percent: number;
  dai_cost: number;
  dai_percent: number;
  unit_cost: number;
  product?: any;
}

export interface CreateRetaceoDetailRequest {
  retaceo_id: number;
  product_id: number;
  quantity: number;
  fob_cost: number;
  freight_cost: number;
  freight_percent: number;
  expenses_cost: number;
  expenses_percent: number;
  dai_cost: number;
  dai_percent: number;
  unit_cost: number;
}

export interface UpdateRetaceoDetailRequest {
  quantity?: number;
  fob_cost?: number;
  freight_cost?: number;
  freight_percent?: number;
  expenses_cost?: number;
  expenses_percent?: number;
  dai_cost?: number;
  dai_percent?: number;
  unit_cost?: number;
}
