import { Redis } from "@upstash/redis";

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

redis.ping()
    .then(() => console.log("✅ Redis connected successfully"))
    .catch(err => console.error("❌ Redis connection failed:", err));
export { redis };