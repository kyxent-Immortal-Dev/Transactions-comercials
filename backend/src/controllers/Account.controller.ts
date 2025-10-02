import type { Request, Response } from "express";
import type { AccountRepository } from "../repositories/Account.repository";

export class AccountController {
  private repository: AccountRepository;

  constructor(repository: AccountRepository) {
    this.repository = repository;
  }

  async getAll(req: Request, res: Response) {
    try {
      const response = await this.repository.getAll();

      res.status(200).json({
        msj: "get all accounts",
        data: response.map((item) => item),
      });
    } catch (error) {
      res.status(500).json({
        msj: "error de servidor",
        error: error instanceof Error,
      });
      throw new Error(error as string);
    }
  }

  async create(req: Request, res: Response) {
    try {
      const response = await this.repository.create(req.body);

      res.status(200).json({
        msj: "create user",
        data: response,
      });
    } catch (error) {
      res.status(500).json({
        msj: "error de servidor",
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
        msj: "update account",
        data: response,
      });
    } catch (error) {
      res.status(500).json({
        msj: "error de servidor",
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
        msj: "delete account",
        data: response,
      });
    } catch (error) {
      res.status(500).json({
        msj: "error de servidor",
        error: error instanceof Error,
      });
      throw new Error(error as string);
    }
  }

  async login(req: Request, res: Response) {
    try {
      const response = await this.repository.authLogin(req.body);

      if (response == "login failed , password is incorrect") {
        res.status(401).json({
          msj: "not authorized",
          data: response,
        });
      }

      if (response == "user not exist") {
        res.status(401).json({
          msj: "not authorized",
          data: response,
        });
      } else {
        res.cookie("token", response, {
          sameSite: "strict",
          secure: true,
          httpOnly: false,
          maxAge: 3600 * 100 * 200,
        });

        res.status(200).json({
          msj: "login sucessfully",
          data: response,
        });
      }
    } catch (error) {
      throw new Error(error as string);
    }
  }
}
