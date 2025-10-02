import { Supplier, CreateSupplierRequest, UpdateSupplierRequest } from './Supplier.interface';

export interface SupplierRepository {
  findAll(): Promise<Supplier[]>;
  findById(id: number): Promise<Supplier | null>;
  create(supplier: CreateSupplierRequest): Promise<Supplier>;
  update(id: number, supplier: UpdateSupplierRequest): Promise<Supplier | null>;
  delete(id: number): Promise<boolean>;
}