import { transporter } from "../config/email.config.js"
import { logger } from "../utils/index.js";

import {
    OTP_EMAIL_TEMPLATE,
    PASSWORD_RESET_REQUEST_TEMPLATE,
    PASSWORD_RESET_SUCCESS_TEMPLATE,
    WELCOME_EMAIL_TEMPLATE
} from "../utils/index.js";


const injectTemplateVariables = (template, variables) => {
    let result = template;
    for (const [key, value] of Object.entries(variables)) {
        result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }

    return result;
}

/**
 * Generic function to send any email
 * @param {string} email - Recipient email
 * @param {string} subject - Email subject
 * @param {string} template - HTML template string
 * @param {object} template - Key-value pairs for template placeholders
 */


export const sendEmail = async (email, subject, template, variables = {}) => {
    try {
        const html = injectTemplateVariables(template, variables);

        const info = await transporter.sendMail({
            from: `"Role based authentication" <${process.env.SMTP_USER}>`,
            to: email,
            subject,
            html,
        });

        logger.info(`✅ Email sent successfully to ${email}`, {
            messageId: info.messageId,
            response: info.response,
        });

        return info;
    } catch (error) {
        logger.error("❌ SMTP email error", {
            message: error.message,
            code: error.code,
            command: error.command,
            email,
            subject,
        });

        throw error;
    }
};

// specific email types
export const sendOtpEmail = async (email, otp) => {
    await sendEmail(email, "Verify your account", OTP_EMAIL_TEMPLATE, {
        appName: "Role Based Authentication",
        OTP: otp,
        expiryMinutes: "5",
        year: new Date().getFullYear()
    });
}


export const sendWelcomeEmail = async (email, userName, dashboardUrl) => {
    await sendEmail(email, "Welcome Email", WELCOME_EMAIL_TEMPLATE, {
        appName: "Role Based Authentication",
        userName,
        dashboardUrl,
        year: new Date().getFullYear()
    });
}

export const sendPasswordResetEmail = async (email, resetLink, expiryMinutes = "5") => {
    await sendEmail(email, "Password Reset Email", PASSWORD_RESET_REQUEST_TEMPLATE, {
        appName: "Role Based Authentication",
        resetLink,
        expiryMinutes,
        year: new Date().getFullYear()
    });
}

export const sendPasswResetSuccessEmail = async (email, userName) => {
    await sendEmail(email, "Your Password Was Successfully Changed", PASSWORD_RESET_SUCCESS_TEMPLATE, {
        appName: "Role Based Authentication",
        userName,
        year: new Date().getFullYear()
    });
}