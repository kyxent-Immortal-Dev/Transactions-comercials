import { useCallback, useEffect, useState } from "react";
import { Client, CreateClientRequest, UpdateClientRequest } from "../interfaces/Client.interface";
import { ClientService } from "../services/api/Client.service";
import { HttpClient } from "../services/http.client.service";

export const useClientService = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);

  const service = new ClientService(HttpClient);

  const getAll = useCallback(async () => {
    try {
      setLoading(true);
      const response = await service.getAll();
      setClients(response);
    } catch (error) {
      throw new Error(error as string);
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (data: CreateClientRequest) => {
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

  const deleteClient = useCallback(async (id: number) => {
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

  const update = useCallback(async (id: number, data: UpdateClientRequest) => {
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
    clients,
    loading,
    create,
    deleteClient,
    update,
    refresh: getAll,
  };
};