export interface Supplier {
  id?: number;
  name?: string;
  country?: string;
  address?: string;
  phone?: string;
  email?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateSupplierRequest {
  name?: string;
  country?: string;
  address?: string;
  phone?: string;
  email?: string;
  isActive?: boolean;
}

export interface UpdateSupplierRequest {
  name?: string;
  country?: string;
  address?: string;
  phone?: string;
  email?: string;
  isActive?: boolean;
}