import { asyncHandler, ApiResponse } from "../utils/index.js";
import { roleService } from "../services/role.service.js";

const getAllRoles = asyncHandler(async(req, res) => {
    const roles = await roleService.getAllRoles();
    const message = !roles || roles.length === 0 ? "No roles created yet" : "Roles fetched successfully";

    return res.status(200).json(new ApiResponse(200, roles, message));
});

const getRoleByKey = asyncHandler(async(req, res) => {
    const key = req.param.key;
    const role = await roleService.getRoleByKey(key);

    return res.status(200).json(new ApiResponse(200, role, "Role fetehed successfully"));
});

const getDefaultRoles = asyncHandler(async(req, res) => {
    const defaultRoles = await roleService.getDefaultRoleId();
    return res.status(200, defaultRoles, "Default roles fetched successfully");
})

const assignRoleToUser = asyncHandler(async(req, res) => {
    const userId = req.user?._id;
    const newRoleKey = req.body;
    const actingUserKey = req.params.key;

    const {assignedRole} = await roleService.assignRoleToUser(userId, newRoleKey, actingUserKey);

    return res.status(200).json(new ApiResponse(200, assignedRole, `User has been successfully assigned the ${assignedRole} role.`,))
});

const updateRolePermissions = asyncHandler(async(req, res) => {
    const roleId = req.params.id
    const {updatedRole, roleName} = await roleService.updateRolePermissions(roleId, req.body);

    return res.status(200).json(new ApiResponse(200, updatedRole, `Permissions for '${roleName}' role updated successfully.`))
});

const deleteRole = asyncHandler(async(req, res) => {
    const roleId = req.params.id;
    const actingUserKey = req.params.key;

    const {message} = await roleService.deleteRole(roleId, actingUserKey);

    return res.status(200).json(new ApiResponse(200, {}, message));
})

export const roleController = {
    getAllRoles,
    getRoleByKey,
    getDefaultRoles,
    assignRoleToUser,
    updateRolePermissions,
    deleteRole
}