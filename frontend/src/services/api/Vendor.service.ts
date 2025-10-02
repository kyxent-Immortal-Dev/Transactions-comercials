import { HttpClient } from "../http.client.service";
import { Vendor, CreateVendorRequest, UpdateVendorRequest } from "../../interfaces/Vendor.interface";

export class VendorService {
  private client: typeof HttpClient;

  constructor(client: typeof HttpClient) {
    this.client = client;
  }

  async getAll(): Promise<Vendor[]> {
    try {
      const request = await this.client.get("/vendors");
      return request.data as Vendor[];
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async getById(id: number): Promise<Vendor> {
    try {
      const request = await this.client.get(`/vendors/${id}`);
      return request.data as Vendor;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async create(data: CreateVendorRequest): Promise<Vendor> {
    try {
      const request = await this.client.post("/vendors", data);
      return request.data as Vendor;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async update(id: number, data: UpdateVendorRequest): Promise<Vendor> {
    try {
      const request = await this.client.put(`/vendors/${id}`, data);
      return request.data as Vendor;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.client.delete(`/vendors/${id}`);
    } catch (error) {
      throw new Error(error as string);
    }
  }
}