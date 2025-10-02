import type { Request, Response } from 'express';
import { RetaceoRepository } from '../repositories/Retaceo.repository';
import type {
  CreateRetaceoRequest,
  UpdateRetaceoRequest,
  CreateRetaceoDetailRequest,
  UpdateRetaceoDetailRequest
} from '../interfaces/Retaceo.interface';

export class RetaceoController {
  private repo = new RetaceoRepository();

  async getAll(req: Request, res: Response) {
    try { res.json(await this.repo.findAll()); } catch { res.status(500).json({ error: 'Error fetching retaceos' }); }
  }
  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);
      const item = await this.repo.findById(id);
      if (!item) return res.status(404).json({ error: 'Not found' });
      res.json(item);
    } catch { res.status(500).json({ error: 'Error fetching retaceo' }); }
  }
  async getByBuyOrderId(req: Request, res: Response) {
    try {
      const boid = parseInt(req.params.buyOrderId as string);
      res.json(await this.repo.findByBuyOrderId(boid));
    } catch { res.status(500).json({ error: 'Error fetching retaceos' }); }
  }
  async create(req: Request, res: Response) {
    try {
      const data: CreateRetaceoRequest = req.body;
      const created = await this.repo.create(data);
      res.status(201).json(created);
    } catch { res.status(500).json({ error: 'Error creating retaceo' }); }
  }
  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);
      const data: UpdateRetaceoRequest = req.body;
      const updated = await this.repo.update(id, data);
      if (!updated) return res.status(404).json({ error: 'Not found' });
      res.json(updated);
    } catch { res.status(500).json({ error: 'Error updating retaceo' }); }
  }
  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);
      const ok = await this.repo.delete(id);
      if (!ok) return res.status(404).json({ error: 'Not found' });
      res.status(204).send();
    } catch { res.status(500).json({ error: 'Error deleting retaceo' }); }
  }

  // Details
  async createDetail(req: Request, res: Response) {
    try {
      const data: CreateRetaceoDetailRequest = req.body;
      const created = await this.repo.createDetail(data);
      res.status(201).json(created);
    } catch { res.status(500).json({ error: 'Error creating detail' }); }
  }
  async getDetailsByRetaceoId(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.retaceoId as string);
      res.json(await this.repo.findDetailsByRetaceoId(id));
    } catch { res.status(500).json({ error: 'Error fetching details' }); }
  }
  async getDetailById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);
      const det = await this.repo.findDetailById(id);
      if (!det) return res.status(404).json({ error: 'Not found' });
      res.json(det);
    } catch { res.status(500).json({ error: 'Error fetching detail' }); }
  }
  async updateDetail(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);
      const data: UpdateRetaceoDetailRequest = req.body;
      const upd = await this.repo.updateDetail(id, data);
      if (!upd) return res.status(404).json({ error: 'Not found' });
      res.json(upd);
    } catch { res.status(500).json({ error: 'Error updating detail' }); }
  }
  async deleteDetail(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);
      const ok = await this.repo.deleteDetail(id);
      if (!ok) return res.status(404).json({ error: 'Not found' });
      res.status(204).send();
    } catch { res.status(500).json({ error: 'Error deleting detail' }); }
  }
}
