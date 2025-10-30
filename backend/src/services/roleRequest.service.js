import { roleRepo } from "../repositories/role.repository";
import { roleRequestRepo } from "../repositories/roleRequest.repository.js";
import { logger, ApiError } from "../utils/index.js";

const ROLE_KEYS = {
    SUPER_ADMIN: process.env.ROLE_SUPER_ADMIN,
    ADMIN: process.env.ROLE_ADMIN,
    EDITOR: process.env.ROLE_EDITOR,
    MEMBER: process.env.ROLE_MEMBER
}

export const roleRequestService = {
    async applyRoleRequest (userId, data) {
        const requestedRole = await roleRequestRepo.createRoleRequest({
            userId,
            requestedRole: data.requestedRole,
            reviewedBy: null
        });
        return requestedRole;
    },

    async approveRole (requestId, approvelId) {
        const requestedRole = await roleRequestRepo.findRoleRequestById(requestId);
        const approval = await roleRepo.findRoleById(approvelId);

        // checking if the request is and the approver has is SuperAdmin or Admin role
        if(requestedRole.status === "Pending" && (approval.key === ROLE_KEYS.SUPER_ADMIN || approval.key === ROLE_KEYS.ADMIN)){
            const approvedRole = await roleRequestRepo.updateRoleRequestStatus(requestedRole._id, {
                status: "Approved",
                reviewedBy: approval._id
            });

            return approvedRole
        }
        // if the request is already processed
        else if(requestedRole.status !== "Pending") {
            logger.error("Attempted to approve a role request that is not pending", {
                requestId,
                currentStatus: requestedRole.status,
                userId: requestedRole.user?._id
            });
            throw new ApiError(401, "Role request cannot be approved because it has already been processed for this user.");
        }
    },

    async rejectRoleRequest (requestId, rejecterId) {
        const requestedRole = await roleRequestRepo.findRoleRequestById(requestId);
        const rejecter = await roleRepo.findRoleById(rejecterId)

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
            rejecter.role.key !== ROLE_KEYS.SUPER_ADMIN
        ) {
            throw new ApiError(403, "Only SuperAdmin can reject requests for the Admin role.");
        }

        const rejectedRole = await roleRequestRepo.updateRoleRequestStatus(requestedRole._id, {
            status: "Rejected",
            reviewedBy: rejecter._id
        });

        return {
            rejectedRole,
            message: `Role request has been successfully rejected by ${rejecter.role.name}.`
        }
    },

    async removeRequestNotification (requestId) {
        const roleRequest = await roleRequestRepo.findRoleRequestById(requestId);

        // deleting notification for completed requests
        if(roleRequest.status === "Approved" || roleRequest.status === "Rejected"){
            const deletedRoleRequest = await roleRequestRepo.deletedRoleRequest(roleRequest._id);

            return deletedRoleRequest
        } else {
            throw new ApiError(400, "Cannot remove notification for a pending role request.");
        }
    }
}