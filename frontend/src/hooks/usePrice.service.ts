import { useState, useEffect, useCallback } from "react";
import { HttpClient } from "../services/http.client.service";
import { PriceService } from "../services/api/Price.service";
import type {
  Price,
  CreatePriceRequest,
  UpdatePriceRequest,
  PriceHistory,
  CreatePriceHistoryRequest,
  UpdatePriceHistoryRequest
} from "../interfaces/Price.interface";

const priceService = new PriceService(HttpClient);

export const usePrice = () => {
  const [prices, setPrices] = useState<Price[]>([]);
  const [price, setPrice] = useState<Price | null>(null);
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ===== PRICE METHODS =====

  const getAllPrices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await priceService.getAllPrices();
      setPrices(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al obtener los precios";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getPriceById = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await priceService.getPriceById(id);
      setPrice(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al obtener el precio";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getCurrentPriceByProductId = async (productId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await priceService.getCurrentPriceByProductId(productId);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al obtener el precio actual";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createPrice = async (data: CreatePriceRequest) => {
    setLoading(true);
    setError(null);
    try {
      const newPrice = await priceService.createPrice(data);
      setPrices((prev) => [...prev, newPrice]);
      return newPrice;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al crear el precio";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePrice = async (id: number, data: UpdatePriceRequest) => {
    setLoading(true);
    setError(null);
    try {
      const updatedPrice = await priceService.updatePrice(id, data);
      setPrices((prev) =>
        prev.map((p) => (p.id === id ? updatedPrice : p))
      );
      if (price?.id === id) {
        setPrice(updatedPrice);
      }
      return updatedPrice;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al actualizar el precio";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePrice = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await priceService.deletePrice(id);
      setPrices((prev) => prev.filter((p) => p.id !== id));
      if (price?.id === id) {
        setPrice(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al eliminar el precio";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ===== PRICE HISTORY METHODS =====

  const getAllPriceHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await priceService.getAllPriceHistory();
      setPriceHistory(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al obtener el historial";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getPriceHistoryById = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await priceService.getPriceHistoryById(id);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al obtener el historial";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getPriceHistoryByProductId = async (productId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await priceService.getPriceHistoryByProductId(productId);
      setPriceHistory(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al obtener el historial del producto";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getPriceHistoryByAnalysisId = async (analysisId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await priceService.getPriceHistoryByAnalysisId(analysisId);
      setPriceHistory(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al obtener el historial del análisis";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createPriceHistory = async (data: CreatePriceHistoryRequest) => {
    setLoading(true);
    setError(null);
    try {
      const newHistory = await priceService.createPriceHistory(data);
      setPriceHistory((prev) => [...prev, newHistory]);
      return newHistory;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al crear el historial";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePriceHistory = async (id: number, data: UpdatePriceHistoryRequest) => {
    setLoading(true);
    setError(null);
    try {
      const updatedHistory = await priceService.updatePriceHistory(id, data);
      setPriceHistory((prev) =>
        prev.map((h) => (h.id === id ? updatedHistory : h))
      );
      return updatedHistory;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al actualizar el historial";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePriceHistory = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await priceService.deletePriceHistory(id);
      setPriceHistory((prev) => prev.filter((h) => h.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al eliminar el historial";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    getAllPrices();
    getAllPriceHistory();
  }, [getAllPrices, getAllPriceHistory]);

  return {
    // State
    prices,
    price,
    priceHistory,
    loading,
    error,
    // Price methods
    getAllPrices,
    getPriceById,
    getCurrentPriceByProductId,
    createPrice,
    updatePrice,
    deletePrice,
    // Price History methods
    getAllPriceHistory,
    getPriceHistoryById,
    getPriceHistoryByProductId,
    getPriceHistoryByAnalysisId,
    createPriceHistory,
    updatePriceHistory,
    deletePriceHistory,
  };
};
