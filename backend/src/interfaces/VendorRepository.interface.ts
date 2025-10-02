import { Vendor, CreateVendorRequest, UpdateVendorRequest } from './Vendor.interface';

export interface VendorRepository {
  findAll(): Promise<Vendor[]>;
  findById(id: number): Promise<Vendor | null>;
  create(vendor: CreateVendorRequest): Promise<Vendor>;
  update(id: number, vendor: UpdateVendorRequest): Promise<Vendor | null>;
  delete(id: number): Promise<boolean>;
}