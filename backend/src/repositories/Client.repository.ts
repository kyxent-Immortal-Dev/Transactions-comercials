import { PrismaClient } from '../generated/prisma';
import { ClientRepository } from '../interfaces/ClientRepository.interface';
import { Client, CreateClientRequest, UpdateClientRequest } from '../interfaces/Client.interface';

export class ClientRepositoryImpl implements ClientRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findAll(): Promise<Client[]> {
    return await this.prisma.clients.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async findById(id: number): Promise<Client | null> {
    return await this.prisma.clients.findUnique({
      where: { id }
    });
  }

  async create(client: CreateClientRequest): Promise<Client> {
    return await this.prisma.clients.create({
      data: client
    });
  }

  async update(id: number, client: UpdateClientRequest): Promise<Client | null> {
    try {
      return await this.prisma.clients.update({
        where: { id },
        data: client
      });
    } catch (error) {
      return null;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.prisma.clients.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}