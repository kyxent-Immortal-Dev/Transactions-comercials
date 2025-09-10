import { Request, Response } from 'express';
import { BuyOrderRepositoryImpl } from '../repositories/BuyOrder.repository';
import { CreateBuyOrderRequest, UpdateBuyOrderRequest, CreateBuyOrderDetailRequest, UpdateBuyOrderDetailRequest } from '../interfaces/BuyOrder.interface';

export class BuyOrderController {
  private buyOrderRepository: BuyOrderRepositoryImpl;

  constructor() {
    this.buyOrderRepository = new BuyOrderRepositoryImpl();
  }

  async getAllBuyOrders(req: Request, res: Response): Promise<void> {
    try {
      const buyOrders = await this.buyOrderRepository.findAll();
      res.json(buyOrders);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching buy orders' });
    }
  }

  async getBuyOrderById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const buyOrder = await this.buyOrderRepository.findById(id);
      
      if (!buyOrder) {
        res.status(404).json({ error: 'Buy order not found' });
        return;
      }
      
      res.json(buyOrder);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching buy order' });
    }
  }

  async getBuyOrdersBySupplierId(req: Request, res: Response): Promise<void> {
    try {
      const supplierId = parseInt(req.params.supplierId);
      const buyOrders = await this.buyOrderRepository.findBySupplierId(supplierId);
      res.json(buyOrders);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching buy orders' });
    }
  }

  async getBuyOrdersByQuoteId(req: Request, res: Response): Promise<void> {
    try {
      const quoteId = parseInt(req.params.quoteId);
      const buyOrders = await this.buyOrderRepository.findByQuoteId(quoteId);
      res.json(buyOrders);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching buy orders' });
    }
  }

  async createBuyOrder(req: Request, res: Response): Promise<void> {
    try {
      const buyOrderData: CreateBuyOrderRequest = req.body;
      
      // Handle date conversion if provided
      if (buyOrderData.date_arrival) {
        buyOrderData.date_arrival = new Date(buyOrderData.date_arrival);
      }
      
      // Ensure quote_id is null if not provided or empty
      if (!buyOrderData.quote_id || buyOrderData.quote_id === 0) {
        buyOrderData.quote_id = undefined;
      }
      
      const buyOrder = await this.buyOrderRepository.create(buyOrderData);
      res.status(201).json(buyOrder);
    } catch (error) {
      console.error('Error creating buy order:', error);
      res.status(500).json({ error: 'Error creating buy order' });
    }
  }

  async updateBuyOrder(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const buyOrderData: UpdateBuyOrderRequest = req.body;
      
      // Handle date conversion if provided
      if (buyOrderData.date_arrival) {
        buyOrderData.date_arrival = new Date(buyOrderData.date_arrival);
      }
      
      // Ensure quote_id is null if not provided or empty
      if (!buyOrderData.quote_id || buyOrderData.quote_id === 0) {
        buyOrderData.quote_id = undefined;
      }
      
      const buyOrder = await this.buyOrderRepository.update(id, buyOrderData);
      
      if (!buyOrder) {
        res.status(404).json({ error: 'Buy order not found' });
        return;
      }
      
      res.json(buyOrder);
    } catch (error) {
      console.error('Error updating buy order:', error);
      res.status(500).json({ error: 'Error updating buy order' });
    }
  }

  async deleteBuyOrder(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const success = await this.buyOrderRepository.delete(id);
      
      if (!success) {
        res.status(404).json({ error: 'Buy order not found' });
        return;
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error deleting buy order' });
    }
  }

  // Buy Order Details endpoints
  async createBuyOrderDetail(req: Request, res: Response): Promise<void> {
    try {
      const detailData: CreateBuyOrderDetailRequest = req.body;
      const detail = await this.buyOrderRepository.createDetail(detailData);
      res.status(201).json(detail);
    } catch (error) {
      res.status(500).json({ error: 'Error creating buy order detail' });
    }
  }

  async getBuyOrderDetailsByBuyOrderId(req: Request, res: Response): Promise<void> {
    try {
      const buyOrderId = parseInt(req.params.buyOrderId);
      const details = await this.buyOrderRepository.findDetailsByBuyOrderId(buyOrderId);
      res.json(details);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching buy order details' });
    }
  }

  async getBuyOrderDetailById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const detail = await this.buyOrderRepository.findDetailById(id);
      
      if (!detail) {
        res.status(404).json({ error: 'Buy order detail not found' });
        return;
      }
      
      res.json(detail);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching buy order detail' });
    }
  }

  async updateBuyOrderDetail(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const detailData: UpdateBuyOrderDetailRequest = req.body;
      const detail = await this.buyOrderRepository.updateDetail(id, detailData);
      
      if (!detail) {
        res.status(404).json({ error: 'Buy order detail not found' });
        return;
      }
      
      res.json(detail);
    } catch (error) {
      res.status(500).json({ error: 'Error updating buy order detail' });
    }
  }

  async deleteBuyOrderDetail(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const success = await this.buyOrderRepository.deleteDetail(id);
      
      if (!success) {
        res.status(404).json({ error: 'Buy order detail not found' });
        return;
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error deleting buy order detail' });
    }
  }
}