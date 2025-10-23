import { HttpClient } from "../http.client.service";
import type {
  Retaceo,
  CreateRetaceoRequest,
  UpdateRetaceoRequest,
  RetaceoDetail,
  CreateRetaceoDetailRequest,
  UpdateRetaceoDetailRequest
} from "../../interfaces/Retaceo.interface";

export class RetaceoService {
  private client: typeof HttpClient;

  constructor(client: typeof HttpClient) {
    this.client = client;
  }

  // Retaceo CRUD
  async getAll(): Promise<Retaceo[]> {
    try {
      const request = await this.client.get("/retaceos");
      return request.data as Retaceo[];
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async getById(id: number): Promise<Retaceo> {
    try {
      const request = await this.client.get(`/retaceos/${id}`);
      return request.data as Retaceo;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async getByPurchaseId(purchaseId: number): Promise<Retaceo[]> {
    try {
      const request = await this.client.get(`/retaceos/purchase/${purchaseId}`);
      return request.data as Retaceo[];
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async create(data: CreateRetaceoRequest): Promise<Retaceo> {
    try {
      const request = await this.client.post("/retaceos", data);
      return request.data as Retaceo;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async update(id: number, data: UpdateRetaceoRequest): Promise<Retaceo> {
    try {
      const request = await this.client.put(`/retaceos/${id}`, data);
      return request.data as Retaceo;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.client.delete(`/retaceos/${id}`);
    } catch (error) {
      throw new Error(error as string);
    }
  }

  // Retaceo Details CRUD
  async createDetail(data: CreateRetaceoDetailRequest): Promise<RetaceoDetail> {
    try {
      const request = await this.client.post("/retaceos/details", data);
      return request.data as RetaceoDetail;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async getDetailsByRetaceoId(retaceoId: number): Promise<RetaceoDetail[]> {
    try {
      const request = await this.client.get(`/retaceos/${retaceoId}/details`);
      return request.data as RetaceoDetail[];
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async getDetailById(id: number): Promise<RetaceoDetail> {
    try {
      const request = await this.client.get(`/retaceos/details/${id}`);
      return request.data as RetaceoDetail;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async updateDetail(id: number, data: UpdateRetaceoDetailRequest): Promise<RetaceoDetail> {
    try {
      const request = await this.client.put(`/retaceos/details/${id}`, data);
      return request.data as RetaceoDetail;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async deleteDetail(id: number): Promise<void> {
    try {
      await this.client.delete(`/retaceos/details/${id}`);
    } catch (error) {
      throw new Error(error as string);
    }
  }

  // Calcular retaceo automáticamente
  async calculateRetaceo(purchaseId: number): Promise<any> {
    try {
      const request = await this.client.post("/retaceos/calculate", { purchase_id: purchaseId });
      return request.data;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  // Crear retaceo con cálculo automático
  async createWithCalculation(data: { purchase_id: number; code?: string; num_invoice?: string; date?: string }): Promise<any> {
    try {
      const request = await this.client.post("/retaceos/create-with-calculation", data);
      return request.data;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  // Aprobar retaceo y actualizar precios
  async approveRetaceo(id: number): Promise<any> {
    try {
      const request = await this.client.post(`/retaceos/${id}/approve`);
      return request.data;
    } catch (error) {
      throw new Error(error as string);
    }
  }
}
