import { PrismaClient } from "../generated/prisma";
import type {
  AccountRepositoryInterface,
  AccountsInterface,
} from "../interfaces/Account.interface";

import jwt from "jsonwebtoken";

interface LoginData {
  email: string;
  password: string;
}

export class AccountRepository implements AccountRepositoryInterface {
  private postgresql = new PrismaClient();

  async getAll(): Promise<AccountsInterface[]> {
    try {
      const request = await this.postgresql.accounts.findMany();

      return request as AccountsInterface[];
    } catch (error) {
      throw new Error(error as string);
    }
  }
  async create(data: Partial<AccountsInterface>): Promise<AccountsInterface> {
    try {
      const request = await this.postgresql.accounts.create({ data });

      return request as AccountsInterface;
    } catch (error) {
      throw new Error(error as string);
    }
  }
  async update(
    id: number,
    data: Partial<AccountsInterface>
  ): Promise<AccountsInterface> {
    try {
      const request = await this.postgresql.accounts.update({
        where: {
          id: id,
        },
        data: data,
      });

      return request as AccountsInterface;
    } catch (error) {
      throw new Error(error as string);
    }
  }
  async delete(id: number): Promise<AccountsInterface> {
    try {
      const request = await this.postgresql.accounts.delete({
        where: {
          id: id,
        },
      });

      return request as AccountsInterface;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async authLogin(data: LoginData) {
    try {
      const searchUser = await this.postgresql.accounts.findFirst({
        where: {
          email: data.email,
        },
      });

      if (searchUser) {
        if (searchUser.password === data.password) {
          return jwt.sign(searchUser, Bun.env.JWT as string);
        } else {
          return "login failed , password is incorrect";
        }
      } else {
        return "user not exist";
      }
    } catch (error) {
      throw new Error(error as string);
    }
  }
}
