import { PrismaClient } from '../generated/prisma';
import type { ExpenseType, CreateExpenseTypeRequest, UpdateExpenseTypeRequest } from '../interfaces/Retaceo.interface';

export class ExpenseTypeRepository {
  private prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
  }

  async findAll(): Promise<ExpenseType[]> {
  return await this.prisma.expense_types.findMany({ orderBy: { name: 'asc' } }) as unknown as ExpenseType[];
  }

  async findById(id: number): Promise<ExpenseType | null> {
  return await this.prisma.expense_types.findUnique({ where: { id } }) as unknown as ExpenseType | null;
  }

  async create(data: CreateExpenseTypeRequest): Promise<ExpenseType> {
    const payload = {
      name: data.name,
      description: data.description ?? undefined,
      is_required: data.is_required ?? undefined,
    };
    return await this.prisma.expense_types.create({ data: payload }) as unknown as ExpenseType;
  }

  async update(id: number, data: UpdateExpenseTypeRequest): Promise<ExpenseType | null> {
    try {
      const payload = {
        name: data.name,
        description: data.description ?? undefined,
        is_required: data.is_required ?? undefined,
      };
      return await this.prisma.expense_types.update({ where: { id }, data: payload }) as unknown as ExpenseType;
    } catch {
      return null;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
  await this.prisma.expense_types.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}
