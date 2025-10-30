import { loginAttemptRepo } from "../repositories/loginAttempt.repository.js";
import { ApiError, logger } from "../utils/index.js";

/**
 * Blocks users temporarily or permanently based on repeated failed login attempts
 */

export const loginRateLimiter = async (req, res, next) => {
    try {
        const email = req.body?.email?.toLowerCase().trim();
        const ip = req.ip;

        if(!email) {
            throw new ApiError(400, "Email is required for login");
        }

        const attempt = await loginAttemptRepo.findByEmailAndIP(email, ip);

        // if no record, user is clean - proceed
        if(!attempt) return next();

        const now = new Date();
        
        if(attempt.permanentlyBlocked){
            throw new ApiError(
                403,
                "Your account has been permanently blocked due to multiple failed login attempts"
            )
        }

        // If user is temporarily blocked and block period hasn’t expired
        if(attempt.isBlocked && attempt.blockedUntil && attempt.blockedUntil > now){
            const minutesLeft = Math.ceil((attempt.blockedUntil - now) / (1000 * 60));
            throw new ApiError(429, 
                `Too many failed login attempts. Please try again after ${minutesLeft} minute(s)`
            )
        }

        // if block has expired, reset status and let user attempt login
        if(attempt.isBlocked & attempt.blockedUntil <= now){
            await loginAttemptRepo.resetAttempts(email, ip)
        }
        next();
    } catch (error) {
        logger.error("Error in login rate limiter middleware", {
            message: error.message,
            stack: error.stack
        });
        next(error);
    }
}