export interface ProductInterface {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  amount: number;
  subcategoriesid: number;
  final_bill_retaceo?: number | null;
  bill_cost?: number | null;
  utility?: number | null;
}
