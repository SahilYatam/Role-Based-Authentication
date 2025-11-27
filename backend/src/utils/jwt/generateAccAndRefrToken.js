import jwt from "jsonwebtoken";
import { generateToken } from "../crypto/encryptToken.js"

export const generateAccessAndRefreshToken = (userId) => {
    const accessToken = jwt.sign({userId}, process.env.ACCESS_TOKEN, {
        expiresIn: "15m"
    });

    const refreshToken = generateToken();

    const tokenExpiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
    
    return {accessToken, refreshToken, tokenExpiresAt}
}
