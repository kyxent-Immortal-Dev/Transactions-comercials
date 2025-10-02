import type { Request, Response } from "express";
import type { SubCategoryRepository } from "../repositories/SubCategory.repository";

export class SubCategoryController {
  private repository: SubCategoryRepository;

  constructor(repository: SubCategoryRepository) {
    this.repository = repository;
  }

  async getAll(req: Request, res: Response) {
    try {
      const response = await this.repository.getAll();

      res.status(200).json({
        msj: "sub categories get successfully",
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

  async getByCategory(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const response = await this.repository.getByCategory(
        parseInt(id as string)
      );

      res.status(200).json({
        msj: "get sub categories by category succesfully",
        data: response.map((item) => item),
      });
    } catch (error) {
      res.status(500).json({
        msj: "server error",
        error: error,
      });
      throw new Error(error as string);
    }
  }

  async create(req: Request, res: Response) {
    const { name, description, categoryid } = req.body;
    try {
      const response = await this.repository.create({
        name,
        description,
        categoryid: parseInt(categoryid),
      });

      res.status(201).json({
        msj: "created subcategory successfully",
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

  async updated(req: Request, res: Response) {
    const { id } = req.params;
    const { name, description, categoryid } = req.body;
    try {
      const response = await this.repository.update(parseInt(id as string), {
        name,
        description,
        categoryid: parseInt(categoryid),
      });

      res.status(200).json({
        msj: "sub category updated successfully",
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
        msj: "deleted sub category successfully",
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
