import { PrismaClient } from "../generated/prisma";
import type {
  PriceAnalysis,
  CreatePriceAnalysisRequest,
  UpdatePriceAnalysisRequest,
  PriceAnalysisDetail,
  CreatePriceAnalysisDetailRequest,
  UpdatePriceAnalysisDetailRequest
} from "../interfaces/PriceAnalysis.interface";

const prisma = new PrismaClient();

export class PriceAnalysisRepository {
  // Obtener todos los análisis de precios
  async findAll(): Promise<PriceAnalysis[]> {
    return await prisma.price_analysis.findMany({
      include: {
        retaceo: {
          include: {
            purchase: {
              include: {
                supplier: true,
                buy_order: true
              }
            }
          }
        },
        price_analysis_details: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    });
  }

  // Obtener análisis de precio por ID
  async findById(id: number): Promise<PriceAnalysis | null> {
    return await prisma.price_analysis.findUnique({
      where: { id },
      include: {
        retaceo: {
          include: {
            purchase: {
              include: {
                supplier: true,
                buy_order: true
              }
            }
          }
        },
        price_analysis_details: {
          include: {
            product: true
          }
        }
      }
    });
  }

  // Obtener análisis de precios por retaceo
  async findByRetaceoId(retaceoId: number): Promise<PriceAnalysis[]> {
    return await prisma.price_analysis.findMany({
      where: { retaceo_id: retaceoId },
      include: {
        retaceo: {
          include: {
            purchase: {
              include: {
                supplier: true,
                buy_order: true
              }
            }
          }
        },
        price_analysis_details: {
          include: {
            product: true
          }
        }
      }
    });
  }

  // Crear análisis de precio
  async create(data: CreatePriceAnalysisRequest): Promise<PriceAnalysis> {
    const { details, ...analysisData } = data;
    
    return await prisma.price_analysis.create({
      data: {
        ...analysisData,
        date: data.date ? new Date(data.date) : new Date(),
        price_analysis_details: details ? {
          create: details
        } : undefined
      },
      include: {
        retaceo: {
          include: {
            purchase: {
              include: {
                supplier: true,
                buy_order: true
              }
            }
          }
        },
        price_analysis_details: {
          include: {
            product: true
          }
        }
      }
    });
  }

  // Actualizar análisis de precio
  async update(id: number, data: UpdatePriceAnalysisRequest): Promise<PriceAnalysis> {
    return await prisma.price_analysis.update({
      where: { id },
      data: {
        ...data,
        date: data.date ? new Date(data.date) : undefined
      },
      include: {
        retaceo: {
          include: {
            purchase: {
              include: {
                supplier: true,
                buy_order: true
              }
            }
          }
        },
        price_analysis_details: {
          include: {
            product: true
          }
        }
      }
    });
  }

  // Eliminar análisis de precio
  async delete(id: number): Promise<void> {
    await prisma.price_analysis.delete({
      where: { id }
    });
  }

  // ===== MÉTODOS PARA DETALLES =====

  // Crear detalle de análisis
  async createDetail(data: CreatePriceAnalysisDetailRequest): Promise<PriceAnalysisDetail> {
    return await prisma.price_analysis_details.create({
      data,
      include: {
        product: true
      }
    });
  }

  // Obtener detalles por análisis
  async getDetailsByAnalysisId(analysisId: number): Promise<PriceAnalysisDetail[]> {
    return await prisma.price_analysis_details.findMany({
      where: { price_analysis_id: analysisId },
      include: {
        product: true
      }
    });
  }

  // Obtener detalle por ID
  async getDetailById(id: number): Promise<PriceAnalysisDetail | null> {
    return await prisma.price_analysis_details.findUnique({
      where: { id },
      include: {
        product: true
      }
    });
  }

  // Actualizar detalle
  async updateDetail(id: number, data: UpdatePriceAnalysisDetailRequest): Promise<PriceAnalysisDetail> {
    return await prisma.price_analysis_details.update({
      where: { id },
      data,
      include: {
        product: true
      }
    });
  }

  // Eliminar detalle
  async deleteDetail(id: number): Promise<void> {
    await prisma.price_analysis_details.delete({
      where: { id }
    });
  }
}
