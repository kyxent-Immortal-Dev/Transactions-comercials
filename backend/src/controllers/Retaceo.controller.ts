import { Request, Response } from 'express';
import { RetaceoRepository } from '../repositories/Retaceo.repository';
import { PurchaseRepository } from '../repositories/Purchase.repository';
import { OrderLogRepository } from '../repositories/OrderLog.repository';
import { 
  CreateRetaceoRequest, 
  UpdateRetaceoRequest, 
  CreateRetaceoDetailRequest, 
  UpdateRetaceoDetailRequest 
} from '../interfaces/Retaceo.interface';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

export class RetaceoController {
  private repo = new RetaceoRepository();
  private purchaseRepo = new PurchaseRepository();
  private orderLogRepo = new OrderLogRepository();

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
  async getByPurchaseId(req: Request, res: Response) {
    try {
      const purchaseId = parseInt(req.params.purchaseId as string);
      res.json(await this.repo.findByPurchaseId(purchaseId));
    } catch { res.status(500).json({ error: 'Error fetching retaceos' }); }
  }
  async create(req: Request, res: Response) {
    try {
      const data: CreateRetaceoRequest = req.body;
      const created = await this.repo.create(data);
      console.log(data);
      
      console.log(created);
      
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

  /**
   * Calcular retaceo automáticamente desde una purchase
   * POST /api/retaceos/calculate
   * Body: { purchase_id: number }
   */
  async calculateRetaceo(req: Request, res: Response) {
    try {
      const { purchase_id } = req.body;
      
      if (!purchase_id) {
        return res.status(400).json({ error: 'purchase_id is required' });
      }

      // 1. Obtener la compra con sus detalles
      const purchase = await this.purchaseRepo.findById(purchase_id);
      if (!purchase) {
        return res.status(404).json({ error: 'Purchase not found' });
      }

      // 2. Obtener los detalles de la compra
      const purchaseDetails = await this.purchaseRepo.findDetailsByPurchaseId(purchase_id);
      if (!purchaseDetails || purchaseDetails.length === 0) {
        return res.status(400).json({ error: 'Purchase has no details' });
      }

      // 3. Obtener la orden de compra asociada
      const buyOrderId = purchase.buy_order_id;
      if (!buyOrderId) {
        return res.status(400).json({ error: 'Purchase has no buy_order associated' });
      }

      // 4. Obtener los gastos de la bitácora
      const expenseSummary = await this.orderLogRepo.getExpenseSummary(buyOrderId);
      const { byType: expensesByType, total: totalExpenses } = expenseSummary;

      // 5. Calcular el FOB total (suma de costos de productos)
      const totalFOB = purchaseDetails.reduce((sum, detail) => {
        const productCost = (detail.price || 0) * (detail.quantity || 0);
        return sum + productCost;
      }, 0);

      if (totalFOB === 0) {
        return res.status(400).json({ error: 'Total FOB cannot be zero' });
      }

      // 6. Calcular costos prorrateados para cada producto
      const retaceoCalculations = purchaseDetails.map(detail => {
        const productFOB = (detail.price || 0) * (detail.quantity || 0);
        const proportion = productFOB / totalFOB;

        // Calcular cada tipo de gasto prorrateado
        const prorratedExpenses: { [key: string]: number } = {};
        let totalProrratedExpenses = 0;

        Object.entries(expensesByType).forEach(([type, amount]) => {
          const prorratedAmount = amount * proportion;
          prorratedExpenses[type] = prorratedAmount;
          totalProrratedExpenses += prorratedAmount;
        });

        // Costo final = FOB + Gastos prorrateados
        const finalCost = productFOB + totalProrratedExpenses;
        const unitCost = (detail.quantity || 0) > 0 ? finalCost / (detail.quantity || 1) : finalCost;

        return {
          product_id: detail.product_id,
          product: detail.product,
          quantity: detail.quantity || 0,
          fob_cost: productFOB,
          proportion: proportion * 100, // Convertir a porcentaje
          prorated_expenses: prorratedExpenses,
          total_prorated: totalProrratedExpenses,
          final_cost: finalCost,
          unit_cost: unitCost
        };
      });

      // 7. Retornar los cálculos (no guardar aún, solo mostrar)
      res.json({
        purchase_id,
        buy_order_id: buyOrderId,
        total_fob: totalFOB,
        total_expenses: totalExpenses,
        expenses_by_type: expensesByType,
        products: retaceoCalculations,
        summary: {
          total_cost: totalFOB + totalExpenses,
          product_count: purchaseDetails.length
        }
      });

    } catch (error) {
      console.error('Error calculating retaceo:', error);
      res.status(500).json({ error: 'Error calculating retaceo' });
    }
  }

  /**
   * Crear retaceo con detalles calculados automáticamente
   * POST /api/retaceos/create-with-calculation
   * Body: { purchase_id: number, code?: string, num_invoice?: string, date?: string }
   */
  async createWithCalculation(req: Request, res: Response) {
    try {
      const { purchase_id, code, num_invoice, date } = req.body;
      
      console.log('=== CREATE WITH CALCULATION ===');
      console.log('Request body:', req.body);
      
      if (!purchase_id) {
        return res.status(400).json({ error: 'purchase_id is required' });
      }

      // Primero calcular el retaceo
      const calculationResponse = await this.calculateRetaceoInternal(purchase_id);
      console.log('Calculation response:', calculationResponse);
      
      if ('error' in calculationResponse) {
        return res.status(400).json(calculationResponse);
      }

      // Crear el retaceo
      const retaceoData: CreateRetaceoRequest = {
        code: code || null,
        num_invoice: num_invoice || null,
        date: date || new Date(),
        status: 'pending',
        purchase_id: purchase_id
      };

      console.log('Creating retaceo with data:', retaceoData);
      const retaceo = await this.repo.create(retaceoData);
      console.log('Retaceo created:', retaceo);

      // Crear los detalles del retaceo
      console.log('Creating details for', calculationResponse.products.length, 'products');
      const detailsPromises = calculationResponse.products.map(async (product: any) => {
        const detailData: CreateRetaceoDetailRequest = {
          retaceo_id: retaceo.id!,
          product_id: product.product_id,
          quantity: product.quantity,
          price: product.unit_cost, // Precio unitario final con retaceo
          status: 'pending'
        };
        console.log('Creating detail:', detailData);
        return await this.repo.createDetail(detailData);
      });

      const createdDetails = await Promise.all(detailsPromises);
      console.log('Details created:', createdDetails.length);

      // Obtener el retaceo completo con detalles
      const completeRetaceo = await this.repo.findById(retaceo.id!);
      console.log('Complete retaceo:', completeRetaceo);

      res.status(201).json({
        retaceo: completeRetaceo,
        calculation: calculationResponse
      });

    } catch (error) {
      console.error('Error creating retaceo with calculation:', error);
      res.status(500).json({ error: 'Error creating retaceo with calculation' });
    }
  }

  /**
   * Método interno para calcular retaceo (reutilizable)
   */
  private async calculateRetaceoInternal(purchase_id: number): Promise<any> {
    const purchase = await this.purchaseRepo.findById(purchase_id);
    if (!purchase) {
      return { error: 'Purchase not found' };
    }

    const purchaseDetails = await this.purchaseRepo.findDetailsByPurchaseId(purchase_id);
    if (!purchaseDetails || purchaseDetails.length === 0) {
      return { error: 'Purchase has no details' };
    }

    const buyOrderId = purchase.buy_order_id;
    if (!buyOrderId) {
      return { error: 'Purchase has no buy_order associated' };
    }

    const expenseSummary = await this.orderLogRepo.getExpenseSummary(buyOrderId);
    const { byType: expensesByType, total: totalExpenses } = expenseSummary;

    const totalFOB = purchaseDetails.reduce((sum, detail) => {
      const productCost = (detail.price || 0) * (detail.quantity || 0);
      return sum + productCost;
    }, 0);

    if (totalFOB === 0) {
      return { error: 'Total FOB cannot be zero' };
    }

    const retaceoCalculations = purchaseDetails.map(detail => {
      const productFOB = (detail.price || 0) * (detail.quantity || 0);
      const proportion = productFOB / totalFOB;

      const prorratedExpenses: { [key: string]: number } = {};
      let totalProrratedExpenses = 0;

      Object.entries(expensesByType).forEach(([type, amount]) => {
        const prorratedAmount = amount * proportion;
        prorratedExpenses[type] = prorratedAmount;
        totalProrratedExpenses += prorratedAmount;
      });

      const finalCost = productFOB + totalProrratedExpenses;
      const unitCost = (detail.quantity || 0) > 0 ? finalCost / (detail.quantity || 1) : finalCost;

      return {
        product_id: detail.product_id,
        product: detail.product,
        quantity: detail.quantity || 0,
        fob_cost: productFOB,
        proportion: proportion * 100,
        prorated_expenses: prorratedExpenses,
        total_prorated: totalProrratedExpenses,
        final_cost: finalCost,
        unit_cost: unitCost
      };
    });

    return {
      purchase_id,
      buy_order_id: buyOrderId,
      total_fob: totalFOB,
      total_expenses: totalExpenses,
      expenses_by_type: expensesByType,
      products: retaceoCalculations,
      summary: {
        total_cost: totalFOB + totalExpenses,
        product_count: purchaseDetails.length
      }
    };
  }

  /**
   * Aprobar retaceo y actualizar precios y stock de productos
   * POST /api/retaceos/:id/approve
   */
  async approveRetaceo(req: Request, res: Response) {
    const { id } = req.params;
    try {
      console.log(`[RetaceoController] Iniciando aprobación de retaceo ID: ${id}`);

      const retaceo = await this.repo.getById(Number(id));
      if (!retaceo) {
        console.error(`[RetaceoController] Retaceo no encontrado: ${id}`);
        return res.status(404).json({ error: 'Retaceo no encontrado' });
      }

      if (!retaceo.retaceo_details || retaceo.retaceo_details.length === 0) {
        return res.status(400).json({ error: 'El retaceo no tiene detalles para procesar.' });
      }
      console.log('[RetaceoController] Retaceo encontrado:', JSON.stringify(retaceo, null, 2));

      const purchase = retaceo.purchase;
      if (!purchase || !purchase.buy_order) {
        console.error(`[RetaceoController] La compra o la orden de compra no están asociadas al retaceo.`);
        return res.status(400).json({ error: 'Datos de compra incompletos en el retaceo' });
      }

      const buyOrder = purchase.buy_order;
      const orderLogs = buyOrder.order_logs || [];
      console.log('[RetaceoController] Gastos (Order Logs) encontrados:', JSON.stringify(orderLogs, null, 2));

      const totalExpenses = orderLogs.reduce((acc: number, log: { value: number }) => acc + Number(log.value), 0);
      console.log(`[RetaceoController] Total de gastos calculados: ${totalExpenses}`);

      const totalInvoiceValue = retaceo.retaceo_details.reduce((acc: number, detail: { quantity?: number | null; price?: number | null; }) => {
        return acc + (Number(detail.quantity || 0) * Number(detail.price || 0));
      }, 0);
      console.log(`[RetaceoController] Valor total de la factura (compra): ${totalInvoiceValue}`);

      if (totalInvoiceValue === 0) {
        console.error('[RetaceoController] El valor total de la factura es cero.');
        return res.status(400).json({ error: 'El valor total de la factura es cero, no se puede calcular el factor de prorrateo.' });
      }

      const prorationFactor = totalExpenses / totalInvoiceValue;
      console.log(`[RetaceoController] Factor de prorrateo calculado: ${prorationFactor}`);

      const updatedProducts = await prisma.$transaction(async (prisma: Prisma.TransactionClient) => {
        const productUpdates = [];

        for (const detail of retaceo.retaceo_details!) {
          const productId = detail.product_id;
          const quantity = Number(detail.quantity || 0);
          const unitPrice = Number(detail.price || 0);

          console.log(`[RetaceoController] Procesando detalle para Producto ID: ${productId}`);

          const proratedExpense = unitPrice * prorationFactor;
          console.log(`[RetaceoController] Gasto prorrateado por unidad: ${proratedExpense}`);

          const finalUnitCost = unitPrice + proratedExpense;
          console.log(`[RetaceoController] Costo final por unidad: ${finalUnitCost}`);

          const newSalePrice = finalUnitCost * 1.30;
          console.log(`[RetaceoController] Nuevo precio de venta (con 30% de utilidad): ${newSalePrice}`);

          const product = await prisma.products.findUnique({ where: { id: productId } });
          if (!product) {
            throw new Error(`Producto con ID ${productId} no encontrado.`);
          }
          console.log(`[RetaceoController] Producto actual encontrado (ID: ${productId}): Stock actual: ${product.amount}`);

          const newStock = product.amount + quantity;
          console.log(`[RetaceoController] Nuevo stock calculado: ${newStock}`);

          const updatedProduct = await prisma.products.update({
            where: { id: productId },
            data: {
              amount: newStock,
              price: newSalePrice,
              bill_cost: unitPrice,
              final_bill_retaceo: finalUnitCost,
              utility: newSalePrice - finalUnitCost,
            },
          });
          console.log(`[RetaceoController] Producto ID: ${productId} actualizado correctamente.`);
          productUpdates.push(updatedProduct);
        }

        await prisma.retaceo.update({
          where: { id: Number(id) },
          data: { status: 'approved' },
        });
        console.log(`[RetaceoController] Estado del retaceo ID: ${id} actualizado a 'approved'.`);

        return productUpdates;
      });

      console.log('[RetaceoController] Transacción completada. Productos actualizados:', updatedProducts.length);
      res.status(200).json({ message: 'Retaceo aprobado y productos actualizados correctamente', updatedProducts });
    } catch (error: any) {
      console.error('[RetaceoController] Error al aprobar el retaceo:', error);
      res.status(500).json({ error: 'Error al aprobar el retaceo', details: error.message });
    }
  }
}
