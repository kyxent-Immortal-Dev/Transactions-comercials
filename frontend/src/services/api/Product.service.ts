import type {
  ProductInterface,
  ResponseProduct,
} from "../../interfaces/Product.interface";
import type { HttpClient } from "../http.client.service";

export class ProductService {
  private httpClient: typeof HttpClient;

  constructor(httpClient: typeof HttpClient) {
    this.httpClient = httpClient;
  }

  async getAll(): Promise<ResponseProduct> {
    try {
      const request = await this.httpClient.get("/products");
      return request.data;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async getBySubcategory(id: string): Promise<ResponseProduct> {
    try {
      const request = await this.httpClient.get(`/products/${id}`);
      return request.data;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async create(data: Partial<ProductInterface>): Promise<ResponseProduct> {
    try {
      const request = await this.httpClient.post("/products", data);
      return request.data;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async updated(
    id: string,
    data: Partial<ProductInterface>
  ): Promise<ResponseProduct> {
    try {
      const request = await this.httpClient.put(`/products/${id}`, data);
      return request.data;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async deleted(id: string): Promise<ResponseProduct> {
    try {
      const request = await this.httpClient.delete(`/products/${id}`);
      return request.data;
    } catch (error) {
      throw new Error(error as string);
    }
  }
}
