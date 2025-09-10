import { HttpClient } from "../http.client.service";
import { SupplierContact, CreateSupplierContactRequest, UpdateSupplierContactRequest } from "../../interfaces/SupplierContact.interface";

export class SupplierContactService {
  private client: typeof HttpClient;

  constructor(client: typeof HttpClient) {
    this.client = client;
  }

  async getAll(): Promise<SupplierContact[]> {
    try {
      const request = await this.client.get("/supplier-contacts");
      return request.data as SupplierContact[];
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async getById(id: number): Promise<SupplierContact> {
    try {
      const request = await this.client.get(`/supplier-contacts/${id}`);
      return request.data as SupplierContact;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async getBySupplierId(supplierId: number): Promise<SupplierContact[]> {
    try {
      const request = await this.client.get(`/supplier-contacts/supplier/${supplierId}`);
      return request.data as SupplierContact[];
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async create(data: CreateSupplierContactRequest): Promise<SupplierContact> {
    try {
      const request = await this.client.post("/supplier-contacts", data);
      return request.data as SupplierContact;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async update(id: number, data: UpdateSupplierContactRequest): Promise<SupplierContact> {
    try {
      const request = await this.client.put(`/supplier-contacts/${id}`, data);
      return request.data as SupplierContact;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.client.delete(`/supplier-contacts/${id}`);
    } catch (error) {
      throw new Error(error as string);
    }
  }
}