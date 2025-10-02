import { HttpClient } from "../http.client.service";
import { BuyOrder, BuyOrderDetail, CreateBuyOrderRequest, UpdateBuyOrderRequest, CreateBuyOrderDetailRequest, UpdateBuyOrderDetailRequest } from "../../interfaces/BuyOrder.interface";

export class BuyOrderService {
  private client: typeof HttpClient;

  constructor(client: typeof HttpClient) {
    this.client = client;
  }

  async getAll(): Promise<BuyOrder[]> {
    try {
      const request = await this.client.get("/buy-orders");
      return request.data as BuyOrder[];
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async getById(id: number): Promise<BuyOrder> {
    try {
      const request = await this.client.get(`/buy-orders/${id}`);
      return request.data as BuyOrder;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async getBySupplierId(supplierId: number): Promise<BuyOrder[]> {
    try {
      const request = await this.client.get(`/buy-orders/supplier/${supplierId}`);
      return request.data as BuyOrder[];
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async getByQuoteId(quoteId: number): Promise<BuyOrder[]> {
    try {
      const request = await this.client.get(`/buy-orders/quote/${quoteId}`);
      return request.data as BuyOrder[];
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async create(data: CreateBuyOrderRequest): Promise<BuyOrder> {
    try {
      const request = await this.client.post("/buy-orders", data);
      return request.data as BuyOrder;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async update(id: number, data: UpdateBuyOrderRequest): Promise<BuyOrder> {
    try {
      const request = await this.client.put(`/buy-orders/${id}`, data);
      return request.data as BuyOrder;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.client.delete(`/buy-orders/${id}`);
    } catch (error) {
      throw new Error(error as string);
    }
  }

  // Buy Order Details methods
  async createDetail(data: CreateBuyOrderDetailRequest): Promise<BuyOrderDetail> {
    try {
      const request = await this.client.post("/buy-orders/details", data);
      return request.data as BuyOrderDetail;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async getDetailsByBuyOrderId(buyOrderId: number): Promise<BuyOrderDetail[]> {
    try {
      const request = await this.client.get(`/buy-orders/${buyOrderId}/details`);
      return request.data as BuyOrderDetail[];
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async getDetailById(id: number): Promise<BuyOrderDetail> {
    try {
      const request = await this.client.get(`/buy-orders/details/${id}`);
      return request.data as BuyOrderDetail;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async updateDetail(id: number, data: UpdateBuyOrderDetailRequest): Promise<BuyOrderDetail> {
    try {
      const request = await this.client.put(`/buy-orders/details/${id}`, data);
      return request.data as BuyOrderDetail;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async deleteDetail(id: number): Promise<void> {
    try {
      await this.client.delete(`/buy-orders/details/${id}`);
    } catch (error) {
      throw new Error(error as string);
    }
  }
}