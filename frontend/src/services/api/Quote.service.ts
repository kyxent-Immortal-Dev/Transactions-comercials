import { HttpClient } from "../http.client.service";
import type { Quote, QuoteDetail, CreateQuoteRequest, UpdateQuoteRequest, CreateQuoteDetailRequest, UpdateQuoteDetailRequest } from "../../interfaces/Quote.interface";

export class QuoteService {
  private client: typeof HttpClient;

  constructor(client: typeof HttpClient) {
    this.client = client;
  }

  async getAll(): Promise<Quote[]> {
    try {
      const request = await this.client.get("/quotes");
      return request.data as Quote[];
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async getById(id: number): Promise<Quote> {
    try {
      const request = await this.client.get(`/quotes/${id}`);
      return request.data as Quote;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async getBySupplierId(supplierId: number): Promise<Quote[]> {
    try {
      const request = await this.client.get(`/quotes/supplier/${supplierId}`);
      return request.data as Quote[];
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async create(data: CreateQuoteRequest): Promise<Quote> {
    try {
      const request = await this.client.post("/quotes", data);
      return request.data as Quote;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async update(id: number, data: UpdateQuoteRequest): Promise<Quote> {
    try {
      const request = await this.client.put(`/quotes/${id}`, data);
      return request.data as Quote;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.client.delete(`/quotes/${id}`);
    } catch (error) {
      throw new Error(error as string);
    }
  }

  // Quote Details methods
  async createDetail(data: CreateQuoteDetailRequest): Promise<QuoteDetail> {
    try {
      const request = await this.client.post("/quotes/details", data);
      return request.data as QuoteDetail;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async getDetailsByQuoteId(quoteId: number): Promise<QuoteDetail[]> {
    try {
      const request = await this.client.get(`/quotes/${quoteId}/details`);
      return request.data as QuoteDetail[];
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async getDetailById(id: number): Promise<QuoteDetail> {
    try {
      const request = await this.client.get(`/quotes/details/${id}`);
      return request.data as QuoteDetail;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async updateDetail(id: number, data: UpdateQuoteDetailRequest): Promise<QuoteDetail> {
    try {
      const request = await this.client.put(`/quotes/details/${id}`, data);
      return request.data as QuoteDetail;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async deleteDetail(id: number): Promise<void> {
    try {
      await this.client.delete(`/quotes/details/${id}`);
    } catch (error) {
      throw new Error(error as string);
    }
  }
}