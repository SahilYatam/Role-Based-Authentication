export const WELCOME_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Welcome to {{appName}}</title>
  </head>
  <body style="font-family: Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 0;">
    <div style="max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 6px; padding: 20px; text-align: center;">
      <h2 style="color: #111827;">Welcome to {{appName}}, {{userName}}!</h2>
      <p style="color: #374151; font-size: 15px;">
        Hi {{userName}}, we're excited to have you on board. You can now explore all the features and start using {{appName}} to make the most out of your experience.
      </p>
      <a href="{{dashboardUrl}}" style="display: inline-block; background-color: #2563eb; color: #fff; padding: 10px 20px; border-radius: 4px; text-decoration: none; margin-top: 16px;">
        Get Started
      </a>
      <p style="color: #9ca3af; font-size: 13px; margin-top: 24px;">
        — The {{appName}} Team
      </p>
    </div>
  </body>
</html>
`;
