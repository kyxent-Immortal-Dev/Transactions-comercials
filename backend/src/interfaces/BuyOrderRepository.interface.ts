import { BuyOrder, BuyOrderDetail, CreateBuyOrderRequest, UpdateBuyOrderRequest, CreateBuyOrderDetailRequest, UpdateBuyOrderDetailRequest } from "./BuyOrder.interface";

export interface BuyOrderRepositoryInterface {
  create(data: CreateBuyOrderRequest): Promise<BuyOrder>;
  findAll(): Promise<BuyOrder[]>;
  findById(id: number): Promise<BuyOrder | null>;
  findBySupplierId(supplierId: number): Promise<BuyOrder[]>;
  findByQuoteId(quoteId: number): Promise<BuyOrder[]>;
  update(id: number, data: UpdateBuyOrderRequest): Promise<BuyOrder | null>;
  delete(id: number): Promise<boolean>;
  
  // Buy Order Details methods
  createDetail(data: CreateBuyOrderDetailRequest): Promise<BuyOrderDetail>;
  findDetailsByBuyOrderId(buyOrderId: number): Promise<BuyOrderDetail[]>;
  findDetailById(id: number): Promise<BuyOrderDetail | null>;
  updateDetail(id: number, data: UpdateBuyOrderDetailRequest): Promise<BuyOrderDetail | null>;
  deleteDetail(id: number): Promise<boolean>;
}