export interface Client {
  id?: number;
  name?: string;
  lastname?: string;
  email?: string;
  phone?: string;
  address?: string;
  company?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateClientRequest {
  name?: string;
  lastname?: string;
  email?: string;
  phone?: string;
  address?: string;
  company?: string;
  isActive?: boolean;
}

export interface UpdateClientRequest {
  name?: string;
  lastname?: string;
  email?: string;
  phone?: string;
  address?: string;
  company?: string;
  isActive?: boolean;
}