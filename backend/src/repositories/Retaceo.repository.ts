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
      include: { retaceo_details: { include: { product: true } }, supplier: true, buy_order: true },
      orderBy: { date: 'desc' }
    }) as unknown as Retaceo[];
  }

  async findById(id: number): Promise<Retaceo | null> {
    return await this.prisma.retaceo.findUnique({
      where: { id },
      include: { retaceo_details: { include: { product: true } }, supplier: true, buy_order: true }
    }) as unknown as Retaceo | null;
  }

  async findByBuyOrderId(buy_order_id: number): Promise<Retaceo[]> {
    return await this.prisma.retaceo.findMany({
      where: { buy_order_id },
      include: { retaceo_details: { include: { product: true } }, supplier: true, buy_order: true },
      orderBy: { date: 'desc' }
    }) as unknown as Retaceo[];
  }

  async create(data: CreateRetaceoRequest): Promise<Retaceo> {
    return await this.prisma.retaceo.create({
      data: {
        code: data.code,
        buy_order_id: data.buy_order_id ?? null,
        supplier_id: data.supplier_id,
        invoice_number: data.invoice_number ?? null,
        invoice_date: data.invoice_date ?? null,
        policy_number: data.policy_number ?? null,
        policy_date: data.policy_date ?? null,
        fob_total: data.fob_total,
        freight: data.freight,
        insurance: data.insurance,
        dai: data.dai,
        other_expenses: data.other_expenses,
        iva_percentage: data.iva_percentage ?? undefined,
        iva_amount: data.iva_amount ?? undefined,
        cif_total: data.cif_total ?? undefined,
      },
      include: { retaceo_details: { include: { product: true } }, supplier: true, buy_order: true }
    }) as unknown as Retaceo;
  }

  async update(id: number, data: UpdateRetaceoRequest): Promise<Retaceo | null> {
    try {
      return await this.prisma.retaceo.update({
        where: { id }, data: {
          code: data.code,
          buy_order_id: data.buy_order_id,
          supplier_id: data.supplier_id,
          invoice_number: data.invoice_number,
          invoice_date: data.invoice_date,
          policy_number: data.policy_number,
          policy_date: data.policy_date,
          fob_total: data.fob_total,
          freight: data.freight,
          insurance: data.insurance,
          dai: data.dai,
          other_expenses: data.other_expenses,
          ...(data.iva_percentage !== undefined && data.iva_percentage !== null ? { iva_percentage: data.iva_percentage } : {}),
          ...(data.iva_amount !== undefined && data.iva_amount !== null ? { iva_amount: data.iva_amount } : {}),
          ...(data.cif_total !== undefined && data.cif_total !== null ? { cif_total: data.cif_total } : {}),
        },
        include: { retaceo_details: { include: { product: true } }, supplier: true, buy_order: true }
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
        quantity: data.quantity,
        fob_cost: data.fob_cost,
        freight_cost: data.freight_cost,
        freight_percent: data.freight_percent,
        expenses_cost: data.expenses_cost,
        expenses_percent: data.expenses_percent,
        dai_cost: data.dai_cost,
        dai_percent: data.dai_percent,
        unit_cost: data.unit_cost,
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
        where: { id }, data: {
          quantity: data.quantity,
          fob_cost: data.fob_cost,
          freight_cost: data.freight_cost,
          freight_percent: data.freight_percent,
          expenses_cost: data.expenses_cost,
          expenses_percent: data.expenses_percent,
          dai_cost: data.dai_cost,
          dai_percent: data.dai_percent,
          unit_cost: data.unit_cost,
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
