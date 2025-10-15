import { useState, useEffect, useCallback } from "react";
import { HttpClient } from "../services/http.client.service";
import { PriceAnalysisService } from "../services/api/PriceAnalysis.service";
import type {
  PriceAnalysis,
  CreatePriceAnalysisRequest,
  UpdatePriceAnalysisRequest,
  PriceAnalysisDetail,
  CreatePriceAnalysisDetailRequest,
  UpdatePriceAnalysisDetailRequest
} from "../interfaces/PriceAnalysis.interface";

const priceAnalysisService = new PriceAnalysisService(HttpClient);

export const usePriceAnalysis = () => {
  const [priceAnalyses, setPriceAnalyses] = useState<PriceAnalysis[]>([]);
  const [priceAnalysis, setPriceAnalysis] = useState<PriceAnalysis | null>(null);
  const [priceAnalysisDetails, setPriceAnalysisDetails] = useState<PriceAnalysisDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Price Analysis CRUD
  const getAllPriceAnalyses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await priceAnalysisService.getAll();
      setPriceAnalyses(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al obtener los análisis de precios";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getPriceAnalysisById = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await priceAnalysisService.getById(id);
      setPriceAnalysis(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al obtener el análisis de precio";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getPriceAnalysesByRetaceoId = async (retaceoId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await priceAnalysisService.getByRetaceoId(retaceoId);
      setPriceAnalyses(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al obtener los análisis";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createPriceAnalysis = async (data: CreatePriceAnalysisRequest) => {
    setLoading(true);
    setError(null);
    try {
      const newAnalysis = await priceAnalysisService.create(data);
      setPriceAnalyses((prev) => [...prev, newAnalysis]);
      return newAnalysis;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al crear el análisis de precio";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePriceAnalysis = async (id: number, data: UpdatePriceAnalysisRequest) => {
    setLoading(true);
    setError(null);
    try {
      const updatedAnalysis = await priceAnalysisService.update(id, data);
      setPriceAnalyses((prev) =>
        prev.map((a) => (a.id === id ? updatedAnalysis : a))
      );
      if (priceAnalysis?.id === id) {
        setPriceAnalysis(updatedAnalysis);
      }
      return updatedAnalysis;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al actualizar el análisis";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePriceAnalysis = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await priceAnalysisService.delete(id);
      setPriceAnalyses((prev) => prev.filter((a) => a.id !== id));
      if (priceAnalysis?.id === id) {
        setPriceAnalysis(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al eliminar el análisis";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Price Analysis Details CRUD
  const createPriceAnalysisDetail = async (data: CreatePriceAnalysisDetailRequest) => {
    setLoading(true);
    setError(null);
    try {
      const newDetail = await priceAnalysisService.createDetail(data);
      setPriceAnalysisDetails((prev) => [...prev, newDetail]);
      return newDetail;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al crear el detalle";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getPriceAnalysisDetails = async (analysisId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await priceAnalysisService.getDetails(analysisId);
      setPriceAnalysisDetails(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al obtener los detalles";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getPriceAnalysisDetailById = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await priceAnalysisService.getDetailById(id);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al obtener el detalle";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePriceAnalysisDetail = async (id: number, data: UpdatePriceAnalysisDetailRequest) => {
    setLoading(true);
    setError(null);
    try {
      const updatedDetail = await priceAnalysisService.updateDetail(id, data);
      setPriceAnalysisDetails((prev) =>
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

  const deletePriceAnalysisDetail = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await priceAnalysisService.deleteDetail(id);
      setPriceAnalysisDetails((prev) => prev.filter((d) => d.id !== id));
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
    getAllPriceAnalyses();
  }, [getAllPriceAnalyses]);

  return {
    priceAnalyses,
    priceAnalysis,
    priceAnalysisDetails,
    loading,
    error,
    getAllPriceAnalyses,
    getPriceAnalysisById,
    getPriceAnalysesByRetaceoId,
    createPriceAnalysis,
    updatePriceAnalysis,
    deletePriceAnalysis,
    createPriceAnalysisDetail,
    getPriceAnalysisDetails,
    getPriceAnalysisDetailById,
    updatePriceAnalysisDetail,
    deletePriceAnalysisDetail,
  };
};
