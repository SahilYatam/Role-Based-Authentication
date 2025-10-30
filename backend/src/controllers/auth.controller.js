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
import { loginRateLimiterService } from "../services/loginRateLimiting.service.js";

const register = asyncHandler(async(req, res) => {
    const user = await authService.register(req.body);
    return res.status(200).json(new ApiResponse(200, {user}, "OTP sent successfully"));
});

const verifyOtp = asyncHandler(async(req, res) => {
    const {userId, otp} = req.body;

    const {message} = await otpService.verifyOtp(userId, otp);

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
    const {email, password} = req.body;
    const ip = req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    // verifing rate limiting rules before login attempt
    await loginRateLimiterService.verifyAccess(email, ip);

    try {
        // authenticate user
        const user = await authService.login(email, password);

        // after successful login, reset login attempts
        await loginRateLimiterService.reset(email, ip);

        // create session and set tokens
        const {accessToken, refreshToken} = await sessionService.createSession(user.userId);

        setCookies(res, accessToken, refreshToken);

        return res.status(200).json(new ApiResponse(200, {user}, "Log in successful"));
    } catch (error) {
        // handle failed login attempts
        await loginRateLimiterService.handleFailure(email, ip)
        throw error;
    }
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
    verifyOtp,
    validateCredentials,
    login,
    logout,
    getUser,
    forgetPasswordRequest,
    resetPassword
}