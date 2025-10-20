import { userRepo } from "../repositories/user.repository.js";
import {
  hashToken,
  generateToken,
  hashPassword,
  sendMessage,
  ApiError,
} from "../utils/index.js";

export const passwordService = {
    async requestReset(email) {
        const user = await userRepo.findByEmail(email);
        if(!user) throw new ApiError(404, "User not found");

        const rawToken = generateToken();
        const hashedResetToken = hashToken(rawToken);
        const resetExpires = new Date(Date.now() + 5 * 60 * 1000);

        await userRepo.updateById(user._id, {
            resetPasswordToken: hashedResetToken,
            resetPasswordExpiresAt: resetExpires
        });

        const link = `${process.env.CLIENT_URL}/forget-password?token=${rawToken}`;
        await sendMessage("emailQueue", {
            type: "FORGET_PASSWORD",
            email: user.email,
            link,
        });
        return {message: "Password reset email send"};
    },


    async resetPassword(token, password) {
        const hashedResetToken = hashToken(token);
        const user = await userRepo.findByResetToken(hashedResetToken);

        if(!user || user.resetPasswordExpiresAt < new Date()){
            throw new ApiError(403, "Invalid or expired reset token");
        }

        const newHashedPassword = await hashPassword(password);
        const updatedUser = await userRepo.updateById(user._id, {
            password: newHashedPassword,
            resetPasswordToken: null,
            resetPasswordExpiresAt: null
        });

        await sendMessage("password-reset", {email: updatedUser.email});
        return updatedUser;
    }
}
