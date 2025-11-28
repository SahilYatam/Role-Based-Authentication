import amqplib from "amqplib";
import { logger } from "../utils/index.js";

let channel;
const url = process.env.RABBITMQ_URL;

export const connectRabbitMQ = async () => {
    try {
        const connection = await amqplib.connect(url);

        channel = await connection.createChannel();
        logger.info("✅ RabbitMQ connected successfully");

        return channel;
    } catch (error) {
        logger.error("❌ RabbitMQ connection failed:", error);
        throw error;
    }
}

export const getChannel = () => {
    if(!channel) throw new Error("RabbitMQ channel not initialized");
    return channel;
}
