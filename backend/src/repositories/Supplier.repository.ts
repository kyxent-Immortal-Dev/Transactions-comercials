import { PrismaClient } from '../generated/prisma';
import { SupplierRepository } from '../interfaces/SupplierRepository.interface';
import { Supplier, CreateSupplierRequest, UpdateSupplierRequest } from '../interfaces/Supplier.interface';

export class SupplierRepositoryImpl implements SupplierRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findAll(): Promise<Supplier[]> {
    return await this.prisma.suppliers.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async findById(id: number): Promise<Supplier | null> {
    return await this.prisma.suppliers.findUnique({
      where: { id }
    });
  }

  async create(supplier: CreateSupplierRequest): Promise<Supplier> {
    return await this.prisma.suppliers.create({
      data: supplier
    });
  }

  async update(id: number, supplier: UpdateSupplierRequest): Promise<Supplier | null> {
    try {
      return await this.prisma.suppliers.update({
        where: { id },
        data: supplier
      });
    } catch (error) {
      return null;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.prisma.suppliers.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}