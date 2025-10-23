import type { Request, Response } from 'express';
import { OrderLogRepository } from '../repositories/OrderLog.repository';
import type { CreateOrderLogRequest, UpdateOrderLogRequest } from '../interfaces/Retaceo.interface';

export class OrderLogController {
  private repo = new OrderLogRepository();

  async getAll(req: Request, res: Response) {
    try { res.json(await this.repo.findAll()); } catch { res.status(500).json({ error: 'Error fetching order logs' }); }
  }
  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);
      const item = await this.repo.findById(id);
      if (!item) return res.status(404).json({ error: 'Not found' });
      res.json(item);
    } catch { res.status(500).json({ error: 'Error fetching order log' }); }
  }
  async getByBuyOrderId(req: Request, res: Response) {
    try {
      const buyOrderId = parseInt(req.params.buyOrderId as string);
      res.json(await this.repo.findByBuyOrderId(buyOrderId));
    } catch { res.status(500).json({ error: 'Error fetching order logs' }); }
  }
  async create(req: Request, res: Response) {
    try {
      const data: CreateOrderLogRequest = req.body;
      console.log('Creating order log with data:', data);
      
      // Convertir fecha si viene como string
      const orderLogData = {
        ...data,
        date: data.date instanceof Date ? data.date : new Date(data.date),
        value: Number(data.value), // Asegurar que value es número
        buy_order_id: Number(data.buy_order_id) // Asegurar que es número
      };
      
      console.log('Processed order log data:', orderLogData);
      
      const created = await this.repo.create(orderLogData);
      console.log('Order log created:', created);
      
      res.status(201).json(created);
    } catch (error) {
      console.error('Error creating order log:', error);
      res.status(500).json({ error: 'Error creating order log' });
    }
  }
  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);
      const data: UpdateOrderLogRequest = req.body;
      
      // Convertir fecha si viene como string
      const orderLogData = {
        ...data,
        date: data.date ? (data.date instanceof Date ? data.date : new Date(data.date)) : undefined,
        value: data.value !== undefined ? Number(data.value) : undefined,
        buy_order_id: data.buy_order_id !== undefined ? Number(data.buy_order_id) : undefined
      };
      
      const updated = await this.repo.update(id, orderLogData);
      if (!updated) return res.status(404).json({ error: 'Not found' });
      res.json(updated);
    } catch (error) {
      console.error('Error updating order log:', error);
      res.status(500).json({ error: 'Error updating order log' });
    }
  }
  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);
      const ok = await this.repo.delete(id);
      if (!ok) return res.status(404).json({ error: 'Not found' });
      res.status(204).send();
    } catch { res.status(500).json({ error: 'Error deleting order log' }); }
  }
}
