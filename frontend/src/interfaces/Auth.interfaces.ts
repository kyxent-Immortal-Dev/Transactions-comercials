export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  msj: string;
  data: string; // JWT token
}

export interface User {
  id: number;
  email: string;
  name?: string;
  role?: string;
}

export interface AuthState {
  isLogged: boolean;
  user: User | null;
  token: string | null;
} 