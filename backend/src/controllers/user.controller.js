import { ApiResponse, asyncHandler } from "../utils/index.js";
import { userService } from "../services/user.service.js";

const getUser = asyncHandler(async(req, res) => {
    const user = await userService.getUser(req.user?._id);
    return res.status(200).json(new ApiResponse(200, {user}, "User details fetch successfully"));
});

const getUserByRole = asyncHandler(async(req, res) => {
    const { roleKey } = req.query;
    const users = await userService.getUserByRole(roleKey || null)

    const message = users.length === 0 ? "No user exist" : "Users fetched successfully"

    return res.status(200).json(new ApiResponse(200, users || [], message));
})

export const userController = {
    getUser,
    getUserByRole
}