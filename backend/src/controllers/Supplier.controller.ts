import { Request, Response } from 'express';
import { SupplierRepositoryImpl } from '../repositories/Supplier.repository';
import { CreateSupplierRequest, UpdateSupplierRequest } from '../interfaces/Supplier.interface';

export class SupplierController {
  private supplierRepository: SupplierRepositoryImpl;

  constructor() {
    this.supplierRepository = new SupplierRepositoryImpl();
  }

  async getAllSuppliers(req: Request, res: Response): Promise<void> {
    try {
      const suppliers = await this.supplierRepository.findAll();
      res.json(suppliers);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching suppliers' });
    }
  }

  async getSupplierById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const supplier = await this.supplierRepository.findById(id);
      
      if (!supplier) {
        res.status(404).json({ error: 'Supplier not found' });
        return;
      }
      
      res.json(supplier);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching supplier' });
    }
  }

  async createSupplier(req: Request, res: Response): Promise<void> {
    try {
      const supplierData: CreateSupplierRequest = req.body;
      const supplier = await this.supplierRepository.create(supplierData);
      res.status(201).json(supplier);
    } catch (error) {
      res.status(500).json({ error: 'Error creating supplier' });
    }
  }

  async updateSupplier(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const supplierData: UpdateSupplierRequest = req.body;
      const supplier = await this.supplierRepository.update(id, supplierData);
      
      if (!supplier) {
        res.status(404).json({ error: 'Supplier not found' });
        return;
      }
      
      res.json(supplier);
    } catch (error) {
      res.status(500).json({ error: 'Error updating supplier' });
    }
  }

  async deleteSupplier(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const success = await this.supplierRepository.delete(id);
      
      if (!success) {
        res.status(404).json({ error: 'Supplier not found' });
        return;
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error deleting supplier' });
    }
  }
}