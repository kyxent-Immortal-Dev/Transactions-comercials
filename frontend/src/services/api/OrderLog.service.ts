import { HttpClient } from "../http.client.service";
import type {
  OrderLog,
  CreateOrderLogRequest,
  UpdateOrderLogRequest
} from "../../interfaces/Retaceo.interface";

export class OrderLogService {
  private client: typeof HttpClient;

  constructor(client: typeof HttpClient) {
    this.client = client;
  }

  async getAll(): Promise<OrderLog[]> {
    try {
      const request = await this.client.get("/order-logs");
      return request.data as OrderLog[];
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async getById(id: number): Promise<OrderLog> {
    try {
      const request = await this.client.get(`/order-logs/${id}`);
      return request.data as OrderLog;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async getByBuyOrderId(buyOrderId: number): Promise<OrderLog[]> {
    try {
      const request = await this.client.get(`/order-logs/buy-order/${buyOrderId}`);
      return request.data as OrderLog[];
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async create(data: CreateOrderLogRequest): Promise<OrderLog> {
    try {
      const request = await this.client.post("/order-logs", data);
      return request.data as OrderLog;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async update(id: number, data: UpdateOrderLogRequest): Promise<OrderLog> {
    try {
      const request = await this.client.put(`/order-logs/${id}`, data);
      return request.data as OrderLog;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.client.delete(`/order-logs/${id}`);
    } catch (error) {
      throw new Error(error as string);
    }
  }
}
