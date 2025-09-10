import { HttpClient } from "../http.client.service";
import type { LoginCredentials, LoginResponse } from "../../interfaces/Auth.interfaces";

export class AccountService {
  private httpClient: typeof HttpClient;

  constructor(httpClient: typeof HttpClient) {
    this.httpClient = httpClient;
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await this.httpClient.post("/login", credentials);
      return response.data;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async logout(): Promise<void> {
    try {
      // Clear token from localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async getProfile(): Promise<any> {
    try {
      const response = await this.httpClient.get("/accounts/profile");
      return response.data;
    } catch (error) {
      throw new Error(error as string);
    }
  }
}
