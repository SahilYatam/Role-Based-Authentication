import { Router } from "express";
import { roleController } from "../controllers/role.controller.js";

import { validateRequest } from "../middlewares/joiValidation.middleware.js";

import { authentication } from "../middlewares/auth.middleware.js";

import { authorizeRole, authorizePermission } from "../middlewares/authorizeRole.middleware.js";

import { roleValidate } from "../validators/role.validator.js";

const router = Router();

router.post(
  "/assign-role/:id",
  authentication,
  authorizeRole(process.env.ROLE_SUPER_ADMIN, process.env.ROLE_ADMIN),
  authorizePermission("adminPanelAccess"),
  validateRequest(roleValidate.assignRoleToUserSchema, ["body", "params"]),
  roleController.assignRoleToUser
);

router.get(
  "/roles-key/:key",
  authentication,
  authorizeRole(process.env.ROLE_SUPER_ADMIN, process.env.ROLE_ADMIN),
  authorizePermission("adminPanelAccess"),
  validateRequest(roleValidate.getRoleByKeySchema),
  roleController.getRoleByKey
);

router.get(
  "/default-roles",
  authentication,
  authorizeRole(process.env.ROLE_SUPER_ADMIN, process.env.ROLE_ADMIN),
  authorizePermission("adminPanelAccess"),
  validateRequest(roleValidate.getDefaultRolesSchema),
  roleController.getDefaultRoles
);

export default router;
