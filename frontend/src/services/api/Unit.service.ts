import { HttpClient } from "../http.client.service";
import { Unit, CreateUnitRequest, UpdateUnitRequest } from "../../interfaces/Unit.interface";

export class UnitService {
  private client: typeof HttpClient;

  constructor(client: typeof HttpClient) {
    this.client = client;
  }

  async getAll(): Promise<Unit[]> {
    try {
      const request = await this.client.get("/units");
      return request.data as Unit[];
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async getById(id: number): Promise<Unit> {
    try {
      const request = await this.client.get(`/units/${id}`);
      return request.data as Unit;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async create(data: CreateUnitRequest): Promise<Unit> {
    try {
      const request = await this.client.post("/units", data);
      return request.data as Unit;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async update(id: number, data: UpdateUnitRequest): Promise<Unit> {
    try {
      const request = await this.client.put(`/units/${id}`, data);
      return request.data as Unit;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.client.delete(`/units/${id}`);
    } catch (error) {
      throw new Error(error as string);
    }
  }
}