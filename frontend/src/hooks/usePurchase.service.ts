import { useState, useEffect, useCallback } from "react";
import { HttpClient } from "../services/http.client.service";
import { PurchaseService } from "../services/api/Purchase.service";
import type {
  Purchase,
  CreatePurchaseRequest,
  UpdatePurchaseRequest,
  PurchaseDetail,
  CreatePurchaseDetailRequest,
  UpdatePurchaseDetailRequest
} from "../interfaces/Purchase.interface";

const purchaseService = new PurchaseService(HttpClient);

export const usePurchase = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [purchaseDetails, setPurchaseDetails] = useState<PurchaseDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Purchase CRUD
  const getAllPurchases = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await purchaseService.getAll();
      setPurchases(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al obtener las compras";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getPurchaseById = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await purchaseService.getById(id);
      setPurchase(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al obtener la compra";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getPurchasesByBuyOrderId = async (buyOrderId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await purchaseService.getByBuyOrderId(buyOrderId);
      setPurchases(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al obtener las compras";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createPurchase = async (data: CreatePurchaseRequest) => {
    setLoading(true);
    setError(null);
    try {
      const newPurchase = await purchaseService.create(data);
      setPurchases((prev) => [...prev, newPurchase]);
      return newPurchase;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al crear la compra";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePurchase = async (id: number, data: UpdatePurchaseRequest) => {
    setLoading(true);
    setError(null);
    try {
      const updatedPurchase = await purchaseService.update(id, data);
      setPurchases((prev) =>
        prev.map((p) => (p.id === id ? updatedPurchase : p))
      );
      if (purchase?.id === id) {
        setPurchase(updatedPurchase);
      }
      return updatedPurchase;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al actualizar la compra";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePurchase = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await purchaseService.delete(id);
      setPurchases((prev) => prev.filter((p) => p.id !== id));
      if (purchase?.id === id) {
        setPurchase(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al eliminar la compra";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Purchase Details CRUD
  const createPurchaseDetail = async (data: CreatePurchaseDetailRequest) => {
    setLoading(true);
    setError(null);
    try {
      const newDetail = await purchaseService.createDetail(data);
      setPurchaseDetails((prev) => [...prev, newDetail]);
      return newDetail;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al crear el detalle";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getPurchaseDetailsByPurchaseId = async (purchaseId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await purchaseService.getDetailsByPurchaseId(purchaseId);
      setPurchaseDetails(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al obtener los detalles";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getPurchaseDetailById = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await purchaseService.getDetailById(id);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al obtener el detalle";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePurchaseDetail = async (id: number, data: UpdatePurchaseDetailRequest) => {
    setLoading(true);
    setError(null);
    try {
      const updatedDetail = await purchaseService.updateDetail(id, data);
      setPurchaseDetails((prev) =>
        prev.map((d) => (d.id === id ? updatedDetail : d))
      );
      return updatedDetail;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al actualizar el detalle";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePurchaseDetail = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await purchaseService.deleteDetail(id);
      setPurchaseDetails((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al eliminar el detalle";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    getAllPurchases();
  }, [getAllPurchases]);

  return {
    purchases,
    purchase,
    purchaseDetails,
    loading,
    error,
    getAllPurchases,
    getPurchaseById,
    getPurchasesByBuyOrderId,
    createPurchase,
    updatePurchase,
    deletePurchase,
    createPurchaseDetail,
    getPurchaseDetailsByPurchaseId,
    getPurchaseDetailById,
    updatePurchaseDetail,
    deletePurchaseDetail,
  };
};
