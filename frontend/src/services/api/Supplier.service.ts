import { HttpClient } from "../http.client.service";
import { Supplier, CreateSupplierRequest, UpdateSupplierRequest } from "../../interfaces/Supplier.interface";

export class SupplierService {
  private client: typeof HttpClient;

  constructor(client: typeof HttpClient) {
    this.client = client;
  }

  async getAll(): Promise<Supplier[]> {
    try {
      const request = await this.client.get("/suppliers");
      return request.data as Supplier[];
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async getById(id: number): Promise<Supplier> {
    try {
      const request = await this.client.get(`/suppliers/${id}`);
      return request.data as Supplier;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async create(data: CreateSupplierRequest): Promise<Supplier> {
    try {
      const request = await this.client.post("/suppliers", data);
      return request.data as Supplier;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async update(id: number, data: UpdateSupplierRequest): Promise<Supplier> {
    try {
      const request = await this.client.put(`/suppliers/${id}`, data);
      return request.data as Supplier;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.client.delete(`/suppliers/${id}`);
    } catch (error) {
      throw new Error(error as string);
    }
  }
}