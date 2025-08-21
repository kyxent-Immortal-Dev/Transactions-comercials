import type { Request, Response, Router } from "express";
import type { ProductController } from "../controllers/Product.controller";

export class ProductRouter {
  private controller: ProductController;
  private router: Router;

  constructor(controller: ProductController, router: Router) {
    this.controller = controller;
    this.router = router;
  }

  initRouter() {
    try {
      this.router.get("/products", (req: Request, res: Response) =>
        this.controller.getAll(req, res)
      );
      this.router.get("/products/:id", (req: Request, res: Response) =>
        this.controller.getBySubCategory(req, res)
      );

      this.router.post("/products", (req: Request, res: Response) =>
        this.controller.create(req, res)
      );
      this.router.put("/products/:id", (req: Request, res: Response) =>
        this.controller.update(req, res)
      );
      this.router.delete("/products/:id", (req: Request, res: Response) =>
        this.controller.delete(req, res)
      );

      return this.router;
    } catch (error) {
      throw new Error(error as string);
    }
  }
}
