import { PrismaClient } from '../generated/prisma';
import type { QuoteRepositoryInterface } from '../interfaces/QuoteRepository.interface';
import type { Quote, QuoteDetail, CreateQuoteRequest, UpdateQuoteRequest, CreateQuoteDetailRequest, UpdateQuoteDetailRequest } from '../interfaces/Quote.interface';

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
    }) as unknown as Quote[];
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
    }) as unknown as Quote | null;
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
    }) as unknown as Quote[];
  }

  async create(quote: CreateQuoteRequest): Promise<Quote> {
    if (!quote.code || quote.code.trim() === '') {
      const created = await this.prisma.quotes.create({
        data: {
          supplier_id: quote.supplier_id,
          status: quote.status || 'pending',
        },
        include: {
          supplier: true,
          quote_details: { include: { product: true } }
        }
      });

      const now = new Date();
      const year = now.getFullYear().toString().slice(-2);
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const paddedId = created.id.toString().padStart(4, '0');
      const generatedCode = `COT-${year}${month}-${paddedId}`;

      const updated = await this.prisma.quotes.update({
        where: { id: created.id },
        data: { code: generatedCode },
        include: {
          supplier: true,
          quote_details: { include: { product: true } }
        }
      });

  return updated as unknown as Quote;
    }

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
    }) as unknown as Quote;
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
      }) as unknown as Quote;
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

  async createDetail(detail: CreateQuoteDetailRequest): Promise<QuoteDetail> {
    return await this.prisma.quote_details.create({
      data: detail,
      include: {
        product: true
      }
    }) as unknown as QuoteDetail;
  }

  async findDetailsByQuoteId(quoteId: number): Promise<QuoteDetail[]> {
    return await this.prisma.quote_details.findMany({
      where: { quote_id: quoteId },
      include: {
        product: true
      }
    }) as unknown as QuoteDetail[];
  }

  async findDetailById(id: number): Promise<QuoteDetail | null> {
    return await this.prisma.quote_details.findUnique({
      where: { id },
      include: {
        product: true
      }
    }) as unknown as QuoteDetail | null;
  }

  async updateDetail(id: number, detail: UpdateQuoteDetailRequest): Promise<QuoteDetail | null> {
    try {
      return await this.prisma.quote_details.update({
        where: { id },
        data: detail,
        include: {
          product: true
        }
      }) as unknown as QuoteDetail;
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