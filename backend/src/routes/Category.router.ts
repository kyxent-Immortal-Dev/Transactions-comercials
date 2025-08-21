import type { Request, Response, Router } from "express";
import type { CategoryController } from "../controllers/Category.controller";

export class CategoryRoutes {
  private controller: CategoryController;
  private router: Router;

  constructor(controller: CategoryController, router: Router) {
    (this.controller = controller), (this.router = router);
  }

  initRouter() {
    try {
      this.router.get("/categories", (req: Request, res: Response) =>
        this.controller.getAll(req, res)
      );
      this.router.post("/categories", (req: Request, res: Response) =>
        this.controller.create(req, res)
      );
      this.router.put("/categories/:id", (req: Request, res: Response) =>
        this.controller.update(req, res)
      );
      this.router.delete("/categories/:id", (req: Request, res: Response) =>
        this.controller.delete(req, res)
      );

      return this.router;
    } catch (error) {
      throw new Error(error as string);
    }
  }
}
