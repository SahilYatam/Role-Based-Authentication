import { userRepo } from "../repositories/user.repository.js";
import { otpService } from "./otp.service.js";
import { sessionRepo } from "../repositories/session.repository.js";
import {
  logger,
  ApiError,
  hashPassword,
  comparePassword,
  hashToken,
  redisUtils,
} from "../utils/index.js";

const toPublicUser = (user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role || "MEMBER",
});

export const authService = {
    async register (data) {
        const userExists = await userRepo.findByEmail(data.email);
        if(userExists) throw new ApiError(400, "Email already registered");

        const user = await userRepo.createUser({email: data.email});
        await otpService.generateAndSend(user.email);

        logger.info(`📩 OTP sent to ${user.email}`);
        return { userId: user._id, email: user.email };
    },

    async validateCredentials (id, data) {
        const hashedPassword = await hashPassword(data.hashPassword);
        const updatedUser = await userRepo.updateById(id, {
            name: data.name,
            password: hashedPassword,
            isEmailVerified: true
        });

        return toPublicUser(updatedUser)
    },

    async login (data) {
        const user = await userRepo.findByEmail(data.email);
        if(!user) throw new ApiError(404, "User not found");

        const isPasswordCorrect = await comparePassword(data.password, user.password);
        if (!isPasswordCorrect) throw new ApiError(403, "Invalid password");

        return toPublicUser(user);
    },

    async logout (refreshToken) {
        const hashedToken = hashToken(refreshToken);
        const session = await sessionRepo.findSession({
            refreshToken: hashedToken,
            isActive: true
        });

        if(!session) throw new ApiError(403, "Unauthorized request");
        await sessionRepo.updateSessionById(session._id, {isActive: false});
        await redisUtils.removeToken(session.userId, hashedToken);

        logger.info(`🔓 Session invalidated (Session ID: ${session._id})`);
        return {message: "Session invalidated successfully"};
    },

    async getUser(userId) {
        const user = await userRepo.findById(userId);
        if(!user) throw new ApiError(404, "User not found");
        return toPublicUser(user);
    },
}