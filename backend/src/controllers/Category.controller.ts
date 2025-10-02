import type { Request, Response } from "express";
import type { CategoryRepository } from "../repositories/Category.repository";

export class CategoryController {
  private repository: CategoryRepository;

  constructor(repository: CategoryRepository) {
    this.repository = repository;
  }

  async getAll(req: Request, res: Response) {
    try {
      const response = await this.repository.getAll();

      res.status(200).json({
        msj: "categories get successfully",
        data: response.map((item) => item),
      });
    } catch (error) {
      res.status(500).json({
        msj: "server error unknown",
        error: error instanceof Error,
      });
      throw new Error(error as string);
    }
  }

  async create(req: Request, res: Response) {
    try {
      const response = await this.repository.create(req.body);

      res.status(201).json({
        msj: "category create successfully",
        data: response,
      });
    } catch (error) {
      res.status(500).json({
        msj: "server error unknown",
        error: error instanceof Error,
      });
      throw new Error(error as string);
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const response = await this.repository.update(
        parseInt(id as string),
        req.body
      );

      res.status(200).json({
        msj: "category updated successfully",
        data: response,
      });
    } catch (error) {
      res.status(500).json({
        msj: "server error unknown",
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
        msj: "category deleted successfully",
        data: response,
      });
    } catch (error) {
      res.status(500).json({
        msj: "server error unknown",
        error: error instanceof Error,
      });
      throw new Error(error as string);
    }
  }
  async _(req: Request, res: Response) {}
}
