import crypto from "crypto";

export const generateToken = () => {
    return crypto.randomBytes(32).toString("hex");
}

export const hashToken = (rawToken) => {
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    return hashedToken;
}

export const tokenExpiresAt = () => {
    return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
}