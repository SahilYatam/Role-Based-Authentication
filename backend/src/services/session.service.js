import {
    logger,
    ApiError,
    hashToken,
    generateAccessAndRefreshToken,
    redisUtils,
} from "../utils/index.js";

import { sessionRepo } from "../repositories/session.repository.js";

export const sessionService = {
    async createSession(userId) {
        try {
            const { accessToken, refreshToken: rawRefreshToken, tokenExpiresAt } = generateAccessAndRefreshToken(userId);
            const hashedRefreshToken = hashToken(rawRefreshToken);

            await redisUtils.cacheToken(userId, hashedRefreshToken, tokenExpiresAt);

            const session = await sessionRepo.createSession({
                userId,
                refreshToken: hashedRefreshToken,
                lastActivity: new Date(),
                expiresAt: new Date(tokenExpiresAt),
                isActive: true
            });
            logger.info(`✅ Session created | user: ${userId} | sessionId: ${session._id}`);
            return { session, accessToken, refreshToken: rawRefreshToken };
        } catch (error) {
            logger.error(`❌ Failed creating session for user ${userId}`, { message: error.message });
            throw new ApiError(500, "Failed to create session");
        }
    },

    async clearExpiredSessions() {
        try {
            const totalDeleted = await sessionRepo.deleteExpiredSessions();
            const msg = totalDeleted > 0
                ? `🧹 Cleaned ${totalDeleted} expired sessions`
                : "✅ No expired sessions";
            logger.info(msg);
        } catch (error) {
            logger.error("❌ Failed cleaning expired sessions", { message: error.message });
        }
    },

    async refreshAccessToken(token) {
        try {
            if (!token) throw new ApiError(401, "Unauthorized request");

            const hashedRefreshToken = hashToken(token);

            const session = await sessionRepo.findSession({
                refreshToken: hashedRefreshToken,
                isActive: true,
            });

            if (!session) throw new ApiError(403, "Invalid or expired refresh token");


            const redisKey = redisUtils.buildTokenKey(
                session.userId,
                hashedRefreshToken
            );

            const exists = await redisUtils.exists(redisKey);
            if (!exists) {
                throw new ApiError(403, "Refresh token expired in cache");
            }

            logger.info(`Session found: ${session?._id}`);

            logger.info("Redis key exists:", exists);


            // rotate
            const { accessToken, refreshToken: newRawRefreshToken, tokenExpiresAt } = generateAccessAndRefreshToken(session.userId);
            const newHashedToken = hashToken(newRawRefreshToken);

            await Promise.allSettled([
                redisUtils.removeToken(
                    session.userId, hashedRefreshToken
                ),
                redisUtils.cacheToken(
                    session.userId,
                    newHashedToken,
                    tokenExpiresAt
                ),
                sessionRepo.updateSessionById(session._id, {
                    refreshToken: newHashedToken,
                    expiresAt: new Date(tokenExpiresAt),
                    lastActivity: new Date()
                })
            ]);

            return { accessToken, refreshToken: newRawRefreshToken };
        } catch (error) {
            logger.error("Error in refreshAccessToken", { message: error.message });
            if (error instanceof ApiError) throw error;
            throw new ApiError(500, "Internal server error while refreshing token");
        }
    }

}
