import type {
  ResponseSubCategory,
  SubCategory,
} from "../../interfaces/SubCategory.interface";
import type { HttpClient } from "../http.client.service";

export class SubCategoryService {
  private httpClient: typeof HttpClient;

  constructor(httpClient: typeof HttpClient) {
    this.httpClient = httpClient;
  }

  async getAll(): Promise<ResponseSubCategory> {
    try {
      const request = await this.httpClient.get("/subcategories");

      return request.data;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async getByCategory(id: string): Promise<ResponseSubCategory> {
    try {
      const request = await this.httpClient.get(`/subcategories/${id}`);

      return request.data;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async create(data: Partial<SubCategory>): Promise<ResponseSubCategory> {
    try {
      const request = await this.httpClient.post("/subcategories", data);

      return request.data;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async updated(
    id: string,
    data: Partial<SubCategory>
  ): Promise<ResponseSubCategory> {
    try {
      const request = await this.httpClient.put(`/subcategories/${id}`, data);

      return request.data;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async deleted(id: string): Promise<ResponseSubCategory> {
    try {
      const request = await this.httpClient.delete(`/subcategories/${id}`);

      return request.data;
    } catch (error) {
      throw new Error(error as string);
    }
  }
}
