import {redis} from "../config/redis.config.js";
import { hashToken, generateOtp, sendMessage, ApiError } from "../utils/index.js";
import { userRepo } from "../repositories/user.repository.js";

export const otpService = {
    async generateAndSend(email) {
        const otp = generateOtp();
        const hashedOtp = hashToken(otp);
        await redis.set(`otp:user:${email}`, hashedOtp, "EX", 300); // 5 min TTL

        await sendMessage("otpQueue", {
            type: "OTP_EMAIL",
            email,
            otp
        });
        return otp;
    },

    async verfiyOtp (userId, otp) {
        const user = await userRepo.findById(userId);
        if(!user) throw new ApiError(404, "User not found");

        const storedOtp = await redis.get(`otp:user:${user.email}`);

        const isMatch = storedOtp === hashToken(otp);
        if(!isMatch) throw new ApiError(400, "Invalid OTP");

        user.isEmailVerifed = true;
        await user.save();

        await redis.del(`otp:user:${user.email}`);

        logger.info(`✅ OTP verified for ${user.email}`);

        return {message: "OTP verified successfully"};
    }
}
