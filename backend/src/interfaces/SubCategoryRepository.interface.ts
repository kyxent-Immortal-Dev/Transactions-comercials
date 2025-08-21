import type { SubCategoryInterface } from "./SubCategory.interface";

export interface SubCategoryRepositoryInterface {
  getAll(): Promise<SubCategoryInterface[]>;
  getByCategory(id: number): Promise<SubCategoryInterface[]>;
  create(data: Partial<SubCategoryInterface>): Promise<SubCategoryInterface>;
  update(
    id: number,
    data: Partial<SubCategoryInterface>
  ): Promise<SubCategoryInterface>;
  delete(id: number): Promise<SubCategoryInterface>;
}
