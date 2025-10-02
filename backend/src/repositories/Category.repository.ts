import { PrismaClient } from "../generated/prisma/index";
import type { CategoryI } from "../interfaces/Category.interface.ts";
import type { CategoryRepositoryInterface } from "../interfaces/CategoryRepository.interface.ts";

export class CategoryRepository implements CategoryRepositoryInterface {
  private postgresql = new PrismaClient();

  async getAll(): Promise<CategoryI[]> {
    try {
      const request = await this.postgresql.categories.findMany();

      return request as CategoryI[];
    } catch (error) {
      throw new Error(error as string);
    }
  }
  async create(data: Partial<CategoryI>): Promise<CategoryI> {
    try {
      const request = await this.postgresql.categories.create({ data });

      return request as CategoryI;
    } catch (error) {
      throw new Error(error as string);
    }
  }
  async update(id: number, data: Partial<CategoryI>): Promise<CategoryI> {
    try {
      const request = await this.postgresql.categories.update({
        where: {
          id: id,
        },
        data: data,
      });

      return request as CategoryI;
    } catch (error) {
      throw new Error(error as string);
    }
  }
  async delete(id: number): Promise<CategoryI> {
    try {
      const request = await this.postgresql.categories.delete({
        where: {
          id: id,
        },
      });

      return request as CategoryI;
    } catch (error) {
      throw new Error(error as string);
    }
  }
}
