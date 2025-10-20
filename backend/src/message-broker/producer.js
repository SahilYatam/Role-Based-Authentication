import { getChannel } from "../config/rabbitMq.config.js";
import { logger } from "../utils/index.js";

export const publishMessage = async (queue, message) => {
    try {
        const channel = getChannel();

        await channel.assertQueue(queue, {durable: true});
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));

        logger.info(`📤 Message sent to queue "${queue}": ${JSON.stringify(message)}`)
    } catch (error) {
        logger.error("⚠️ Failed to publish message:", error);
        throw error;
    }
}