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

const priceAnalysisInclude = {
  retaceo: {
    include: {
      purchase: {
        include: {
          supplier: true,
          buy_order: true,
          purchase_details: true
        }
      },
      retaceo_details: {
        include: {
          product: true
        }
      }
    }
  },
  price_analysis_details: {
    include: {
      product: true
    }
  }
} as const;

export class PriceAnalysisRepository {
  private async generateAnalysisCode(): Promise<string> {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    const countToday = await prisma.price_analysis.count({
      where: {
        date: {
          gte: startOfDay,
          lt: endOfDay
        }
      }
    });

    const sequence = (countToday + 1).toString().padStart(4, "0");
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");

    return `PAN-${now.getFullYear()}${month}${day}-${sequence}`;
  }

  // Obtener todos los análisis de precios
  async findAll(): Promise<PriceAnalysis[]> {
    return await prisma.price_analysis.findMany({
      include: priceAnalysisInclude,
      orderBy: {
        date: 'desc'
      }
    });
  }

  // Obtener análisis de precio por ID
  async findById(id: number): Promise<PriceAnalysis | null> {
    return await prisma.price_analysis.findUnique({
      where: { id },
      include: priceAnalysisInclude
    });
  }

  // Obtener análisis de precios por retaceo
  async findByRetaceoId(retaceoId: number): Promise<PriceAnalysis[]> {
    return await prisma.price_analysis.findMany({
      where: { retaceo_id: retaceoId },
      include: priceAnalysisInclude
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
      include: priceAnalysisInclude
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
      include: priceAnalysisInclude
    });
  }

  // Eliminar análisis de precio
  async delete(id: number): Promise<void> {
    await prisma.price_analysis.delete({
      where: { id }
    });
  }

  async createFromRetaceo(retaceoId: number): Promise<PriceAnalysis> {
    const retaceo = await prisma.retaceo.findUnique({
      where: { id: retaceoId },
      include: {
        retaceo_details: {
          include: {
            product: true
          }
        },
        purchase: {
          include: {
            supplier: true,
            buy_order: true,
            purchase_details: true
          }
        }
      }
    });

    if (!retaceo) {
      throw new Error("Retaceo no encontrado");
    }

    if (!retaceo.retaceo_details || retaceo.retaceo_details.length === 0) {
      throw new Error("El retaceo seleccionado no tiene detalles");
    }

    const existing = await prisma.price_analysis.findFirst({ where: { retaceo_id: retaceoId } });
    if (existing) {
      throw new Error("Ya existe un análisis de precios para este retaceo");
    }

    const code = await this.generateAnalysisCode();

    const detailsPayload = retaceo.retaceo_details.map(detail => {
      const baseCost = detail.price ?? 0;
      const currentProductPrice = detail.product?.price ?? baseCost;
      const margin = baseCost > 0 ? Number((((currentProductPrice - baseCost) / baseCost) * 100).toFixed(2)) : 0;

      return {
        product_id: detail.product_id,
        quantity: detail.quantity ?? 0,
        price: Number(currentProductPrice.toFixed(2)),
        utility_percent: Number(margin.toFixed(2))
      };
    });

    return await prisma.price_analysis.create({
      data: {
        code,
        status: "pending",
        date: new Date(),
        num_invoice: retaceo.num_invoice,
        retaceo_id: retaceoId,
        price_analysis_details: {
          create: detailsPayload
        }
      },
      include: priceAnalysisInclude
    });
  }

  async applyAnalysis(id: number): Promise<{
    analysis: PriceAnalysis;
    updatedProducts: any[];
    priceRecords: any[];
    priceHistoryRecords: any[];
  }> {
    return await prisma.$transaction(async (tx) => {
      const analysis = await tx.price_analysis.findUnique({
        where: { id },
        include: priceAnalysisInclude
      });

      if (!analysis) {
        throw new Error("Análisis de precios no encontrado");
      }

      if (analysis.status === "approved") {
        throw new Error("El análisis de precios ya fue aprobado");
      }

      const retaceoDetails = new Map(
        (analysis.retaceo?.retaceo_details || []).map(detail => [detail.product_id, detail])
      );

      const purchaseDetails = new Map(
        (analysis.retaceo?.purchase?.purchase_details || []).map(detail => [detail.product_id, detail])
      );

      const updatedProducts = [] as any[];
      const priceRecords = [] as any[];
      const priceHistoryRecords = [] as any[];

      for (const detail of analysis.price_analysis_details) {
        const retaceoDetail = retaceoDetails.get(detail.product_id);

        if (!retaceoDetail) {
          throw new Error(`No se encontró detalle de retaceo para el producto ${detail.product_id}`);
        }

        const baseCost = retaceoDetail.price ?? 0;
        const salePrice = detail.price ?? 0;

        if (salePrice <= 0) {
          throw new Error(`El precio sugerido para el producto ${detail.product_id} no es válido`);
        }

        const purchaseDetail = purchaseDetails.get(detail.product_id);
        const invoiceCost = purchaseDetail?.price ?? baseCost;
        const marginPercent = baseCost > 0 ? Number((((salePrice - baseCost) / baseCost) * 100).toFixed(2)) : 0;
        const utilityValue = baseCost > 0 ? Number((salePrice - baseCost).toFixed(2)) : 0;

        await tx.price_analysis_details.update({
          where: { id: detail.id },
          data: {
            quantity: detail.quantity ?? retaceoDetail.quantity ?? 0,
            price: salePrice,
            utility_percent: marginPercent
          }
        });

        const priceRecord = await tx.price.create({
          data: {
            product_id: detail.product_id,
            bill_cost: invoiceCost,
            final_bill_retaceo: baseCost,
            price: salePrice,
            utility: marginPercent
          }
        });
        priceRecords.push(priceRecord);

        const priceHistoryRecord = await tx.price_history.create({
          data: {
            product_id: detail.product_id,
            price_analysis_id: analysis.id,
            bill_cost: invoiceCost,
            final_bill_retaceo: baseCost,
            price: salePrice,
            utility: marginPercent,
            status: "applied"
          }
        });
        priceHistoryRecords.push(priceHistoryRecord);

        const updatedProduct = await tx.products.update({
          where: { id: detail.product_id },
          data: {
            price: salePrice,
            bill_cost: invoiceCost,
            final_bill_retaceo: baseCost,
            utility: utilityValue
          }
        });
        updatedProducts.push(updatedProduct);
      }

      const updatedAnalysis = await tx.price_analysis.update({
        where: { id },
        data: { status: "approved" },
        include: priceAnalysisInclude
      });

      return {
        analysis: updatedAnalysis,
        updatedProducts,
        priceRecords,
        priceHistoryRecords
      };
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
