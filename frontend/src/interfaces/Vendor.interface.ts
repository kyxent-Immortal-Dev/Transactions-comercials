export interface Vendor {
  id?: number;
  name?: string;
  lastname?: string;
  email?: string;
  phone?: string;
  address?: string;
  commission?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateVendorRequest {
  name?: string;
  lastname?: string;
  email?: string;
  phone?: string;
  address?: string;
  commission?: number;
  isActive?: boolean;
}

export interface UpdateVendorRequest {
  name?: string;
  lastname?: string;
  email?: string;
  phone?: string;
  address?: string;
  commission?: number;
  isActive?: boolean;
}