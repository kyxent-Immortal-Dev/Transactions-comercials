import { useCallback, useEffect, useState } from "react";
import type { CategoryI } from "../interfaces/Category.interfaces";
import { CategoryService } from "../services/api/Category.service";
import { HttpClient } from "../services/http.client.service";

export const useCategoryService = () => {
  const [categories, setCategories] = useState<CategoryI[]>([]);

  const service = new CategoryService(HttpClient);

  const getAll = useCallback(async () => {
    try {
      const response = await service.getAll();

      setCategories(response.data);
    } catch (error) {
      throw new Error(error as string);
    }
  }, []);

  const create = useCallback(async (data: Partial<CategoryI>) => {
    try {
      await service.create(data);
      getAll();
    } catch (error) {
      throw new Error(error as string);
    }
  }, []);

  const deleted = useCallback(async (id: string) => {
    try {
      await service.delete(id);
      getAll();
    } catch (error) {
      throw new Error(error as string);
    }
  }, []);

  const update = useCallback(async (id: string, data: Partial<CategoryI>) => {
    try {
      await service.update(id, data);
      getAll();
    } catch (error) {
      throw new Error(error as string);
    }
  }, []);

  useEffect(() => {
    try {
      getAll();
    } catch (error) {
      throw new Error(error as string);
    }
  }, []);

  return {
    categories,
    create,
    deleted,
    update,
  };
};
