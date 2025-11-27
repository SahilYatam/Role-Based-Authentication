import { Router } from "express";
import { authentication } from "../middlewares/auth.middleware.js";

import {
  authorizeRole,
  authorizePermission,
} from "../middlewares/authorizeRole.middleware.js";

import { userController } from "../controllers/user.controller.js";

const router = Router();

router.get("/me", authentication, userController.getUser);

router.get(
  "/users",
  authentication,
  authorizeRole(process.env.ROLE_SUPER_ADMIN, process.env.ROLE_ADMIN),
  authorizePermission("adminPanelAccess"),
  userController.getUserByRole
);

export default router;