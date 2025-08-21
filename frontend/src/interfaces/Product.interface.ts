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
}
