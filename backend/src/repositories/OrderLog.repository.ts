import { PrismaClient } from '../generated/prisma';
import type { OrderLog, CreateOrderLogRequest, UpdateOrderLogRequest } from '../interfaces/Retaceo.interface';

export class OrderLogRepository {
  private prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
  }

  async findAll(): Promise<OrderLog[]> {
    return await this.prisma.order_log.findMany({ orderBy: { date: 'desc' } }) as unknown as OrderLog[];
  }

  async findById(id: number): Promise<OrderLog | null> {
    return await this.prisma.order_log.findUnique({ where: { id } }) as unknown as OrderLog | null;
  }

  async findByBuyOrderId(buy_order_id: number): Promise<OrderLog[]> {
    return await this.prisma.order_log.findMany({ where: { buy_order_id }, orderBy: { date: 'desc' } }) as unknown as OrderLog[];
  }

  async create(data: CreateOrderLogRequest): Promise<OrderLog> {
    const payload = {
      buy_order_id: data.buy_order_id,
      date: data.date,
      item: data.item,
      value: data.value,
      expense_type: data.expense_type,
    };
    return await this.prisma.order_log.create({ data: payload }) as unknown as OrderLog;
  }

  async update(id: number, data: UpdateOrderLogRequest): Promise<OrderLog | null> {
    try {
      const payload = {
        buy_order_id: data.buy_order_id,
        date: data.date,
        item: data.item,
        value: data.value,
        expense_type: data.expense_type,
      };
      return await this.prisma.order_log.update({ where: { id }, data: payload }) as unknown as OrderLog;
    } catch {
      return null;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.prisma.order_log.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}
