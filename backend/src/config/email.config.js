import * as brevo from "@getbrevo/brevo";

const apiKey = process.env.BREVO_API_KEY;

if (!apiKey) {
  throw new Error("BREVO_API_KEY is not set");
}

console.log("🚨 BREVO_API_KEY VALUE:", process.env.BREVO_API_KEY);
console.log("🚨 BREVO_API_KEY EXISTS:", !!process.env.BREVO_API_KEY);
console.log("BREVO KEY PREFIX:", process.env.BREVO_API_KEY?.slice(0, 6));

const apiInstance = new brevo.TransactionalEmailsApi();

apiInstance.authentications["apiKey"].apiKey = apiKey;

export { apiInstance };

