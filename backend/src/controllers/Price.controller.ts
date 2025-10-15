import { Request, Response } from "express";
import { PriceRepository } from "../repositories/Price.repository";
import type {
  CreatePriceRequest,
  UpdatePriceRequest,
  CreatePriceHistoryRequest,
  UpdatePriceHistoryRequest
} from "../interfaces/Price.interface";

const repository = new PriceRepository();

export class PriceController {
  // ===== PRICE CONTROLLERS =====

  // Obtener todos los precios
  async getAllPrices(req: Request, res: Response) {
    try {
      const prices = await repository.findAllPrices();
      res.json(prices);
    } catch (error) {
      console.error("Error getting prices:", error);
      res.status(500).json({ message: "Error al obtener los precios" });
    }
  }

  // Obtener precio por ID
  async getPriceById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);
      const price = await repository.findPriceById(id);
      
      if (!price) {
        return res.status(404).json({ message: "Precio no encontrado" });
      }
      
      res.json(price);
    } catch (error) {
      console.error("Error getting price:", error);
      res.status(500).json({ message: "Error al obtener el precio" });
    }
  }

  // Obtener precio actual por producto
  async getCurrentPriceByProductId(req: Request, res: Response) {
    try {
      const productId = parseInt(req.params.productId as string);
      const price = await repository.findCurrentPriceByProductId(productId);
      
      if (!price) {
        return res.status(404).json({ message: "Precio no encontrado para este producto" });
      }
      
      res.json(price);
    } catch (error) {
      console.error("Error getting current price:", error);
      res.status(500).json({ message: "Error al obtener el precio actual" });
    }
  }

  // Crear precio
  async createPrice(req: Request, res: Response) {
    try {
      const data: CreatePriceRequest = req.body;
      const price = await repository.createPrice(data);
      res.status(201).json(price);
    } catch (error) {
      console.error("Error creating price:", error);
      res.status(500).json({ message: "Error al crear el precio" });
    }
  }

  // Actualizar precio
  async updatePrice(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);
      const data: UpdatePriceRequest = req.body;
      const price = await repository.updatePrice(id, data);
      res.json(price);
    } catch (error) {
      console.error("Error updating price:", error);
      res.status(500).json({ message: "Error al actualizar el precio" });
    }
  }

  // Eliminar precio
  async deletePrice(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);
      await repository.deletePrice(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting price:", error);
      res.status(500).json({ message: "Error al eliminar el precio" });
    }
  }

  // ===== PRICE HISTORY CONTROLLERS =====

  // Obtener todo el historial
  async getAllPriceHistory(req: Request, res: Response) {
    try {
      const history = await repository.findAllPriceHistory();
      res.json(history);
    } catch (error) {
      console.error("Error getting price history:", error);
      res.status(500).json({ message: "Error al obtener el historial de precios" });
    }
  }

  // Obtener historial por ID
  async getPriceHistoryById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);
      const history = await repository.findPriceHistoryById(id);
      
      if (!history) {
        return res.status(404).json({ message: "Historial no encontrado" });
      }
      
      res.json(history);
    } catch (error) {
      console.error("Error getting price history:", error);
      res.status(500).json({ message: "Error al obtener el historial" });
    }
  }

  // Obtener historial por producto
  async getPriceHistoryByProductId(req: Request, res: Response) {
    try {
      const productId = parseInt(req.params.productId as string);
      const history = await repository.findPriceHistoryByProductId(productId);
      res.json(history);
    } catch (error) {
      console.error("Error getting price history by product:", error);
      res.status(500).json({ message: "Error al obtener el historial del producto" });
    }
  }

  // Obtener historial por análisis
  async getPriceHistoryByAnalysisId(req: Request, res: Response) {
    try {
      const analysisId = parseInt(req.params.analysisId as string);
      const history = await repository.findPriceHistoryByAnalysisId(analysisId);
      res.json(history);
    } catch (error) {
      console.error("Error getting price history by analysis:", error);
      res.status(500).json({ message: "Error al obtener el historial del análisis" });
    }
  }

  // Crear entrada en historial
  async createPriceHistory(req: Request, res: Response) {
    try {
      const data: CreatePriceHistoryRequest = req.body;
      const history = await repository.createPriceHistory(data);
      res.status(201).json(history);
    } catch (error) {
      console.error("Error creating price history:", error);
      res.status(500).json({ message: "Error al crear el historial" });
    }
  }

  // Actualizar entrada en historial
  async updatePriceHistory(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);
      const data: UpdatePriceHistoryRequest = req.body;
      const history = await repository.updatePriceHistory(id, data);
      res.json(history);
    } catch (error) {
      console.error("Error updating price history:", error);
      res.status(500).json({ message: "Error al actualizar el historial" });
    }
  }

  // Eliminar entrada del historial
  async deletePriceHistory(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);
      await repository.deletePriceHistory(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting price history:", error);
      res.status(500).json({ message: "Error al eliminar el historial" });
    }
  }
}
