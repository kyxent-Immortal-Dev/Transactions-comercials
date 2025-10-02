import type { Request, Response, Router } from "express";
import type { SubCategoryController } from "../controllers/SubCategory.controller";

export class SubCategoryRouter {
  private controller: SubCategoryController;
  private router: Router;

  constructor(controller: SubCategoryController, router: Router) {
    this.controller = controller;
    this.router = router;
  }

  initRouter() {
    try {
      this.router.get("/subcategories", (req: Request, res: Response) =>
        this.controller.getAll(req, res)
      );
      this.router.get("/subcategories/:id", (req: Request, res: Response) =>
        this.controller.getByCategory(req, res)
      );
      this.router.post("/subcategories", (req: Request, res: Response) =>
        this.controller.create(req, res)
      );
      this.router.put("/subcategories/:id", (req: Request, res: Response) =>
        this.controller.updated(req, res)
      );
      this.router.delete("/subcategories/:id", (req: Request, res: Response) =>
        this.controller.delete(req, res)
      );

      return this.router;
    } catch (error) {
      throw new Error(error as string);
    }
  }
}
