import { Request, Response } from "express";
import { PriceAnalysisRepository } from "../repositories/PriceAnalysis.repository";
import type {
  CreatePriceAnalysisRequest,
  UpdatePriceAnalysisRequest,
  CreatePriceAnalysisDetailRequest,
  UpdatePriceAnalysisDetailRequest
} from "../interfaces/PriceAnalysis.interface";

const repository = new PriceAnalysisRepository();

export class PriceAnalysisController {
  // Obtener todos los análisis de precios
  async getAll(req: Request, res: Response) {
    try {
      const priceAnalyses = await repository.findAll();
      res.json(priceAnalyses);
    } catch (error) {
      console.error("Error getting price analyses:", error);
      res.status(500).json({ message: "Error al obtener los análisis de precios" });
    }
  }

  // Obtener análisis por ID
  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);
      const priceAnalysis = await repository.findById(id);
      
      if (!priceAnalysis) {
        return res.status(404).json({ message: "Análisis de precio no encontrado" });
      }
      
      res.json(priceAnalysis);
    } catch (error) {
      console.error("Error getting price analysis:", error);
      res.status(500).json({ message: "Error al obtener el análisis de precio" });
    }
  }

  // Obtener análisis por retaceo
  async getByRetaceoId(req: Request, res: Response) {
    try {
      const retaceoId = parseInt(req.params.retaceoId as string);
      const priceAnalyses = await repository.findByRetaceoId(retaceoId);
      res.json(priceAnalyses);
    } catch (error) {
      console.error("Error getting price analyses by retaceo:", error);
      res.status(500).json({ message: "Error al obtener los análisis de precios del retaceo" });
    }
  }

  // Crear análisis de precio
  async create(req: Request, res: Response) {
    try {
      const data: CreatePriceAnalysisRequest = req.body;
      const priceAnalysis = await repository.create(data);
      res.status(201).json(priceAnalysis);
    } catch (error) {
      console.error("Error creating price analysis:", error);
      res.status(500).json({ message: "Error al crear el análisis de precio" });
    }
  }

  // Actualizar análisis de precio
  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);
      const data: UpdatePriceAnalysisRequest = req.body;
      const priceAnalysis = await repository.update(id, data);
      res.json(priceAnalysis);
    } catch (error) {
      console.error("Error updating price analysis:", error);
      res.status(500).json({ message: "Error al actualizar el análisis de precio" });
    }
  }

  // Eliminar análisis de precio
  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);
      await repository.delete(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting price analysis:", error);
      res.status(500).json({ message: "Error al eliminar el análisis de precio" });
    }
  }

  // ===== CONTROLADORES PARA DETALLES =====

  // Obtener detalles por análisis
  async getDetails(req: Request, res: Response) {
    try {
      const analysisId = parseInt(req.params.id as string);
      const details = await repository.getDetailsByAnalysisId(analysisId);
      res.json(details);
    } catch (error) {
      console.error("Error getting price analysis details:", error);
      res.status(500).json({ message: "Error al obtener los detalles del análisis" });
    }
  }

  // Crear detalle
  async createDetail(req: Request, res: Response) {
    try {
      const data: CreatePriceAnalysisDetailRequest = req.body;
      const detail = await repository.createDetail(data);
      res.status(201).json(detail);
    } catch (error) {
      console.error("Error creating price analysis detail:", error);
      res.status(500).json({ message: "Error al crear el detalle del análisis" });
    }
  }

  // Obtener detalle por ID
  async getDetailById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);
      const detail = await repository.getDetailById(id);
      
      if (!detail) {
        return res.status(404).json({ message: "Detalle no encontrado" });
      }
      
      res.json(detail);
    } catch (error) {
      console.error("Error getting detail:", error);
      res.status(500).json({ message: "Error al obtener el detalle" });
    }
  }

  // Actualizar detalle
  async updateDetail(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);
      const data: UpdatePriceAnalysisDetailRequest = req.body;
      const detail = await repository.updateDetail(id, data);
      res.json(detail);
    } catch (error) {
      console.error("Error updating detail:", error);
      res.status(500).json({ message: "Error al actualizar el detalle" });
    }
  }

  // Eliminar detalle
  async deleteDetail(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);
      await repository.deleteDetail(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting detail:", error);
      res.status(500).json({ message: "Error al eliminar el detalle" });
    }
  }
}
