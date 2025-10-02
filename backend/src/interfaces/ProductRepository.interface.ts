import type { ProductInterface } from "./Product.interface";

export interface ProductRepositoryInterface {
  getAll(): Promise<ProductInterface[]>;
  getBySubCategory(id:number): Promise<ProductInterface[]>;
  create(data: Partial<ProductInterface>): Promise<ProductInterface>;
  update(
    id: number,
    data: Partial<ProductInterface>
  ): Promise<ProductInterface>;
  delete(id: number): Promise<ProductInterface>;
}
