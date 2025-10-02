import { useCallback, useEffect, useState } from "react";
import { BuyOrder, BuyOrderDetail, CreateBuyOrderRequest, UpdateBuyOrderRequest, CreateBuyOrderDetailRequest, UpdateBuyOrderDetailRequest } from "../interfaces/BuyOrder.interface";
import { BuyOrderService } from "../services/api/BuyOrder.service";
import { HttpClient } from "../services/http.client.service";

export const useBuyOrderService = () => {
  const [buyOrders, setBuyOrders] = useState<BuyOrder[]>([]);
  const [buyOrderDetails, setBuyOrderDetails] = useState<BuyOrderDetail[]>([]);
  const [loading, setLoading] = useState(false);

  const service = new BuyOrderService(HttpClient);

  const getAll = useCallback(async () => {
    try {
      setLoading(true);
      const response = await service.getAll();
      setBuyOrders(response);
    } catch (error) {
      throw new Error(error as string);
    } finally {
      setLoading(false);
    }
  }, []);

  const getBySupplierId = useCallback(async (supplierId: number) => {
    try {
      setLoading(true);
      const response = await service.getBySupplierId(supplierId);
      setBuyOrders(response);
    } catch (error) {
      throw new Error(error as string);
    } finally {
      setLoading(false);
    }
  }, []);

  const getByQuoteId = useCallback(async (quoteId: number) => {
    try {
      setLoading(true);
      const response = await service.getByQuoteId(quoteId);
      setBuyOrders(response);
    } catch (error) {
      throw new Error(error as string);
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (data: CreateBuyOrderRequest) => {
    try {
      setLoading(true);
      await service.create(data);
      await getAll();
    } catch (error) {
      throw new Error(error as string);
    } finally {
      setLoading(false);
    }
  }, [getAll]);

  const deleteBuyOrder = useCallback(async (id: number) => {
    try {
      setLoading(true);
      await service.delete(id);
      await getAll();
    } catch (error) {
      throw new Error(error as string);
    } finally {
      setLoading(false);
    }
  }, [getAll]);

  const update = useCallback(async (id: number, data: UpdateBuyOrderRequest) => {
    try {
      setLoading(true);
      await service.update(id, data);
      await getAll();
    } catch (error) {
      throw new Error(error as string);
    } finally {
      setLoading(false);
    }
  }, [getAll]);

  // Buy Order Details methods
  const getDetailsByBuyOrderId = useCallback(async (buyOrderId: number) => {
    try {
      setLoading(true);
      const response = await service.getDetailsByBuyOrderId(buyOrderId);
      setBuyOrderDetails(response);
    } catch (error) {
      throw new Error(error as string);
    } finally {
      setLoading(false);
    }
  }, []);

  const createDetail = useCallback(async (data: CreateBuyOrderDetailRequest) => {
    try {
      setLoading(true);
      await service.createDetail(data);
      if (data.buy_order_id) {
        await getDetailsByBuyOrderId(data.buy_order_id);
      }
    } catch (error) {
      throw new Error(error as string);
    } finally {
      setLoading(false);
    }
  }, [getDetailsByBuyOrderId]);

  const deleteBuyOrderDetail = useCallback(async (id: number, buyOrderId: number) => {
    try {
      setLoading(true);
      await service.deleteDetail(id);
      await getDetailsByBuyOrderId(buyOrderId);
    } catch (error) {
      throw new Error(error as string);
    } finally {
      setLoading(false);
    }
  }, [getDetailsByBuyOrderId]);

  const updateDetail = useCallback(async (id: number, data: UpdateBuyOrderDetailRequest, buyOrderId: number) => {
    try {
      setLoading(true);
      await service.updateDetail(id, data);
      await getDetailsByBuyOrderId(buyOrderId);
    } catch (error) {
      throw new Error(error as string);
    } finally {
      setLoading(false);
    }
  }, [getDetailsByBuyOrderId]);

  useEffect(() => {
    getAll();
  }, [getAll]);

  return {
    buyOrders,
    buyOrderDetails,
    loading,
    create,
    deleteBuyOrder,
    update,
    refresh: getAll,
    getBySupplierId,
    getByQuoteId,
    getDetailsByBuyOrderId,
    createDetail,
    deleteBuyOrderDetail,
    updateDetail,
  };
};