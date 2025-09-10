import express, { json, Router } from "express";
import { Enviroments } from "./envs/Enviroments.service";
import { CategoryRepository } from "./repositories/Category.repository";
import { CategoryController } from "./controllers/Category.controller";
import { CategoryRoutes } from "./routes/Category.router";
import cors from "cors";
import { SubCategoryRepository } from "./repositories/SubCategory.repository";
import { SubCategoryController } from "./controllers/SubCategory.controller";
import { SubCategoryRouter } from "./routes/SubCategory.router";
import { ProductRepository } from "./repositories/Product.repository";
import { ProductController } from "./controllers/Product.controller";
import { ProductRouter } from "./routes/Product.router";
import { AccountRepository } from "./repositories/Account.repository";
import { AccountController } from "./controllers/Account.controller";
import { AccountRoutes } from "./routes/Account.router.";
import cookieParser from "cookie-parser";
import vendorRouter from "./routes/Vendor.router";
import clientRouter from "./routes/Client.router";
import supplierRouter from "./routes/Supplier.router";
import supplierContactRouter from "./routes/SupplierContact.router";
import unitRouter from "./routes/Unit.router";
import quoteRouter from "./routes/Quote.router";
import buyOrderRouter from "./routes/BuyOrder.router";

export class Server {
  private server: express.Application;
  private port: typeof Enviroments.PORT;
  constructor(server: express.Application, port: typeof Enviroments.PORT) {
    (this.server = server), (this.port = port);
  }

  initServer() {
    try {
      this.server.use(json());
      this.server.use(
        cors({
          origin: "http://localhost:5173",
          credentials: true,
          methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        })
      );
      this.server.use(cookieParser());
      this.server.use("/api", this.initCategoryService());
      this.server.use("/api", this.initSubCategoryService());
      this.server.use("/api", this.initProductService());
      this.server.use("/api", this.initAccountService());
      this.server.use("/api/vendors", vendorRouter);
      this.server.use("/api/clients", clientRouter);
      this.server.use("/api/suppliers", supplierRouter);
      this.server.use("/api/supplier-contacts", supplierContactRouter);
      this.server.use("/api/units", unitRouter);
      this.server.use("/api/quotes", quoteRouter);
      this.server.use("/api/buy-orders", buyOrderRouter);

      this.server.listen(this.port, () => {
        console.log(`running server On http://localhost:${this.port}`);
      });
    } catch (error) {
      throw new Error(error as string);
    }
  }

  initCategoryService() {
    try {
      const repository = new CategoryRepository();

      const controller = new CategoryController(repository);

      const router = new CategoryRoutes(controller, Router());

      return router.initRouter();
    } catch (error) {
      throw new Error(error as string);
    }
  }

  initSubCategoryService() {
    try {
      const repository = new SubCategoryRepository();

      const controller = new SubCategoryController(repository);

      const router = new SubCategoryRouter(controller, Router());

      return router.initRouter();
    } catch (error) {
      throw new Error(error as string);
    }
  }

  initProductService() {
    try {
      const repository = new ProductRepository();

      const controller = new ProductController(repository);

      const router = new ProductRouter(controller, Router());
      return router.initRouter();
    } catch (error) {
      throw new Error(error as string);
    }
  }

  initAccountService() {
    try {
      const repository = new AccountRepository();

      const controller = new AccountController(repository);

      const router = new AccountRoutes(controller, Router());
      return router.initRouter();
    } catch (error) {
      throw new Error(error as string);
    }
  }
}
