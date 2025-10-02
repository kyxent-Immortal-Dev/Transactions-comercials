import { useCallback, useEffect, useState } from "react";
import type { SubCategory } from "../interfaces/SubCategory.interface";
import { SubCategoryService } from "../services/api/SubCategory.service";
import { HttpClient } from "../services/http.client.service";

export const useSubCategoryService = () => {
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

  const service = new SubCategoryService(HttpClient);

  const getAll = useCallback(async () => {
    try {
      const response = await service.getAll();

      setSubCategories(response.data);
    } catch (error) {
      throw new Error(error as string);
    }
  }, []);

  const create = useCallback(async (data: Partial<SubCategory>) => {
    try {
      await service.create(data);
      getAll();
    } catch (error) {
      throw new Error(error as string);
    }
  }, []);

  const deleted = useCallback(async (id: string) => {
    try {
      await service.deleted(id);
      getAll();
    } catch (error) {
      throw new Error(error as string);
    }
  }, []);

  const updated = useCallback(
    async (id: string, data: Partial<SubCategory>) => {
      try {
        await service.updated(id, data);
        getAll();
      } catch (error) {
        throw new Error(error as string);
      }
    },
    []
  );

  useEffect(() => {
    try {
      getAll();
    } catch (error) {
      throw new Error(error as string);
    }
  }, []);

  return {
    subCategories,
    create,
    deleted,
    updated,
  };
};
