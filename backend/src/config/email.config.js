import sgMail from "@sendgrid/mail";
import {logger} from "../utils/index.js"

const apiKey = process.env.SENDGRID_API_KEY;

if(!apiKey){
    throw new Error("❌ SENDGRID_API_KEY environment variable is not set");
}

sgMail.setApiKey(apiKey);

logger.info("✅ SendGrid initialized successfully");

export default sgMail;