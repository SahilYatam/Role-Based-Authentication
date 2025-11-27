import { userRepo } from "../repositories/user.repository.js";
import { otpService } from "./otp.service.js";
import { sessionRepo } from "../repositories/session.repository.js";
import { Role } from "../models/role.model.js";
import {
    logger,
    ApiError,
    hashPassword,
    comparePassword,
    hashToken,
    redisUtils,
} from "../utils/index.js";

const defaultRole = await Role.findOne({ key: process.env.ROLE_MEMBER });


const toPublicUser = (user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role?._id
        ? {
            id: user.role._id,
            key: user.role.key,
            name: user.role.name
        }
        : { key: "MEMBER", name: "Member" },
});

export const authService = {
    async register(email) {
        const userExists = await userRepo.findByEmail(email);
        if (userExists) throw new ApiError(400, "Email already registered");

        const user = await userRepo.createUser({ email });
        await otpService.generateAndSend(user.email);

        return { userId: user._id, email: user.email };
    },

    async validateCredentials(userId, data) {
        const hashedPassword = await hashPassword(data.password);
        const updatedUser = await userRepo.updateById(userId, {
            name: data.name,
            password: hashedPassword,
            role: defaultRole._id
        });

        return toPublicUser(updatedUser)
    },

    async login(email, password) {
        const user = await userRepo.findByEmail(email);
        if (!user) throw new ApiError(404, "User not found");

        const isPasswordCorrect = await comparePassword(password, user.password);
        if (!isPasswordCorrect) throw new ApiError(403, "Invalid password");

        return toPublicUser(user);
    },

    async logout(refreshToken) {
        const hashedToken = hashToken(refreshToken);
        const session = await sessionRepo.findSession({ refreshToken: hashedToken, isActive: true });
        logger.info("Found session:", session);


        if (!session) throw new ApiError(403, "Unauthorized request");
        await sessionRepo.updateSessionById(session._id, { isActive: false });
        await redisUtils.removeToken(session.userId, hashedToken);

        logger.info(`🔓 Session invalidated (Session ID: ${session._id})`);
        return { message: "Session invalidated successfully" };
    },

}