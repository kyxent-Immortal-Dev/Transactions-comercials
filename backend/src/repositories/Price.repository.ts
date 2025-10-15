import { PrismaClient } from "../generated/prisma";
import type {
  Price,
  CreatePriceRequest,
  UpdatePriceRequest,
  PriceHistory,
  CreatePriceHistoryRequest,
  UpdatePriceHistoryRequest
} from "../interfaces/Price.interface";

const prisma = new PrismaClient();

export class PriceRepository {
  // ===== PRICE METHODS =====

  // Obtener todos los precios
  async findAllPrices(): Promise<Price[]> {
    return await prisma.price.findMany({
      include: {
        product: true
      },
      orderBy: {
        date: 'desc'
      }
    }) as Price[];
  }

  // Obtener precio por ID
  async findPriceById(id: number): Promise<Price | null> {
    return await prisma.price.findUnique({
      where: { id },
      include: {
        product: true
      }
    }) as Price | null;
  }

  // Obtener precio actual de un producto
  async findCurrentPriceByProductId(productId: number): Promise<Price | null> {
    return await prisma.price.findFirst({
      where: { product_id: productId },
      include: {
        product: true
      },
      orderBy: {
        date: 'desc'
      }
    }) as Price | null;
  }

  // Crear precio
  async createPrice(data: CreatePriceRequest): Promise<Price> {
    return await prisma.price.create({
      data: {
        ...data,
        date: data.date ? new Date(data.date) : new Date()
      },
      include: {
        product: true
      }
    }) as Price;
  }

  // Actualizar precio
  async updatePrice(id: number, data: UpdatePriceRequest): Promise<Price> {
    return await prisma.price.update({
      where: { id },
      data: {
        ...data,
        date: data.date ? new Date(data.date) : undefined
      },
      include: {
        product: true
      }
    }) as Price;
  }

  // Eliminar precio
  async deletePrice(id: number): Promise<void> {
    await prisma.price.delete({
      where: { id }
    });
  }

  // ===== PRICE HISTORY METHODS =====

  // Obtener todo el historial de precios
  async findAllPriceHistory(): Promise<PriceHistory[]> {
    return await prisma.price_history.findMany({
      include: {
        product: true
      },
      orderBy: {
        date: 'desc'
      }
    }) as PriceHistory[];
  }

  // Obtener historial de precio por ID
  async findPriceHistoryById(id: number): Promise<PriceHistory | null> {
    return await prisma.price_history.findUnique({
      where: { id },
      include: {
        product: true
      }
    }) as PriceHistory | null;
  }

  // Obtener historial de precios por producto
  async findPriceHistoryByProductId(productId: number): Promise<PriceHistory[]> {
    return await prisma.price_history.findMany({
      where: { product_id: productId },
      include: {
        product: true
      },
      orderBy: {
        date: 'desc'
      }
    }) as PriceHistory[];
  }

  // Obtener historial de precios por análisis de precio
  async findPriceHistoryByAnalysisId(analysisId: number): Promise<PriceHistory[]> {
    return await prisma.price_history.findMany({
      where: { price_analysis_id: analysisId },
      include: {
        product: true
      },
      orderBy: {
        date: 'desc'
      }
    }) as PriceHistory[];
  }

  // Crear entrada en historial de precios
  async createPriceHistory(data: CreatePriceHistoryRequest): Promise<PriceHistory> {
    return await prisma.price_history.create({
      data: {
        ...data,
        date: data.date ? new Date(data.date) : new Date()
      },
      include: {
        product: true
      }
    }) as PriceHistory;
  }

  // Actualizar entrada en historial
  async updatePriceHistory(id: number, data: UpdatePriceHistoryRequest): Promise<PriceHistory> {
    return await prisma.price_history.update({
      where: { id },
      data: {
        ...data,
        date: data.date ? new Date(data.date) : undefined
      },
      include: {
        product: true
      }
    }) as PriceHistory;
  }

  // Eliminar entrada del historial
  async deletePriceHistory(id: number): Promise<void> {
    await prisma.price_history.delete({
      where: { id }
    });
  }
}
