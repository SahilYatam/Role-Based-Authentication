import { Router } from "express";
import { roleRequestController } from "../controllers/roleRequest.controller.js";

import { validateRequest } from "../middlewares/joiValidation.middleware.js";

import { authentication } from "../middlewares/auth.middleware.js";

import { authorizeRole, authorizePermission } from "../middlewares/authorizeRole.middleware.js";

import { roleRequestValidate } from "../validators/roleRequest.validator.js";

const router = Router();

router.post(
    "/apply-roleRequest",
    authentication,
    validateRequest(roleRequestValidate.applyRoleRequestSchema),
    roleRequestController.applyRoleRequest
);

router.get(
    "/get-role-request",
    authentication,
    authorizeRole(process.env.ROLE_SUPER_ADMIN, process.env.ROLE_ADMIN),
    authorizePermission("adminPanelAccess"),
    roleRequestController.getRoleRequest
)

router.post(
    "/approve-role/:requestId",
    authentication,
    authorizeRole(process.env.ROLE_SUPER_ADMIN, process.env.ROLE_ADMIN),
    authorizePermission("adminPanelAccess"),
    validateRequest(roleRequestValidate.approveRoleSchema, "params"),
    roleRequestController.approveRole
);

router.post(
    "/reject-role/:requestId",
    authentication,
    authorizeRole(process.env.ROLE_SUPER_ADMIN, process.env.ROLE_ADMIN),
    authorizePermission("adminPanelAccess"),
    validateRequest(roleRequestValidate.rejectRoleSchema, "params"),
    roleRequestController.rejectRole
);

export default router;
