import type { ResponseCategory } from "../../interfaces/Category.interfaces";
import { HttpClient } from "../http.client.service";
import { type CategoryI } from "../../interfaces/Category.interfaces";

export class CategoryService {
  private client: typeof HttpClient;

  constructor(client: typeof HttpClient) {
    this.client = client;
  }

  async getAll(): Promise<ResponseCategory> {
    try {
      const request = await this.client.get("/categories");

      return request.data as ResponseCategory;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async create(data: Partial<CategoryI>): Promise<ResponseCategory> {
    try {
      const request = await this.client.post("/categories", data);

      return request.data as ResponseCategory;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async update(
    id: string,
    data: Partial<CategoryI>
  ): Promise<ResponseCategory> {
    try {
      const request = await this.client.put(`/categories/${id}`, data);
      return request.data;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async delete(id: string): Promise<ResponseCategory> {
    try {
      const request = await this.client.delete(`/categories/${id}`);

      return request.data;
    } catch (error) {
      throw new Error(error as string);
    }
  }
}
