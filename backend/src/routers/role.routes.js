import { Router } from "express";
import { roleController } from "../controllers/role.controller.js";

import { validateRequest } from "../middlewares/joiValidation.middleware.js";

import { authentication } from "../middlewares/auth.middleware.js";

import { authorizeRole, authorizePermission } from "../middlewares/authorizeRole.middleware.js";

import { roleValidate } from "../validators/role.validator.js";

/*
 * router.get(
  "/admin/dashboard",
  authenticateToken,
  authorizeRole(process.env.ROLE_SUPER_ADMIN, process.env.ROLE_ADMIN),
  authorizePermission("adminPanelAccess"),
  adminController.dashboard
);
*/

const router = Router();

router.post(
  "/assign-role/:key",
  authentication,
  authorizeRole(process.env.ROLE_SUPER_ADMIN, process.env.ROLE_ADMIN),
  authorizePermission("adminPanelAccess"),
  validateRequest(roleValidate.assignRoleToUserSchema, ["body", "params"]),
  roleController.assignRoleToUser
);

router.post(
  "/update-role/:id",
  authentication,
  authorizeRole(process.env.ROLE_SUPER_ADMIN, process.env.ROLE_ADMIN),
  authorizePermission("adminPanelAccess"),
  validateRequest(roleValidate.updateRolePermissionsSchema, ["body", "params"]),
  roleController.updateRolePermissions
);

router.delete(
  "/delete-role/:id/:key",
  authentication,
  authorizeRole(process.env.ROLE_SUPER_ADMIN, process.env.ROLE_ADMIN),
  authorizePermission("adminPanelAccess"),
  validateRequest(roleValidate.deleteRoleSchema, "params"),
  roleController.deleteRole
);

router.get(
  "/roles",
  authentication,
  authorizeRole(process.env.ROLE_SUPER_ADMIN, process.env.ROLE_ADMIN),
  authorizePermission("adminPanelAccess"),
  validateRequest(roleValidate.getAllRolesSchema),
  roleController.getAllRoles
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
