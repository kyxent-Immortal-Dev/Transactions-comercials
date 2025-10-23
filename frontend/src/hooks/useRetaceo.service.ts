import { useCallback, useEffect, useState } from "react";
import type {
  Retaceo,
  CreateRetaceoRequest,
  UpdateRetaceoRequest,
  RetaceoDetail,
  CreateRetaceoDetailRequest,
  UpdateRetaceoDetailRequest
} from "../interfaces/Retaceo.interface";
import { RetaceoService } from "../services/api/Retaceo.service";
import { HttpClient } from "../services/http.client.service";

export const useRetaceoService = () => {
  const [retaceos, setRetaceos] = useState<Retaceo[]>([]);
  const [retaceoDetails, setRetaceoDetails] = useState<RetaceoDetail[]>([]);
  const [loading, setLoading] = useState(false);

  const service = new RetaceoService(HttpClient);

  const getAll = useCallback(async () => {
    try {
      setLoading(true);
      const response = await service.getAll();
      setRetaceos(response);
    } catch (error) {
      throw new Error(error as string);
    } finally {
      setLoading(false);
    }
  }, []);

  const getByPurchaseId = useCallback(async (purchaseId: number) => {
    try {
      setLoading(true);
      const response = await service.getByPurchaseId(purchaseId);
      setRetaceos(response);
    } catch (error) {
      throw new Error(error as string);
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (data: CreateRetaceoRequest) => {
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

  const deleteRetaceo = useCallback(async (id: number) => {
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

  const update = useCallback(async (id: number, data: UpdateRetaceoRequest) => {
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

  // Retaceo Details methods
  const getDetailsByRetaceoId = useCallback(async (retaceoId: number) => {
    try {
      setLoading(true);
      const response = await service.getDetailsByRetaceoId(retaceoId);
      setRetaceoDetails(response);
    } catch (error) {
      throw new Error(error as string);
    } finally {
      setLoading(false);
    }
  }, []);

  const createDetail = useCallback(async (data: CreateRetaceoDetailRequest) => {
    try {
      setLoading(true);
      await service.createDetail(data);
      await getDetailsByRetaceoId(data.retaceo_id);
    } catch (error) {
      throw new Error(error as string);
    } finally {
      setLoading(false);
    }
  }, [getDetailsByRetaceoId]);

  const deleteRetaceoDetail = useCallback(async (id: number, retaceoId: number) => {
    try {
      setLoading(true);
      await service.deleteDetail(id);
      await getDetailsByRetaceoId(retaceoId);
    } catch (error) {
      throw new Error(error as string);
    } finally {
      setLoading(false);
    }
  }, [getDetailsByRetaceoId]);

  const updateDetail = useCallback(async (id: number, data: UpdateRetaceoDetailRequest, retaceoId: number) => {
    try {
      setLoading(true);
      await service.updateDetail(id, data);
      await getDetailsByRetaceoId(retaceoId);
    } catch (error) {
      throw new Error(error as string);
    } finally {
      setLoading(false);
    }
  }, [getDetailsByRetaceoId]);

  // Nuevas funciones para cálculo y aprobación
  const calculateRetaceo = useCallback(async (purchaseId: number) => {
    try {
      setLoading(true);
      return await service.calculateRetaceo(purchaseId);
    } catch (error) {
      throw new Error(error as string);
    } finally {
      setLoading(false);
    }
  }, []);

  const createWithCalculation = useCallback(async (data: { purchase_id: number; code?: string; num_invoice?: string; date?: string }) => {
    try {
      setLoading(true);
      const result = await service.createWithCalculation(data);
      await getAll();
      return result;
    } catch (error) {
      throw new Error(error as string);
    } finally {
      setLoading(false);
    }
  }, [getAll]);

  const approveRetaceo = useCallback(async (id: number) => {
    try {
      setLoading(true);
      const result = await service.approveRetaceo(id);
      await getAll();
      return result;
    } catch (error) {
      throw new Error(error as string);
    } finally {
      setLoading(false);
    }
  }, [getAll]);

  useEffect(() => {
    getAll();
  }, [getAll]);

  return {
    retaceos,
    retaceoDetails,
    loading,
    create,
    deleteRetaceo,
    update,
    refresh: getAll,
    getByPurchaseId,
    getDetailsByRetaceoId,
    createDetail,
    deleteRetaceoDetail,
    updateDetail,
    calculateRetaceo,
    createWithCalculation,
    approveRetaceo,
  };
};
