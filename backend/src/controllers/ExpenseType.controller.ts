import type { Request, Response } from 'express';
import { ExpenseTypeRepository } from '../repositories/ExpenseType.repository';
import type { CreateExpenseTypeRequest, UpdateExpenseTypeRequest } from '../interfaces/Retaceo.interface';

export class ExpenseTypeController {
  private repo: ExpenseTypeRepository;
  constructor() { this.repo = new ExpenseTypeRepository(); }

  async getAll(req: Request, res: Response) {
    try { res.json(await this.repo.findAll()); } catch { res.status(500).json({ error: 'Error fetching expense types' }); }
  }
  async getById(req: Request, res: Response) {
    try {
  const id = parseInt(req.params.id as string);
      const item = await this.repo.findById(id);
      if (!item) return res.status(404).json({ error: 'Not found' });
      res.json(item);
    } catch { res.status(500).json({ error: 'Error fetching expense type' }); }
  }
  async create(req: Request, res: Response) {
    try {
      const data: CreateExpenseTypeRequest = req.body;
      const created = await this.repo.create(data);
      res.status(201).json(created);
    } catch { res.status(500).json({ error: 'Error creating expense type' }); }
  }
  async update(req: Request, res: Response) {
    try {
  const id = parseInt(req.params.id as string);
      const data: UpdateExpenseTypeRequest = req.body;
      const updated = await this.repo.update(id, data);
      if (!updated) return res.status(404).json({ error: 'Not found' });
      res.json(updated);
    } catch { res.status(500).json({ error: 'Error updating expense type' }); }
  }
  async delete(req: Request, res: Response) {
    try {
  const id = parseInt(req.params.id as string);
      const ok = await this.repo.delete(id);
      if (!ok) return res.status(404).json({ error: 'Not found' });
      res.status(204).send();
    } catch { res.status(500).json({ error: 'Error deleting expense type' }); }
  }
}
