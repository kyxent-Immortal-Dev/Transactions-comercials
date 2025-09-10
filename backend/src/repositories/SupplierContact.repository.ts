import { PrismaClient } from '../generated/prisma';
import { SupplierContactRepositoryInterface } from '../interfaces/SupplierContactRepository.interface';
import { SupplierContact, CreateSupplierContactRequest, UpdateSupplierContactRequest } from '../interfaces/SupplierContact.interface';

export class SupplierContactRepositoryImpl implements SupplierContactRepositoryInterface {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findAll(): Promise<SupplierContact[]> {
    return await this.prisma.supplier_contacts.findMany({
      include: {
        supplier: true
      }
    });
  }

  async findById(id: number): Promise<SupplierContact | null> {
    return await this.prisma.supplier_contacts.findUnique({
      where: { id },
      include: {
        supplier: true
      }
    });
  }

  async findBySupplierId(supplierId: number): Promise<SupplierContact[]> {
    return await this.prisma.supplier_contacts.findMany({
      where: { supplier_id: supplierId },
      include: {
        supplier: true
      }
    });
  }

  async create(contact: CreateSupplierContactRequest): Promise<SupplierContact> {
    return await this.prisma.supplier_contacts.create({
      data: contact,
      include: {
        supplier: true
      }
    });
  }

  async update(id: number, contact: UpdateSupplierContactRequest): Promise<SupplierContact | null> {
    try {
      return await this.prisma.supplier_contacts.update({
        where: { id },
        data: contact,
        include: {
          supplier: true
        }
      });
    } catch (error) {
      return null;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.prisma.supplier_contacts.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}