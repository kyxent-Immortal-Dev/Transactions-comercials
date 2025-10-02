import { useCallback, useEffect, useState } from "react";
import { SupplierContact, CreateSupplierContactRequest, UpdateSupplierContactRequest } from "../interfaces/SupplierContact.interface";
import { SupplierContactService } from "../services/api/SupplierContact.service";
import { HttpClient } from "../services/http.client.service";

export const useSupplierContactService = () => {
  const [supplierContacts, setSupplierContacts] = useState<SupplierContact[]>([]);
  const [loading, setLoading] = useState(false);

  const service = new SupplierContactService(HttpClient);

  const getAll = useCallback(async () => {
    try {
      setLoading(true);
      const response = await service.getAll();
      setSupplierContacts(response);
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
      setSupplierContacts(response);
    } catch (error) {
      throw new Error(error as string);
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (data: CreateSupplierContactRequest) => {
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

  const deleteSupplierContact = useCallback(async (id: number) => {
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

  const update = useCallback(async (id: number, data: UpdateSupplierContactRequest) => {
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
    supplierContacts,
    loading,
    create,
    deleteSupplierContact,
    update,
    refresh: getAll,
    getBySupplierId,
  };
};