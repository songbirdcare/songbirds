import { ZChangeRoleRequest } from "@songbird/precedent-iso";
import express from "express";

import type { UserService } from "../services/user-service";

export class AdminUserRouter {
  constructor(private readonly userService: UserService) {}

  init() {
    const router = express.Router();

    router.get(
      "/list-users",
      async (_: express.Request, res: express.Response) => {
        const users = await this.userService.list();
        res.json({ data: users });
      }
    );

    router.get(
      "/impersonate",
      async (req: express.Request, res: express.Response) => {
        if (!req.impersonatingUser) {
          throw new Error("user is not impersonating anyone");
        }
        res.json({ user: req.user, impersonatingUser: req.impersonatingUser });
      }
    );

    router.put(
      "/change-role",
      async (req: express.Request, res: express.Response) => {
        const body = ZChangeRoleRequest.parse(req.body);
        if (body.userId === req.user.id) {
          throw new Error("cannot change your own role");
        }
        const user = await this.userService.changeRole(body.userId, body.role);
        res.json({ data: user });
      }
    );

    router.delete(
      "/user/:userId",
      async (req: express.Request, res: express.Response) => {
        const userId = req.params.userId;
        if (typeof userId !== "string") {
          throw new Error("invalid userId");
        }
        if (userId === req.user.id || userId === req.impersonatingUser?.id) {
          throw new Error("cannot delete your own user");
        }

        await this.userService.delete(userId);
        res.json({ data: "ok" });
      }
    );

    return router;
  }
}
