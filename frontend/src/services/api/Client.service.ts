import { HttpClient } from "../http.client.service";
import { Client, CreateClientRequest, UpdateClientRequest } from "../../interfaces/Client.interface";

export class ClientService {
  private client: typeof HttpClient;

  constructor(client: typeof HttpClient) {
    this.client = client;
  }

  async getAll(): Promise<Client[]> {
    try {
      const request = await this.client.get("/clients");
      return request.data as Client[];
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async getById(id: number): Promise<Client> {
    try {
      const request = await this.client.get(`/clients/${id}`);
      return request.data as Client;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async create(data: CreateClientRequest): Promise<Client> {
    try {
      const request = await this.client.post("/clients", data);
      return request.data as Client;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async update(id: number, data: UpdateClientRequest): Promise<Client> {
    try {
      const request = await this.client.put(`/clients/${id}`, data);
      return request.data as Client;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.client.delete(`/clients/${id}`);
    } catch (error) {
      throw new Error(error as string);
    }
  }
}