import { PrismaClient } from '../generated/prisma';
import type {
  Purchase,
  PurchaseDetail,
  CreatePurchaseRequest,
  UpdatePurchaseRequest,
  CreatePurchaseDetailRequest,
  UpdatePurchaseDetailRequest,
} from '../interfaces/Purchase.interface';

export class PurchaseRepository {
  private prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
  }

  async findAll(): Promise<Purchase[]> {
    return await this.prisma.purchase.findMany({
      include: { 
        purchase_details: { include: { product: true } }, 
        supplier: true, 
        buy_order: true 
      },
      orderBy: { date: 'desc' }
    }) as unknown as Purchase[];
  }

  async findById(id: number): Promise<Purchase | null> {
    return await this.prisma.purchase.findUnique({
      where: { id },
      include: { 
        purchase_details: { include: { product: true } }, 
        supplier: true, 
        buy_order: true 
      }
    }) as unknown as Purchase | null;
  }

  async findByBuyOrderId(buy_order_id: number): Promise<Purchase[]> {
    return await this.prisma.purchase.findMany({
      where: { buy_order_id },
      include: { 
        purchase_details: { include: { product: true } }, 
        supplier: true, 
        buy_order: true 
      },
      orderBy: { date: 'desc' }
    }) as unknown as Purchase[];
  }

  async create(data: CreatePurchaseRequest): Promise<Purchase> {
    return await this.prisma.purchase.create({
      data: {
        code: data.code ?? null,
        status: data.status ?? 'pending',
        date: data.date ? new Date(data.date) : new Date(),
        num_invoice: data.num_invoice ?? null,
        buy_order_id: data.buy_order_id,
        supplier_id: data.supplier_id,
      },
      include: { 
        purchase_details: { include: { product: true } }, 
        supplier: true, 
        buy_order: true 
      }
    }) as unknown as Purchase;
  }

  async update(id: number, data: UpdatePurchaseRequest): Promise<Purchase | null> {
    try {
      return await this.prisma.purchase.update({
        where: { id }, 
        data: {
          ...(data.code !== undefined && { code: data.code }),
          ...(data.status !== undefined && { status: data.status }),
          ...(data.date !== undefined && { date: data.date ? new Date(data.date) : undefined }),
          ...(data.num_invoice !== undefined && { num_invoice: data.num_invoice }),
          ...(data.buy_order_id !== undefined && { buy_order_id: data.buy_order_id }),
          ...(data.supplier_id !== undefined && { supplier_id: data.supplier_id }),
        },
        include: { 
          purchase_details: { include: { product: true } }, 
          supplier: true, 
          buy_order: true 
        }
      }) as unknown as Purchase;
    } catch {
      return null;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.prisma.purchase.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  // Details
  async createDetail(data: CreatePurchaseDetailRequest): Promise<PurchaseDetail> {
    return await this.prisma.purchase_details.create({
      data: {
        purchase_id: data.purchase_id,
        product_id: data.product_id,
        quantity: data.quantity ?? null,
        price: data.price ?? null,
        unit: data.unit ?? null,
        status: data.status ?? 'pending',
      },
      include: { product: true }
    }) as unknown as PurchaseDetail;
  }

  async findDetailsByPurchaseId(purchase_id: number): Promise<PurchaseDetail[]> {
    return await this.prisma.purchase_details.findMany({
      where: { purchase_id },
      include: { product: true }
    }) as unknown as PurchaseDetail[];
  }

  async findDetailById(id: number): Promise<PurchaseDetail | null> {
    return await this.prisma.purchase_details.findUnique({
      where: { id },
      include: { product: true }
    }) as unknown as PurchaseDetail | null;
  }

  async updateDetail(id: number, data: UpdatePurchaseDetailRequest): Promise<PurchaseDetail | null> {
    try {
      return await this.prisma.purchase_details.update({
        where: { id }, 
        data: {
          ...(data.product_id !== undefined && { product_id: data.product_id }),
          ...(data.quantity !== undefined && { quantity: data.quantity }),
          ...(data.price !== undefined && { price: data.price }),
          ...(data.unit !== undefined && { unit: data.unit }),
          ...(data.status !== undefined && { status: data.status }),
        },
        include: { product: true }
      }) as unknown as PurchaseDetail;
    } catch {
      return null;
    }
  }

  async deleteDetail(id: number): Promise<boolean> {
    try {
      await this.prisma.purchase_details.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}
