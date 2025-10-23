import { useCallback, useEffect, useState } from "react";
import type {
  OrderLog,
  CreateOrderLogRequest,
  UpdateOrderLogRequest
} from "../interfaces/Retaceo.interface";
import { OrderLogService } from "../services/api/OrderLog.service";
import { HttpClient } from "../services/http.client.service";

export const useOrderLogService = () => {
  const [orderLogs, setOrderLogs] = useState<OrderLog[]>([]);
  const [loading, setLoading] = useState(false);

  const service = new OrderLogService(HttpClient);

  const getAll = useCallback(async () => {
    try {
      setLoading(true);
      const response = await service.getAll();
      setOrderLogs(response);
    } catch (error) {
      throw new Error(error as string);
    } finally {
      setLoading(false);
    }
  }, []);

  const getByBuyOrderId = useCallback(async (buyOrderId: number) => {
    try {
      setLoading(true);
      const response = await service.getByBuyOrderId(buyOrderId);
      setOrderLogs(response);
      return response;
    } catch (error) {
      throw new Error(error as string);
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (data: CreateOrderLogRequest) => {
    try {
      setLoading(true);
      const created = await service.create(data);
      await getByBuyOrderId(data.buy_order_id);
      return created;
    } catch (error) {
      throw new Error(error as string);
    } finally {
      setLoading(false);
    }
  }, [getByBuyOrderId]);

  const deleteOrderLog = useCallback(async (id: number, buyOrderId: number) => {
    try {
      setLoading(true);
      await service.delete(id);
      await getByBuyOrderId(buyOrderId);
    } catch (error) {
      throw new Error(error as string);
    } finally {
      setLoading(false);
    }
  }, [getByBuyOrderId]);

  const update = useCallback(async (id: number, data: UpdateOrderLogRequest) => {
    try {
      setLoading(true);
      const updated = await service.update(id, data);
      if (data.buy_order_id) {
        await getByBuyOrderId(data.buy_order_id);
      }
      return updated;
    } catch (error) {
      throw new Error(error as string);
    } finally {
      setLoading(false);
    }
  }, [getByBuyOrderId]);

  useEffect(() => {
    getAll();
  }, [getAll]);

  return {
    orderLogs,
    loading,
    create,
    deleteOrderLog,
    update,
    refresh: getAll,
    getByBuyOrderId,
  };
};
