import { roleRequestService } from "../services/roleRequest.service.js";
import { 
    asyncHandler, 
    ApiResponse, 
} from "../utils/index.js";

const applyRoleRequest = asyncHandler(async(req, res) => {
    const userId = req.user?._id;
    const {requestedRole} = req.body;
    const roleKey = requestedRole.toUpperCase().trim()
    const requestedRoleByUser = await roleRequestService.applyRoleRequest(userId, roleKey);
    return res.status(200).json(new ApiResponse(200, {roleRequested: requestedRoleByUser}, "Role request sent successfully"));
});

const getRoleRequest = asyncHandler(async(req, res) => {
    const requestedRoles = await roleRequestService.getRoleRequest()
    const message =
    requestedRoles.length === 0
    ? "No role requests found"
    : "Role requests retrieved successfully";

    return res.status(200).json(new ApiResponse(200, {requestedRoles}, message));
})

const approveRole = asyncHandler(async(req, res) => {
    const requestId = req.params.requestId;
    const approverRole = req.user.role.key;
    const approvalId = req.user?._id;
    
    const approvedRole = await roleRequestService.approveRole(requestId,approverRole, approvalId);

    return res.status(200)
        .json(new ApiResponse(200, approvedRole, "Role request has been successfully approved and assigned to the user"));
});

const rejectRole = asyncHandler(async(req, res) => {
    const requestId = req.params.requestId;
    const rejecterRole = req.user.role.key;
    const rejecterId = req.user?._id;

    const {rejectedRole, message} = await roleRequestService.rejectRoleRequest(requestId, rejecterRole, rejecterId);

    return res.status(200)
        .json(new ApiResponse(200, rejectedRole, message));
});

export const roleRequestController = {
    applyRoleRequest,
    getRoleRequest,
    approveRole,
    rejectRole,
}