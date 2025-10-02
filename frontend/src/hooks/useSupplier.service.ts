import { useCallback, useEffect, useState } from "react";
import { Supplier, CreateSupplierRequest, UpdateSupplierRequest } from "../interfaces/Supplier.interface";
import { SupplierService } from "../services/api/Supplier.service";
import { HttpClient } from "../services/http.client.service";

export const useSupplierService = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);

  const service = new SupplierService(HttpClient);

  const getAll = useCallback(async () => {
    try {
      setLoading(true);
      const response = await service.getAll();
      setSuppliers(response);
    } catch (error) {
      throw new Error(error as string);
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (data: CreateSupplierRequest) => {
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

  const deleteSupplier = useCallback(async (id: number) => {
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

  const update = useCallback(async (id: number, data: UpdateSupplierRequest) => {
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

  useEffect(() => {
    getAll();
  }, [getAll]);

  return {
    suppliers,
    loading,
    create,
    deleteSupplier,
    update,
    refresh: getAll,
  };
};