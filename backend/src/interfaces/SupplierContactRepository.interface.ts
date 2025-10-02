import { SupplierContact, CreateSupplierContactRequest, UpdateSupplierContactRequest } from "./SupplierContact.interface";

export interface SupplierContactRepositoryInterface {
  create(data: CreateSupplierContactRequest): Promise<SupplierContact>;
  findAll(): Promise<SupplierContact[]>;
  findById(id: number): Promise<SupplierContact | null>;
  findBySupplierId(supplierId: number): Promise<SupplierContact[]>;
  update(id: number, data: UpdateSupplierContactRequest): Promise<SupplierContact | null>;
  delete(id: number): Promise<boolean>;
}