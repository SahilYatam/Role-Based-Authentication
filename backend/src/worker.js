import { connectRabbitMQ } from "./config/rabbitMq.config.js";
import { startConsumer } from "./message-broker/consumer.js";
import { logger } from "./utils/index.js";

(async () => {
    logger.info("🐇 Starting RabbitMQ worker...")
    await connectRabbitMQ();
    await startConsumer();
})();
