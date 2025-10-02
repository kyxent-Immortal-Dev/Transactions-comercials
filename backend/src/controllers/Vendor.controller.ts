import { Request, Response } from 'express';
import { VendorRepositoryImpl } from '../repositories/Vendor.repository';
import { CreateVendorRequest, UpdateVendorRequest } from '../interfaces/Vendor.interface';

export class VendorController {
  private vendorRepository: VendorRepositoryImpl;

  constructor() {
    this.vendorRepository = new VendorRepositoryImpl();
  }

  async getAllVendors(req: Request, res: Response): Promise<void> {
    try {
      const vendors = await this.vendorRepository.findAll();
      res.json(vendors);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      res.status(500).json({ 
        error: 'Error fetching vendors',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getVendorById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const vendor = await this.vendorRepository.findById(id);
      
      if (!vendor) {
        res.status(404).json({ error: 'Vendor not found' });
        return;
      }
      
      res.json(vendor);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching vendor' });
    }
  }

  async createVendor(req: Request, res: Response): Promise<void> {
    try {
      const vendorData: CreateVendorRequest = req.body;
      const vendor = await this.vendorRepository.create(vendorData);
      res.status(201).json(vendor);
    } catch (error) {
      console.error('Error creating vendor:', error);
      res.status(500).json({ 
        error: 'Error creating vendor',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async updateVendor(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const vendorData: UpdateVendorRequest = req.body;
      const vendor = await this.vendorRepository.update(id, vendorData);
      
      if (!vendor) {
        res.status(404).json({ error: 'Vendor not found' });
        return;
      }
      
      res.json(vendor);
    } catch (error) {
      res.status(500).json({ error: 'Error updating vendor' });
    }
  }

  async deleteVendor(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const success = await this.vendorRepository.delete(id);
      
      if (!success) {
        res.status(404).json({ error: 'Vendor not found' });
        return;
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error deleting vendor' });
    }
  }
}