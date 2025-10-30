import { loginAttemptRepo } from "../repositories/loginAttempt.repository.js";
import { loginAttemptService } from "./loginAttempt.service.js";
import { ApiError } from "../utils/index.js";

const verifyAccess = async ({email, ip}) => {
    email = email.toLowerCase().trim();
    const attempt = await loginAttemptRepo.findByEmailAndIP(email, ip);
    if(!attempt) return;

    if(attempt.permanentlyBlocked){
        throw new ApiError(403, "Account permanently blocked");
    }

    if(attempt.isBlocked && attempt.blockedUntil > new Date()) {
        const remaining = Math.ceil((attempt.blockedUntil - Date.now()) /  60000);
        throw new ApiError(429, `Too many login attempts. Try again after ${remaining} minutes`);
    }
}

const handleFailure = async(email, ip, userId) => {
    const record = await loginAttemptService.trackAttempt({email, ip, userId});

    if(record.attempts >= 10){
        await loginAttemptService.blockPermanently({email, ip});
    } else if(record.attempts >= 5) {
        await loginAttemptService.blockTemporarily({email, ip});
    }
}

const reset = async (email, ip) => {
    await loginAttemptService.resetAttempts({email, ip});
}

export const loginRateLimiterService = {
    verifyAccess,
    handleFailure,
    reset
}