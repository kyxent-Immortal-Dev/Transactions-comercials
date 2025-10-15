import { HttpClient } from "../http.client.service";
import type {
  Purchase,
  CreatePurchaseRequest,
  UpdatePurchaseRequest,
  PurchaseDetail,
  CreatePurchaseDetailRequest,
  UpdatePurchaseDetailRequest
} from "../../interfaces/Purchase.interface";

export class PurchaseService {
  private client: typeof HttpClient;

  constructor(client: typeof HttpClient) {
    this.client = client;
  }

  // Purchase CRUD
  async getAll(): Promise<Purchase[]> {
    try {
      const request = await this.client.get("/purchases");
      return request.data as Purchase[];
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async getById(id: number): Promise<Purchase> {
    try {
      const request = await this.client.get(`/purchases/${id}`);
      return request.data as Purchase;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async getByBuyOrderId(buyOrderId: number): Promise<Purchase[]> {
    try {
      const request = await this.client.get(`/purchases/buy-order/${buyOrderId}`);
      return request.data as Purchase[];
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async create(data: CreatePurchaseRequest): Promise<Purchase> {
    try {
      const request = await this.client.post("/purchases", data);
      return request.data as Purchase;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async update(id: number, data: UpdatePurchaseRequest): Promise<Purchase> {
    try {
      const request = await this.client.put(`/purchases/${id}`, data);
      return request.data as Purchase;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.client.delete(`/purchases/${id}`);
    } catch (error) {
      throw new Error(error as string);
    }
  }

  // Purchase Details CRUD
  async createDetail(data: CreatePurchaseDetailRequest): Promise<PurchaseDetail> {
    try {
      const request = await this.client.post("/purchases/details", data);
      return request.data as PurchaseDetail;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async getDetailsByPurchaseId(purchaseId: number): Promise<PurchaseDetail[]> {
    try {
      const request = await this.client.get(`/purchases/${purchaseId}/details`);
      return request.data as PurchaseDetail[];
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async getDetailById(id: number): Promise<PurchaseDetail> {
    try {
      const request = await this.client.get(`/purchases/details/${id}`);
      return request.data as PurchaseDetail;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async updateDetail(id: number, data: UpdatePurchaseDetailRequest): Promise<PurchaseDetail> {
    try {
      const request = await this.client.put(`/purchases/details/${id}`, data);
      return request.data as PurchaseDetail;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async deleteDetail(id: number): Promise<void> {
    try {
      await this.client.delete(`/purchases/details/${id}`);
    } catch (error) {
      throw new Error(error as string);
    }
  }
}
