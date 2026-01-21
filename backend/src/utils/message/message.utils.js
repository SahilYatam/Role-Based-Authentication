import { publishMessage } from "../../message-broker/producer.js";
import logger from "../monitoring/logger.js";

/**
 * Unified message publishing utility.
 * Handles logging and error reporting for Kafka/RabbitMQ producers.
 */

export const sendMessage = async (queue, payload) => {
    try {
        await publishMessage(queue, payload);
        logger.info(`📨 Message published to ${queue}`);
    } catch (error) {
        logger.error(`⚠️ Failed to publish message to ${queue}:`, error);
        throw error;
    }
}
