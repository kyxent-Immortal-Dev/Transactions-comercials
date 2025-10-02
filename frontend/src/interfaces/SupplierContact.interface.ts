import { Supplier } from './Supplier.interface';

export interface SupplierContact {
  id?: number;
  supplier_id: number;
  name?: string;
  lastname?: string;
  phone?: string;
  email?: string;
  supplier?: Supplier;
}

export interface CreateSupplierContactRequest {
  supplier_id: number;
  name?: string;
  lastname?: string;
  phone?: string;
  email?: string;
}

export interface UpdateSupplierContactRequest {
  name?: string;
  lastname?: string;
  phone?: string;
  email?: string;
}