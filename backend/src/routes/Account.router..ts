import type { Request, Response, Router } from "express";
import type { AccountController } from "../controllers/Account.controller";

export class AccountRoutes {
  private controller: AccountController;

  private router: Router;

  constructor(
    controller: AccountController,

    router: Router
  ) {
    (this.controller = controller), (this.router = router);
  }

  initRouter() {
    try {
      this.router.get("/accounts", (req: Request, res: Response) =>
        this.controller.getAll(req, res)
      );

      this.router.post("/accounts", (req: Request, res: Response) =>
        this.controller.create(req, res)
      );

      this.router.post("/login", (req: Request, res: Response) =>
        this.controller.login(req, res)
      );

      this.router.put("/accounts/:id", (req: Request, res: Response) =>
        this.controller.update(req, res)
      );

      this.router.delete("/accounts/:id", (req: Request, res: Response) =>
        this.controller.delete(req, res)
      );

      return this.router;
    } catch (error) {
      throw new Error(error as string);
    }
  }
}
