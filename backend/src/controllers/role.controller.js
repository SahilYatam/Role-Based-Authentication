import { asyncHandler, ApiResponse } from "../utils/index.js";
import { roleService } from "../services/role.service.js";

const getRoleByKey = asyncHandler(async(req, res) => {
    const key = req.params.key;
    const role = await roleService.getRoleByKey(key);

    return res.status(200).json(new ApiResponse(200, role, "Role fetehed successfully"));
});

const getDefaultRoles = asyncHandler(async(req, res) => {
    const defaultRoles = await roleService.getDefaultRoleId();
    return res.status(200, defaultRoles, "Default roles fetched successfully");
})

const assignRoleToUser = asyncHandler(async(req, res) => {
    const userId = req.params.id;
    const actingUserKey = req.user.role.key;
    const {newRoleKey} = req.body;

    const {assignedRole} = await roleService.assignRoleToUser(userId, actingUserKey, newRoleKey);

    return res.status(200).json(new ApiResponse(200, {role: assignedRole}, `User has been successfully assigned the ${assignedRole} role.`,))
});

export const roleController = {
    getRoleByKey,
    getDefaultRoles,
    assignRoleToUser,
}