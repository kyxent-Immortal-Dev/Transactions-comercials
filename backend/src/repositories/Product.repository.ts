import { PrismaClient } from "../generated/prisma";
import type { ProductInterface } from "../interfaces/Product.interface";
import type { ProductRepositoryInterface } from "../interfaces/ProductRepository.interface";

export class ProductRepository implements ProductRepositoryInterface {
  private postgresql = new PrismaClient();

  async getAll(): Promise<ProductInterface[]> {
    try {
      const request = await this.postgresql.products.findMany();

      return request as ProductInterface[];
    } catch (error) {
      throw new Error(error as string);
    }
  }
  async getBySubCategory(id: number): Promise<ProductInterface[]> {
    try {
      const request = await this.postgresql.products.findMany({
        where: {
          subcategoriesid: id,
        },
      });

      return request as ProductInterface[];
    } catch (error) {
      throw new Error(error as string);
    }
  }
  async getById(id: number): Promise<ProductInterface | null> {
    try {
      const request = await this.postgresql.products.findUnique({
        where: {
          id: id,
        },
      });

      return request as ProductInterface | null;
    } catch (error) {
      throw new Error(error as string);
    }
  }
  async create(data: Partial<ProductInterface>): Promise<ProductInterface> {
    try {
      const request = await this.postgresql.products.create({ data });

      return request as ProductInterface;
    } catch (error) {
      throw new Error(error as string);
    }
  }
  async update(
    id: number,
    data: Partial<ProductInterface>
  ): Promise<ProductInterface> {
    try {
      const request = await this.postgresql.products.update({
        where: {
          id: id,
        },
        data: data,
      });

      return request as ProductInterface;
    } catch (error) {
      throw new Error(error as string);
    }
  }
  async delete(id: number): Promise<ProductInterface> {
    try {
      const request = await this.postgresql.products.delete({
        where: {
          id: id,
        },
      });

      return request as ProductInterface;
    } catch (error) {
      throw new Error(error as string);
    }
  }
}
