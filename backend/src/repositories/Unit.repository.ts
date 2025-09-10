import { PrismaClient } from '../generated/prisma';
import { UnitRepositoryInterface } from '../interfaces/UnitRepository.interface';
import { Unit, CreateUnitRequest, UpdateUnitRequest } from '../interfaces/Unit.interface';

export class UnitRepositoryImpl implements UnitRepositoryInterface {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findAll(): Promise<Unit[]> {
    return await this.prisma.units.findMany({
      orderBy: { name: 'asc' }
    });
  }

  async findById(id: number): Promise<Unit | null> {
    return await this.prisma.units.findUnique({
      where: { id }
    });
  }

  async create(unit: CreateUnitRequest): Promise<Unit> {
    return await this.prisma.units.create({
      data: unit
    });
  }

  async update(id: number, unit: UpdateUnitRequest): Promise<Unit | null> {
    try {
      return await this.prisma.units.update({
        where: { id },
        data: unit
      });
    } catch (error) {
      return null;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.prisma.units.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}