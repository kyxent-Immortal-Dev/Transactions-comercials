import { useCallback, useEffect, useState } from "react";
import { Quote, QuoteDetail, CreateQuoteRequest, UpdateQuoteRequest, CreateQuoteDetailRequest, UpdateQuoteDetailRequest } from "../interfaces/Quote.interface";
import { QuoteService } from "../services/api/Quote.service";
import { HttpClient } from "../services/http.client.service";

export const useQuoteService = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [quoteDetails, setQuoteDetails] = useState<QuoteDetail[]>([]);
  const [loading, setLoading] = useState(false);

  const service = new QuoteService(HttpClient);

  const getAll = useCallback(async () => {
    try {
      setLoading(true);
      const response = await service.getAll();
      setQuotes(response);
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
      setQuotes(response);
    } catch (error) {
      throw new Error(error as string);
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (data: CreateQuoteRequest) => {
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

  const deleteQuote = useCallback(async (id: number) => {
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

  const update = useCallback(async (id: number, data: UpdateQuoteRequest) => {
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

  // Quote Details methods
  const getDetailsByQuoteId = useCallback(async (quoteId: number) => {
    try {
      setLoading(true);
      const response = await service.getDetailsByQuoteId(quoteId);
      setQuoteDetails(response);
    } catch (error) {
      throw new Error(error as string);
    } finally {
      setLoading(false);
    }
  }, []);

  const createDetail = useCallback(async (data: CreateQuoteDetailRequest) => {
    try {
      setLoading(true);
      await service.createDetail(data);
      if (data.quote_id) {
        await getDetailsByQuoteId(data.quote_id);
      }
    } catch (error) {
      throw new Error(error as string);
    } finally {
      setLoading(false);
    }
  }, [getDetailsByQuoteId]);

  const deleteQuoteDetail = useCallback(async (id: number, quoteId: number) => {
    try {
      setLoading(true);
      await service.deleteDetail(id);
      await getDetailsByQuoteId(quoteId);
    } catch (error) {
      throw new Error(error as string);
    } finally {
      setLoading(false);
    }
  }, [getDetailsByQuoteId]);

  const updateDetail = useCallback(async (id: number, data: UpdateQuoteDetailRequest, quoteId: number) => {
    try {
      setLoading(true);
      await service.updateDetail(id, data);
      await getDetailsByQuoteId(quoteId);
    } catch (error) {
      throw new Error(error as string);
    } finally {
      setLoading(false);
    }
  }, [getDetailsByQuoteId]);

  useEffect(() => {
    getAll();
  }, [getAll]);

  return {
    quotes,
    quoteDetails,
    loading,
    create,
    deleteQuote,
    update,
    refresh: getAll,
    getBySupplierId,
    getDetailsByQuoteId,
    createDetail,
    deleteQuoteDetail,
    updateDetail,
  };
};