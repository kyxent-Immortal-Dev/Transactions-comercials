import { PrismaClient } from "../generated/prisma";
import type { SubCategoryInterface } from "../interfaces/SubCategory.interface";
import type { SubCategoryRepositoryInterface } from "../interfaces/SubCategoryRepository.interface";

export class SubCategoryRepository implements SubCategoryRepositoryInterface {
  private postgresql = new PrismaClient();

  async getAll(): Promise<SubCategoryInterface[]> {
    try {
      const request = await this.postgresql.subcategories.findMany();
      return request as unknown as SubCategoryInterface[];
    } catch (error) {
      throw new Error(error as string);
    }
  }
  async getByCategory(id: number): Promise<SubCategoryInterface[]> {
    try {
      const request = await this.postgresql.subcategories.findMany({
        where: {
          categoryid: id,
        },
      });
      return request as unknown as SubCategoryInterface[];
    } catch (error) {
      throw new Error(error as string);
    }
  }
  async create(
    data: Partial<SubCategoryInterface>
  ): Promise<SubCategoryInterface> {
    try {
      const request = await this.postgresql.subcategories.create({ data });
      return request as unknown as SubCategoryInterface;
    } catch (error) {
      throw new Error(error as string);
    }
  }
  async update(
    id: number,
    data: Partial<SubCategoryInterface>
  ): Promise<SubCategoryInterface> {
    try {
      const request = await this.postgresql.subcategories.update({
        where: { id: id },
        data: data,
      });
      return request as unknown as SubCategoryInterface;
    } catch (error) {
      throw new Error(error as string);
    }
  }
  async delete(id: number): Promise<SubCategoryInterface> {
    try {
      const request = await this.postgresql.subcategories.delete({
        where: { id: id },
      });
      return request as unknown as SubCategoryInterface;
    } catch (error) {
      throw new Error(error as string);
    }
  }
}
