import { Request, Response } from 'express';
import { SupplierContactRepositoryImpl } from '../repositories/SupplierContact.repository';
import { CreateSupplierContactRequest, UpdateSupplierContactRequest } from '../interfaces/SupplierContact.interface';

export class SupplierContactController {
  private supplierContactRepository: SupplierContactRepositoryImpl;

  constructor() {
    this.supplierContactRepository = new SupplierContactRepositoryImpl();
  }

  async getAllSupplierContacts(req: Request, res: Response): Promise<void> {
    try {
      const contacts = await this.supplierContactRepository.findAll();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching supplier contacts' });
    }
  }

  async getSupplierContactById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const contact = await this.supplierContactRepository.findById(id);
      
      if (!contact) {
        res.status(404).json({ error: 'Supplier contact not found' });
        return;
      }
      
      res.json(contact);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching supplier contact' });
    }
  }

  async getSupplierContactsBySupplierId(req: Request, res: Response): Promise<void> {
    try {
      const supplierId = parseInt(req.params.supplierId);
      const contacts = await this.supplierContactRepository.findBySupplierId(supplierId);
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching supplier contacts' });
    }
  }

  async createSupplierContact(req: Request, res: Response): Promise<void> {
    try {
      const contactData: CreateSupplierContactRequest = req.body;
      const contact = await this.supplierContactRepository.create(contactData);
      res.status(201).json(contact);
    } catch (error) {
      res.status(500).json({ error: 'Error creating supplier contact' });
    }
  }

  async updateSupplierContact(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const contactData: UpdateSupplierContactRequest = req.body;
      const contact = await this.supplierContactRepository.update(id, contactData);
      
      if (!contact) {
        res.status(404).json({ error: 'Supplier contact not found' });
        return;
      }
      
      res.json(contact);
    } catch (error) {
      res.status(500).json({ error: 'Error updating supplier contact' });
    }
  }

  async deleteSupplierContact(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const success = await this.supplierContactRepository.delete(id);
      
      if (!success) {
        res.status(404).json({ error: 'Supplier contact not found' });
        return;
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error deleting supplier contact' });
    }
  }
}