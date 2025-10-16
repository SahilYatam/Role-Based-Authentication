import jwt from "jsonwebtoken";
import { generateToken, tokenExpiresAt } from "../crypto/encryptToken.js"

export const generateAccessAndRefreshToken = (userId) => {
    const accessToken = jwt.sign({userId}, process.env.ACCESS_TOKEN, {
        expiresIn: "15m"
    });

    const refreshToken = generateToken();

    return {accessToken, refreshToken, tokenExpiresAt}
}
