import { 
    asyncHandler, 
    ApiResponse, 
    setCookies, 
    clearCookies 
} from "../utils/index.js";
import { authService } from "../services/auth.service.js";
import { sessionService } from "../services/session.service.js";
import { passwordService } from "../services/password.service.js";
import { otpService } from "../services/otp.service.js";

const register = asyncHandler(async(req, res) => {
    const user = await authService.register(req.body);
    return res.status(200).json(new ApiResponse(200, {user}, "OTP sent successfully"));
});

const verfiyOtp = asyncHandler(async(req, res) => {
    const {userId, otp} = req.body;

    const {message} = await otpService.verfiyOtp(userId, otp);

    return res.status(200).json(new ApiResponse(200, {}, message));
})

const validateCredentials = asyncHandler(async(req, res) => {
    const id = req.user?._id;
    const user = await authService.validateCredentials(id, req.body);

    const {accessToken, refreshToken} = await sessionService.createSession(user.userId);
    setCookies(res, accessToken, refreshToken);
    
    return res.status(201).json(new ApiResponse(201, {user}, "User created successfully"));
});

const login = asyncHandler(async(req, res) => {
    const user = await authService.login(req.body);

    const {accessToken, refreshToken} = await sessionService.createSession(user.userId);
    setCookies(res, accessToken, refreshToken);

    return res.status(200).json(new ApiResponse(200, {user}, "Log in successful"));
});

const logout = asyncHandler(async(req, res) => {
    const refreshToken = req.cookies.refreshToken

    await authService.logout(refreshToken);
    clearCookies(res);

    return res.status(200).json(new ApiResponse(200, {}, "Logged out successful"))
});

const getUser = asyncHandler(async(req, res) => {
    const user = await authService.getUser(req.user?.id);
    return res.status(200).json(new ApiResponse(200, {user}, "User details fetch successfully"));
});

const forgetPasswordRequest = asyncHandler(async(req, res) => {
    const {message} = await passwordService.requestReset(req.body);
    return res.status(200).json(new ApiResponse(200, {}, message));
});

const resetPassword = asyncHandler(async(req, res) => {
    const token = req.params.token;

    const user = await passwordService.resetPassword(token, req.body);

    logger.info("Password reset successful from this user:", { userId: user.userId });

    return res.status(200).json(new ApiResponse(200, {}, "Password reset successfull"));
});

export const authController = {
    register,
    verfiyOtp,
    validateCredentials,
    login,
    logout,
    getUser,
    forgetPasswordRequest,
    resetPassword
}