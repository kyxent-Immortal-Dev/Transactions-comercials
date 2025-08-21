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

export class Server {
  private server: express.Application;
  private port: typeof Enviroments.PORT;
  constructor(server: express.Application, port: typeof Enviroments.PORT) {
    (this.server = server), (this.port = port);
  }

  initServer() {
    try {
      this.server.use(json());
      this.server.use(cors());
      this.server.use("/api", this.initCategoryService());
      this.server.use("/api", this.initSubCategoryService());
      this.server.use("/api", this.initProductService());

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
}
