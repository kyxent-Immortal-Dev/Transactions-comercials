export interface ResponseProduct {
  msj: string;
  data: ProductInterface[];
}

export interface ProductInterface {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  amount: number;
  subcategoriesid: number;
  code?: string | null;
  bill_cost?: number | null;
  final_bill_retaceo?: number | null;
  utility?: number | null;
  size?: string | null;
  presentation?: string | null;
  purchase_unit?: string | null;
  sale_unit?: string | null;
}
