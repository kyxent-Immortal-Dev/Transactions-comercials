import { useCallback, useEffect, useState } from "react";
import type { ProductInterface } from "../interfaces/Product.interface";
import { ProductService } from "../services/api/Product.service";
import { HttpClient } from "../services/http.client.service";
import type { SubCategory } from "../interfaces/SubCategory.interface";

export const useProductService = () => {
  const [products, setProducts] = useState<ProductInterface[]>([]);

  const service = new ProductService(HttpClient);

  const getAll = useCallback(async () => {
    try {
      const response = await service.getAll();

      setProducts(response.data);
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

  const deleted = useCallback(async (id: string) => {
    try {
      await service.deleted(id);
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
    products,
    create,
    updated,
    deleted,
  };
};
