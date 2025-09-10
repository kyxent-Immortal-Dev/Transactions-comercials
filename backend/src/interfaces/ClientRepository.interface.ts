import { Client, CreateClientRequest, UpdateClientRequest } from './Client.interface';

export interface ClientRepository {
  findAll(): Promise<Client[]>;
  findById(id: number): Promise<Client | null>;
  create(client: CreateClientRequest): Promise<Client>;
  update(id: number, client: UpdateClientRequest): Promise<Client | null>;
  delete(id: number): Promise<boolean>;
}