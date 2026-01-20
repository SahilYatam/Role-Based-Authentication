import { redis } from "../../config/redis.config.js";

const buildTokenKey = (userId, hashedToken) => {
    return `token:${userId}:${hashedToken}`;
};

const cacheToken = async (userId, hashedToken, expiresAt) => {
    const ttlSeconds = Math.max(
        1,
        Math.floor((expiresAt - Date.now()) / 1000)
    );

    const key = buildTokenKey(userId, hashedToken);

    await redis.set(key, "1", {
        ex: ttlSeconds,
    });

    return key;
};


const removeToken = async (userId, hashedToken) => {
    const key = buildTokenKey(userId, hashedToken);
    await redis.del(key);
};

const exists = async (key) => {
    return redis.exists(key);
};

export const redisUtils = {
    buildTokenKey,
    cacheToken,
    removeToken,
    exists
};
