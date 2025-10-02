import { PrismaClient } from '../generated/prisma';
import { VendorRepository } from '../interfaces/VendorRepository.interface';
import { Vendor, CreateVendorRequest, UpdateVendorRequest } from '../interfaces/Vendor.interface';

export class VendorRepositoryImpl implements VendorRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findAll(): Promise<Vendor[]> {
    return await this.prisma.vendors.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async findById(id: number): Promise<Vendor | null> {
    return await this.prisma.vendors.findUnique({
      where: { id }
    });
  }

  async create(vendor: CreateVendorRequest): Promise<Vendor> {
    return await this.prisma.vendors.create({
      data: vendor
    });
  }

  async update(id: number, vendor: UpdateVendorRequest): Promise<Vendor | null> {
    try {
      return await this.prisma.vendors.update({
        where: { id },
        data: vendor
      });
    } catch (error) {
      return null;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.prisma.vendors.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}