import { getChannel } from "../config/rabbitMq.config.js";
import {sendOtpEmail, sendPasswordResetEmail} from "../services/email.service.js"
import { logger } from "../utils/index.js";

export const startConsumer = async () => {
    const channel = getChannel();

    const queues = ["otpQueue", "emailQueue"];

    for(const queue of queues) {
        await channel.assertQueue(queue, {durable: true});
        logger.info(`👂 Listening on "${queue}"...`);

        channel.consume(queue, async(msg) => {
            if(!msg) return;

            try {
                const data = JSON.parse(msg.content.toString());
                logger.info(`📩 Message from ${queue}: ${JSON.stringify(data)}`);

                if(queue === "otpQueue" && data.type === "OTP_EMAIL"){
                    await sendOtpEmail(data.email, data.otp);
                }

                if(queue === "emailQueue" && data.type === "FORGET_PASSWORD"){
                    await sendPasswordResetEmail(data.email, data.link);
                }
                channel.ack(msg);
            } catch (err) {
                logger.error(`❌ Error in consumer (${queue}):`, err);
                channel.nack(msg, false, false);
            }

        })
    }


}