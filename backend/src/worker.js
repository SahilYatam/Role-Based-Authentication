import { transporter } from "./config/email.config.js";
import { connectRabbitMQ } from "./config/rabbitMq.config.js";
import { startConsumer } from "./message-broker/consumer.js";
import { logger } from "./utils/index.js";

const startWorker = async () => {
  try {
    logger.info("🐇 Connecting RabbitMQ (worker)...");
    await connectRabbitMQ();

    logger.info("📧 Verifying SMTP connection...");
    await transporter.verify();
    logger.info("✅ SMTP connection verified");

    logger.info("👂 Starting RabbitMQ consumers...");
    await startConsumer();

    logger.info("✅ Worker is running and consuming messages");
  } catch (err) {
    logger.error("❌ Worker startup failed", err);
    process.exit(1);
  }
};

startWorker();
