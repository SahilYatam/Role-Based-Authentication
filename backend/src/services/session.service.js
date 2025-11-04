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
            const {accessToken, refreshToken: rawRefreshToken, tokenExpiresAt} = generateAccessAndRefreshToken(userId);
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
            if(!token) throw new ApiError(401, "Unauthorized request");

            const hashedRefreshToken = hashToken(token);

            const redisKey = await redisUtils.findTokenKey(hashedRefreshToken);

            const userId = redisKey ? redisKey.split(":")[1] : null;
            const session = await sessionRepo.findSession(
                userId 
                    ? { userId, refreshToken: hashedRefreshToken, isActive: true }
                    : { refreshToken: hashedRefreshToken, isActive: true }
            );
            if(!session) throw new ApiError(403, "Invalid or expired refresh token");
            if(new Date(session.expiresAt) < new Date()){
                throw new ApiError(403, "Session expired");
            }

            // rotate
            const {accessToken, refreshToken: newRawRefreshToken, tokenExpiresAt} = generateAccessAndRefreshToken(session.userId);
            const newHashedToken = hashToken(newRawRefreshToken);

            await Promise.allSettled([
                redisUtils.removeToken(session.userId, hashedRefreshToken),
                redisUtils.cacheToken(session.userId, newHashedToken, tokenExpiresAt),
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
