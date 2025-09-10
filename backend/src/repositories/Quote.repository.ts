import { PrismaClient } from '../generated/prisma';
import { QuoteRepositoryInterface } from '../interfaces/QuoteRepository.interface';
import { Quote, QuoteDetail, CreateQuoteRequest, UpdateQuoteRequest, CreateQuoteDetailRequest, UpdateQuoteDetailRequest } from '../interfaces/Quote.interface';

export class QuoteRepositoryImpl implements QuoteRepositoryInterface {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findAll(): Promise<Quote[]> {
    return await this.prisma.quotes.findMany({
      include: {
        supplier: true,
        quote_details: {
          include: {
            product: true
          }
        }
      },
      orderBy: { date: 'desc' }
    });
  }

  async findById(id: number): Promise<Quote | null> {
    return await this.prisma.quotes.findUnique({
      where: { id },
      include: {
        supplier: true,
        quote_details: {
          include: {
            product: true
          }
        }
      }
    });
  }

  async findBySupplierId(supplierId: number): Promise<Quote[]> {
    return await this.prisma.quotes.findMany({
      where: { supplier_id: supplierId },
      include: {
        supplier: true,
        quote_details: {
          include: {
            product: true
          }
        }
      },
      orderBy: { date: 'desc' }
    });
  }

  async create(quote: CreateQuoteRequest): Promise<Quote> {
    return await this.prisma.quotes.create({
      data: quote,
      include: {
        supplier: true,
        quote_details: {
          include: {
            product: true
          }
        }
      }
    });
  }

  async update(id: number, quote: UpdateQuoteRequest): Promise<Quote | null> {
    try {
      return await this.prisma.quotes.update({
        where: { id },
        data: quote,
        include: {
          supplier: true,
          quote_details: {
            include: {
              product: true
            }
          }
        }
      });
    } catch (error) {
      return null;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.prisma.quotes.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  // Quote Details methods
  async createDetail(detail: CreateQuoteDetailRequest): Promise<QuoteDetail> {
    return await this.prisma.quote_details.create({
      data: detail,
      include: {
        product: true
      }
    });
  }

  async findDetailsByQuoteId(quoteId: number): Promise<QuoteDetail[]> {
    return await this.prisma.quote_details.findMany({
      where: { quote_id: quoteId },
      include: {
        product: true
      }
    });
  }

  async findDetailById(id: number): Promise<QuoteDetail | null> {
    return await this.prisma.quote_details.findUnique({
      where: { id },
      include: {
        product: true
      }
    });
  }

  async updateDetail(id: number, detail: UpdateQuoteDetailRequest): Promise<QuoteDetail | null> {
    try {
      return await this.prisma.quote_details.update({
        where: { id },
        data: detail,
        include: {
          product: true
        }
      });
    } catch (error) {
      return null;
    }
  }

  async deleteDetail(id: number): Promise<boolean> {
    try {
      await this.prisma.quote_details.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}