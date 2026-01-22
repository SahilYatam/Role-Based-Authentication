import Brevo from "@getbrevo/brevo";

if (!process.env.BREVO_API_KEY) {
    throw new Error("BREVO_API_KEY is missing");
}

console.log("🚨 BREVO_API_KEY VALUE:", process.env.BREVO_API_KEY);
console.log("🚨 BREVO_API_KEY EXISTS:", !!process.env.BREVO_API_KEY);

const apiInstance = new Brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
    Brevo.TransactionalEmailsApiApiKeys.apiKey,
    process.env.BREVO_API_KEY
);

export { apiInstance };
