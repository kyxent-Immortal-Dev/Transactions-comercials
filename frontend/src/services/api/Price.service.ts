import { HttpClient } from "../http.client.service";
import type {
  Price,
  CreatePriceRequest,
  UpdatePriceRequest,
  PriceHistory,
  CreatePriceHistoryRequest,
  UpdatePriceHistoryRequest
} from "../../interfaces/Price.interface";

export class PriceService {
  private client: typeof HttpClient;

  constructor(client: typeof HttpClient) {
    this.client = client;
  }

  // ===== PRICE METHODS =====

  async getAllPrices(): Promise<Price[]> {
    try {
      const request = await this.client.get("/prices");
      return request.data as Price[];
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async getPriceById(id: number): Promise<Price> {
    try {
      const request = await this.client.get(`/prices/${id}`);
      return request.data as Price;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async getCurrentPriceByProductId(productId: number): Promise<Price> {
    try {
      const request = await this.client.get(`/prices/product/${productId}`);
      return request.data as Price;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async createPrice(data: CreatePriceRequest): Promise<Price> {
    try {
      const request = await this.client.post("/prices", data);
      return request.data as Price;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async updatePrice(id: number, data: UpdatePriceRequest): Promise<Price> {
    try {
      const request = await this.client.put(`/prices/${id}`, data);
      return request.data as Price;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async deletePrice(id: number): Promise<void> {
    try {
      await this.client.delete(`/prices/${id}`);
    } catch (error) {
      throw new Error(error as string);
    }
  }

  // ===== PRICE HISTORY METHODS =====

  async getAllPriceHistory(): Promise<PriceHistory[]> {
    try {
      const request = await this.client.get("/history");
      return request.data as PriceHistory[];
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async getPriceHistoryById(id: number): Promise<PriceHistory> {
    try {
      const request = await this.client.get(`/history/${id}`);
      return request.data as PriceHistory;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async getPriceHistoryByProductId(productId: number): Promise<PriceHistory[]> {
    try {
      const request = await this.client.get(`/history/product/${productId}`);
      return request.data as PriceHistory[];
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async getPriceHistoryByAnalysisId(analysisId: number): Promise<PriceHistory[]> {
    try {
      const request = await this.client.get(`/history/analysis/${analysisId}`);
      return request.data as PriceHistory[];
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async createPriceHistory(data: CreatePriceHistoryRequest): Promise<PriceHistory> {
    try {
      const request = await this.client.post("/history", data);
      return request.data as PriceHistory;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async updatePriceHistory(id: number, data: UpdatePriceHistoryRequest): Promise<PriceHistory> {
    try {
      const request = await this.client.put(`/history/${id}`, data);
      return request.data as PriceHistory;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async deletePriceHistory(id: number): Promise<void> {
    try {
      await this.client.delete(`/history/${id}`);
    } catch (error) {
      throw new Error(error as string);
    }
  }
}
