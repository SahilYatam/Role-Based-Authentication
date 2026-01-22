import { getChannel } from "../config/rabbitMq.config.js";
import { sendOtpEmail, sendPasswordResetEmail } from "../services/email.service.js"
import { logger } from "../utils/index.js";

export const startConsumer = async () => {
    const channel = getChannel();

    const queues = ["otpQueue", "emailQueue"];

    for (const queue of queues) {
        await channel.assertQueue(queue, { durable: true });
        logger.info(`👂 Listening on "${queue}"...`);

        channel.consume(queue, async (msg) => {
            if (!msg) return;

            try {
                const data = JSON.parse(msg.content.toString());

                if (queue === "otpQueue" && data.type === "OTP_EMAIL") {
                    await sendOtpEmail(data.email, data.otp);
                    logger.info(`✅ OTP email sent to ${data.email}`);
                }

                if (queue === "emailQueue" && data.type === "FORGET_PASSWORD") {
                    await sendPasswordResetEmail(data.email, data.link);
                    logger.info(`✅ Password reset email sent to ${data.email}`);
                }

                channel.ack(msg); // Only ack if successful

            } catch (err) {
                logger.error(`❌ Error in consumer (${queue})`, {
                    error: err.message,
                    stack: err.stack,
                    data: msg.content.toString()
                });

                // Requeue the message for retry (max 3 attempts)
                const retryCount = (msg.properties.headers?.['x-retry-count'] || 0) + 1;

                if (retryCount < 1) {
                    channel.nack(msg, false, true);
                } else {
                    channel.nack(msg, false, false);
                }

            }
        });
    }
}