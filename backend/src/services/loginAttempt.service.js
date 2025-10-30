import { loginAttemptRepo } from "../repositories/loginAttempt.repository.js";
import { logger } from "../utils/index.js";

const trackAttempt = async ({email, ip, userId}) => {
    email = email.toLowerCase().trim();

    const attempt = await loginAttemptRepo.incrementAttempt(email, ip);
    logger.info(`Login attempt recorded`, {email, ip, attemps: attempt.attempts, user: userId || null});

    return attempt;
};

const resetAttempts = async ({email, ip}) => {
    email = email.toLowerCase().trim();

    const resetAttempt = await loginAttemptRepo.resetAttempts(email, ip);
    logger.info(`Login attempts reset after successful login`, {email, ip});

    return resetAttempt;
}

const blockTemporarily = async ({email, ip}) => {
    email = email.toLowerCase().trim();

    const blockedUser = await loginAttemptRepo.blockTemporarily(email, ip);
    logger.warn(`User temporarily blocked for 30 minutes`, {email, ip});

    return { blockedUser };
};

const blockPermanently = async ({email, ip}) => {
    email = email.toLowerCase().trim();

    const blockedUser = await loginAttemptRepo.blockPermanently(email, ip);
    logger.info(`User permanently blocked after excessive failed logins`, {email, ip});

    return blockedUser;
}

export const loginAttemptService = {
    trackAttempt,
    resetAttempts,
    blockTemporarily,
    blockPermanently
}
