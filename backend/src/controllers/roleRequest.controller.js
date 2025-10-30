import { roleRequestService } from "../services/roleRequest.service.js";
import { 
    asyncHandler, 
    ApiResponse, 
} from "../utils/index.js";

const applyRoleRequest = asyncHandler(async(req, res) => {
    const userId = req.user?._id;
    const requestedRole = await roleRequestService.applyRoleRequest(userId, req.body);
    return res.status(200).json(new ApiResponse(200, requestedRole, "Role request sent successfully"));
});

const approveRole = asyncHandler(async(req, res) => {
    const requestId = req.params.requestId;
    const approvalId = req.user?._id;

    const approvedRole = await roleRequestService.approveRole(requestId, approvalId);

    return res.status(200)
        .json(new ApiResponse(200, approvedRole, "Role request has been successfully approved and assigned to the user"));
});

const rejectRole = asyncHandler(async(req, res) => {
    const requestId = req.params.requestId;
    const rejecterId = req.user?._id;

    const {rejectedRole, message} = await roleRequestService.rejectRoleRequest(requestId, rejecterId);

    return res.status(200)
        .json(new ApiResponse(200, rejectedRole, message));
});

const removeRequestNotification = asyncHandler(async(req, res) => {
    const requestId = req.params.requestId;
    const deletedRoleRequest = await roleRequestService.removeRequestNotification(requestId);

    return res.status(200)
        .json(new ApiResponse(200, deletedRoleRequest, "Role request notification has been successfully removed"));
})

export const roleRequestController = {
    applyRoleRequest,
    approveRole,
    rejectRole,
    removeRequestNotification
}