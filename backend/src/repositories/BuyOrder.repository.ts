import { PrismaClient } from '../generated/prisma';
import { BuyOrderRepositoryInterface } from '../interfaces/BuyOrderRepository.interface';
import { BuyOrder, BuyOrderDetail, CreateBuyOrderRequest, UpdateBuyOrderRequest, CreateBuyOrderDetailRequest, UpdateBuyOrderDetailRequest } from '../interfaces/BuyOrder.interface';

export class BuyOrderRepositoryImpl implements BuyOrderRepositoryInterface {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findAll(): Promise<BuyOrder[]> {
    return await this.prisma.buy_orders.findMany({
      include: {
        supplier: true,
        quote: true,
        buy_order_details: {
          include: {
            product: true
          }
        }
      },
      orderBy: { date: 'desc' }
    });
  }

  async findById(id: number): Promise<BuyOrder | null> {
    return await this.prisma.buy_orders.findUnique({
      where: { id },
      include: {
        supplier: true,
        quote: true,
        buy_order_details: {
          include: {
            product: true
          }
        }
      }
    });
  }

  async findBySupplierId(supplierId: number): Promise<BuyOrder[]> {
    return await this.prisma.buy_orders.findMany({
      where: { supplier_id: supplierId },
      include: {
        supplier: true,
        quote: true,
        buy_order_details: {
          include: {
            product: true
          }
        }
      },
      orderBy: { date: 'desc' }
    });
  }

  async findByQuoteId(quoteId: number): Promise<BuyOrder[]> {
    return await this.prisma.buy_orders.findMany({
      where: { quote_id: quoteId },
      include: {
        supplier: true,
        quote: true,
        buy_order_details: {
          include: {
            product: true
          }
        }
      },
      orderBy: { date: 'desc' }
    });
  }

  async create(buyOrder: CreateBuyOrderRequest): Promise<BuyOrder> {
    return await this.prisma.buy_orders.create({
      data: buyOrder,
      include: {
        supplier: true,
        quote: true,
        buy_order_details: {
          include: {
            product: true
          }
        }
      }
    });
  }

  async update(id: number, buyOrder: UpdateBuyOrderRequest): Promise<BuyOrder | null> {
    try {
      return await this.prisma.buy_orders.update({
        where: { id },
        data: buyOrder,
        include: {
          supplier: true,
          quote: true,
          buy_order_details: {
            include: {
              product: true
            }
          }
        }
      });
    } catch (error) {
      return null;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.prisma.buy_orders.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  // Buy Order Details methods
  async createDetail(detail: CreateBuyOrderDetailRequest): Promise<BuyOrderDetail> {
    return await this.prisma.buy_order_details.create({
      data: detail,
      include: {
        product: true
      }
    });
  }

  async findDetailsByBuyOrderId(buyOrderId: number): Promise<BuyOrderDetail[]> {
    return await this.prisma.buy_order_details.findMany({
      where: { buy_order_id: buyOrderId },
      include: {
        product: true
      }
    });
  }

  async findDetailById(id: number): Promise<BuyOrderDetail | null> {
    return await this.prisma.buy_order_details.findUnique({
      where: { id },
      include: {
        product: true
      }
    });
  }

  async updateDetail(id: number, detail: UpdateBuyOrderDetailRequest): Promise<BuyOrderDetail | null> {
    try {
      return await this.prisma.buy_order_details.update({
        where: { id },
        data: detail,
        include: {
          product: true
        }
      });
    } catch (error) {
      return null;
    }
  }

  async deleteDetail(id: number): Promise<boolean> {
    try {
      await this.prisma.buy_order_details.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}