import type { Request, Response } from "express";
import type { ProductRepository } from "../repositories/Product.repository";

export class ProductController {
  private repository: ProductRepository;

  constructor(repository: ProductRepository) {
    this.repository = repository;
  }

  async getAll(req: Request, res: Response) {
    try {
      const response = await this.repository.getAll();

      res.status(200).json({
        msj: "get All products",
        data: response.map((item) => item),
      });
    } catch (error) {
      res.status(500).json({
        msj: "server error",
        error: error instanceof Error,
      });
      throw new Error(error as string);
    }
  }

  async getBySubCategory(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const response = await this.repository.getBySubCategory(
        parseInt(id as string)
      );

      res.status(200).json({
        msj: "get products by sub category",
        data: response,
      });
    } catch (error) {
      res.status(500).json({
        msj: "server error",
        error: error instanceof Error,
      });
      throw new Error(error as string);
    }
  }

  async create(req: Request, res: Response) {
    const { name, price, description, image, amount, subcategoriesid } =
      req.body;

    try {
      const response = await this.repository.create({
        name,
        price: parseFloat(price),
        description,
        image,
        amount: parseInt(amount),
        subcategoriesid: parseInt(subcategoriesid),
      });
      res.status(201).json({
        msj: "product created",
        data: response,
      });
    } catch (error) {
      res.status(500).json({
        msj: "server error",
        error: error instanceof Error,
      });
      throw new Error(error as string);
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { name, price, description, image, amount, subcategoriesid } =
      req.body;

    try {
      const response = await this.repository.update(parseInt(id as string), {
        name,
        price: parseFloat(price),
        description,
        image,
        amount: parseInt(amount),
        subcategoriesid: parseInt(subcategoriesid),
      });

      res.status(200).json({
        msj: "updated product",
        data: response,
      });
    } catch (error) {
      res.status(500).json({
        msj: "server error",
        error: error instanceof Error,
      });
      throw new Error(error as string);
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const response = await this.repository.delete(parseInt(id as string));

      res.status(200).json({
        msj: "deleted product",
        data: response,
      });
    } catch (error) {
      res.status(500).json({
        msj: "server error",
        error: error instanceof Error,
      });
      throw new Error(error as string);
    }
  }
}
