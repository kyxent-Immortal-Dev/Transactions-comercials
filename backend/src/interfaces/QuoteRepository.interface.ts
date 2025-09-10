import { Quote, QuoteDetail, CreateQuoteRequest, UpdateQuoteRequest, CreateQuoteDetailRequest, UpdateQuoteDetailRequest } from "./Quote.interface";

export interface QuoteRepositoryInterface {
  create(data: CreateQuoteRequest): Promise<Quote>;
  findAll(): Promise<Quote[]>;
  findById(id: number): Promise<Quote | null>;
  findBySupplierId(supplierId: number): Promise<Quote[]>;
  update(id: number, data: UpdateQuoteRequest): Promise<Quote | null>;
  delete(id: number): Promise<boolean>;
  
  // Quote Details methods
  createDetail(data: CreateQuoteDetailRequest): Promise<QuoteDetail>;
  findDetailsByQuoteId(quoteId: number): Promise<QuoteDetail[]>;
  findDetailById(id: number): Promise<QuoteDetail | null>;
  updateDetail(id: number, data: UpdateQuoteDetailRequest): Promise<QuoteDetail | null>;
  deleteDetail(id: number): Promise<boolean>;
}