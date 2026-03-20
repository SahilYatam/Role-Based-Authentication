import { startConsumer } from "./message-broker/consumer.js";
import { logger } from "./utils/index.js";

export const startWorker = async () => {
  try {
    logger.info("👂 Starting RabbitMQ consumers...");
    await startConsumer();

    logger.info("✅ Worker is running and consuming messages");
  } catch (err) {
    logger.error("❌ Worker startup failed", err);
    process.exit(1);
  }
};
