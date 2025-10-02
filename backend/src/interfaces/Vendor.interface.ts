export interface Vendor {
  id?: number;
  name?: string;
  lastname?: string;
  email?: string;
  phone?: string;
  address?: string;
  commission?: number;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
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