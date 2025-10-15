import { PrismaClient } from '../generated/prisma';
import type {
  Retaceo,
  RetaceoDetail,
  CreateRetaceoRequest,
  UpdateRetaceoRequest,
  CreateRetaceoDetailRequest,
  UpdateRetaceoDetailRequest,
} from '../interfaces/Retaceo.interface';

export class RetaceoRepository {
  private prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
  }

  async findAll(): Promise<Retaceo[]> {
    return await this.prisma.retaceo.findMany({
      include: { 
        retaceo_details: { include: { product: true } }, 
        purchase: { include: { supplier: true, buy_order: true } }
      },
      orderBy: { date: 'desc' }
    }) as unknown as Retaceo[];
  }

  async findById(id: number): Promise<Retaceo | null> {
    return await this.prisma.retaceo.findUnique({
      where: { id },
      include: { 
        retaceo_details: { include: { product: true } }, 
        purchase: { include: { supplier: true, buy_order: true } }
      }
    }) as unknown as Retaceo | null;
  }

  async findByPurchaseId(purchase_id: number): Promise<Retaceo[]> {
    return await this.prisma.retaceo.findMany({
      where: { purchase_id },
      include: { 
        retaceo_details: { include: { product: true } }, 
        purchase: { include: { supplier: true, buy_order: true } }
      },
      orderBy: { date: 'desc' }
    }) as unknown as Retaceo[];
  }

  async create(data: CreateRetaceoRequest): Promise<Retaceo> {
    return await this.prisma.retaceo.create({
      data: {
        code: data.code ?? null,
        num_invoice: data.num_invoice ?? null,
        date: data.date ? new Date(data.date) : new Date(),
        status: data.status ?? 'pending',
        purchase_id: data.purchase_id,
      },
      include: { 
        retaceo_details: { include: { product: true } }, 
        purchase: { include: { supplier: true, buy_order: true } }
      }
    }) as unknown as Retaceo;
  }

  async update(id: number, data: UpdateRetaceoRequest): Promise<Retaceo | null> {
    try {
      return await this.prisma.retaceo.update({
        where: { id }, 
        data: {
          ...(data.code !== undefined && { code: data.code }),
          ...(data.num_invoice !== undefined && { num_invoice: data.num_invoice }),
          ...(data.date !== undefined && { date: data.date ? new Date(data.date) : undefined }),
          ...(data.status !== undefined && { status: data.status }),
          ...(data.purchase_id !== undefined && { purchase_id: data.purchase_id }),
        },
        include: { 
          retaceo_details: { include: { product: true } }, 
          purchase: { include: { supplier: true, buy_order: true } }
        }
      }) as unknown as Retaceo;
    } catch {
      return null;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.prisma.retaceo.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  // Details
  async createDetail(data: CreateRetaceoDetailRequest): Promise<RetaceoDetail> {
    return await this.prisma.retaceo_details.create({
      data: {
        retaceo_id: data.retaceo_id,
        product_id: data.product_id,
        quantity: data.quantity ?? null,
        price: data.price ?? null,
        status: data.status ?? 'pending',
      },
      include: { product: true }
    }) as unknown as RetaceoDetail;
  }

  async findDetailsByRetaceoId(retaceo_id: number): Promise<RetaceoDetail[]> {
    return await this.prisma.retaceo_details.findMany({
      where: { retaceo_id },
      include: { product: true }
    }) as unknown as RetaceoDetail[];
  }

  async findDetailById(id: number): Promise<RetaceoDetail | null> {
    return await this.prisma.retaceo_details.findUnique({
      where: { id },
      include: { product: true }
    }) as unknown as RetaceoDetail | null;
  }

  async updateDetail(id: number, data: UpdateRetaceoDetailRequest): Promise<RetaceoDetail | null> {
    try {
      return await this.prisma.retaceo_details.update({
        where: { id }, 
        data: {
          ...(data.product_id !== undefined && { product_id: data.product_id }),
          ...(data.quantity !== undefined && { quantity: data.quantity }),
          ...(data.price !== undefined && { price: data.price }),
          ...(data.status !== undefined && { status: data.status }),
        },
        include: { product: true }
      }) as unknown as RetaceoDetail;
    } catch {
      return null;
    }
  }

  async deleteDetail(id: number): Promise<boolean> {
    try {
      await this.prisma.retaceo_details.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}
