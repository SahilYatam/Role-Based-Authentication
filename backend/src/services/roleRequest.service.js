import { roleRepo } from "../repositories/role.repository.js";
import { roleRequestRepo } from "../repositories/roleRequest.repository.js";
import { userRepo } from "../repositories/user.repository.js";
import { logger, ApiError } from "../utils/index.js";

const ROLE_KEYS = {
    SUPER_ADMIN: process.env.ROLE_SUPER_ADMIN,
    ADMIN: process.env.ROLE_ADMIN,
    EDITOR: process.env.ROLE_EDITOR,
    MEMBER: process.env.ROLE_MEMBER
}

export const roleRequestService = {
    async applyRoleRequest (userId, roleKey) {
        // Validate the role exists and is allowed
        const allowedRoles = ["EDITOR", "ADMIN"];
        if(!allowedRoles.includes(roleKey)){
            throw new ApiError(403, "Invalid role");
        }

        // Look up the role objectId
        const role = await roleRepo.findRoleByKey(roleKey);
        if(!role) throw new ApiError(404, "Role not found");

        const requestedRole = await roleRequestRepo.createRoleRequest({
            user: userId,
            requestedRole: role._id,
            reviewedBy: null
        });
        return requestedRole;
    },

    async getRoleRequest () {
        const pendingRoleRequest = await roleRequestRepo.findPendingRequests()
        return pendingRoleRequest;
    },

    async approveRole (requestId, approverRole, approvalId) {
        const requestedRole = await roleRequestRepo.findRoleRequestById(requestId);

        if(!requestedRole) throw new ApiError(404, "Role request not found");

        if(!approverRole) throw new ApiError(403, "Approval role not found");

        // check if request is already procssed
        if(requestedRole.status !== "Pending") {
            logger.error("Attepted to approve a role request that is not pending", {
                requestId,
                currentStatus: requestedRole.status,
                userId: requestedRole.user?._id,
            });
            throw new ApiError(409, "Role request has already been processed");
        }

        // check if approver has permission
        if(approverRole !== ROLE_KEYS.SUPER_ADMIN && approverRole !== ROLE_KEYS.ADMIN){
            throw new ApiError(403, "Insufficient permissions to approve role requests");
        }

        // approve the role request
        const approvedRole = await roleRequestRepo.updateRoleRequestStatus(requestedRole._id, {
            status: "Approved",
            reviewedBy: approvalId,
        })

        //  update user role
        await userRepo.updateUserRole(
            requestedRole.user._id,
            requestedRole.requestedRole
        );

        logger.info(`User ${requestedRole.user} role updated to ${requestedRole.requestedRole}`);

        return approvedRole;
    },

    async rejectRoleRequest (requestId, rejecterRole, rejecterId) {
        const requestedRole = await roleRequestRepo.findRoleRequestById(requestId);
        if(!rejecterRole) throw new ApiError(403, "rejecter role not found");

        if(requestedRole.status !== "Pending"){
            logger.error("Attempted to reject a non-pending role request", {
                requestId,
                currentStatus: requestedRole.status,
                userId: requestedRole.user?._id
            });
            throw new ApiError( 401, "Role request cannot be rejected because it has already been processed.");
        }

        // Only SuperAdmin can reject Admin requests
        if (requestedRole.requestedRole.key === ROLE_KEYS.ADMIN &&
            rejecterRole !== ROLE_KEYS.SUPER_ADMIN
        ) {
            throw new ApiError(403, "Only SuperAdmin can reject requests for the Admin role.");
        }

        const rejectedRole = await roleRequestRepo.updateRoleRequestStatus(requestedRole._id, {
            status: "Rejected",
            reviewedBy: rejecterId
        });

        return {
            rejectedRole,
            message: `Role request has been successfully rejected by ${rejecterRole}.`
        }
    },
}