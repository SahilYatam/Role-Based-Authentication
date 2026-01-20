import { connectRabbitMQ } from "./config/rabbitMq.config.js";
import { startConsumer } from "./message-broker/consumer.js";
import { logger } from "./utils/index.js";

(async () => {
    try {
        logger.info("🐇 Starting RabbitMQ worker...")
        await connectRabbitMQ();
        logger.info("✅ RabbitMQ connected (worker)")

        await startConsumer();
        logger.info("👂 Consumer running...");
    } catch (err) {
        logger.error("❌ Worker failed to start:", err);
        process.exit(1);
    }
})();
