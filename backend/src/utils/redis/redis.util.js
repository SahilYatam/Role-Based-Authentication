import {redis} from "../../config/redis.config.js"

const buildTokenKey = (userId, hashedToken) => {
    return `token:${userId}:${hashedToken}`;
}

const cacheToken = async (userId, hashedToken, expiresAt) => {
    const ttlSeconds = Math.max(1, expiresAt - Math.floor(Date.now() / 1000));

    const key = buildTokenKey(userId, hashedToken);
    await redis.set(key, "1", "EX", ttlSeconds);

    return key;
}

const removeToken = async(userId, hashedToken) => {
    const key = buildTokenKey(userId, hashedToken);
    await redis.del(key);
}

const findTokenKey = async(hashedToken) => {
    const stream = redis.scanStream({match: `token:*:${hashedToken}`, count: 100});
    for await (const keys of stream){
        if(keys.length > 0) return keys[0];
    }
    return null;
}

export const redisUtils = {
    buildTokenKey,
    cacheToken,
    removeToken,
    findTokenKey
}
