import { HttpClient } from "../http.client.service";
import type {
  PriceAnalysis,
  CreatePriceAnalysisRequest,
  UpdatePriceAnalysisRequest,
  PriceAnalysisDetail,
  CreatePriceAnalysisDetailRequest,
  UpdatePriceAnalysisDetailRequest
} from "../../interfaces/PriceAnalysis.interface";

export class PriceAnalysisService {
  private client: typeof HttpClient;

  constructor(client: typeof HttpClient) {
    this.client = client;
  }

  // Price Analysis CRUD
  async getAll(): Promise<PriceAnalysis[]> {
    try {
      const request = await this.client.get("/price-analysis");
      return request.data as PriceAnalysis[];
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async getById(id: number): Promise<PriceAnalysis> {
    try {
      const request = await this.client.get(`/price-analysis/${id}`);
      return request.data as PriceAnalysis;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async getByRetaceoId(retaceoId: number): Promise<PriceAnalysis[]> {
    try {
      const request = await this.client.get(`/price-analysis/retaceo/${retaceoId}`);
      return request.data as PriceAnalysis[];
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async create(data: CreatePriceAnalysisRequest): Promise<PriceAnalysis> {
    try {
      const request = await this.client.post("/price-analysis", data);
      return request.data as PriceAnalysis;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async update(id: number, data: UpdatePriceAnalysisRequest): Promise<PriceAnalysis> {
    try {
      const request = await this.client.put(`/price-analysis/${id}`, data);
      return request.data as PriceAnalysis;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.client.delete(`/price-analysis/${id}`);
    } catch (error) {
      throw new Error(error as string);
    }
  }

  // Price Analysis Details CRUD
  async getDetails(analysisId: number): Promise<PriceAnalysisDetail[]> {
    try {
      const request = await this.client.get(`/price-analysis/${analysisId}/details`);
      return request.data as PriceAnalysisDetail[];
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async createDetail(data: CreatePriceAnalysisDetailRequest): Promise<PriceAnalysisDetail> {
    try {
      const request = await this.client.post("/price-analysis/details", data);
      return request.data as PriceAnalysisDetail;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async getDetailById(id: number): Promise<PriceAnalysisDetail> {
    try {
      const request = await this.client.get(`/price-analysis/details/${id}`);
      return request.data as PriceAnalysisDetail;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async updateDetail(id: number, data: UpdatePriceAnalysisDetailRequest): Promise<PriceAnalysisDetail> {
    try {
      const request = await this.client.put(`/price-analysis/details/${id}`, data);
      return request.data as PriceAnalysisDetail;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async deleteDetail(id: number): Promise<void> {
    try {
      await this.client.delete(`/price-analysis/details/${id}`);
    } catch (error) {
      throw new Error(error as string);
    }
  }
}
