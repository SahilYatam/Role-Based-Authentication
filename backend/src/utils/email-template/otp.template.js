export const OTP_EMAIL_TEMPLATE=`
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width" />
  <title>{{appName}} — Your verification code</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f6f8;font-family:system-ui,-apple-system,Segoe UI,Roboto,'Helvetica Neue',Arial,sans-serif;">
  <!-- Preheader : hidden summary shown in inbox -->
  <div style="display:none;max-height:0px;overflow:hidden;mso-hide:all;">
    Use the code {{OTP}} to verify your {{appName}} account. Expires in {{expiryMinutes}} minutes.
  </div>

  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f4f6f8;padding:24px 0;">
    <tr>
      <td align="center">
        <!-- Container -->
        <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(16,24,40,0.05);">
          <!-- Header -->
          <tr>
            <td style="padding:20px 28px;background:linear-gradient(90deg,#0ea5a4,#2563eb);color:#ffffff;">
              <h1 style="margin:0;font-size:20px;font-weight:600;">{{appName}}</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:28px;">

              <p style="margin:0 0 24px 0;font-size:15px;color:#334155;">
                Use the verification code below to complete your action. This code is for <strong style="font-weight:600;">{{appName}}</strong> and will expire in <strong>{{expiryMinutes}} minutes</strong>.
              </p>

              <!-- OTP box -->
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:16px 0 24px 0;">
                <tr>
                  <td align="center">
                    <div style="display:inline-block;background:#0f172a;color:#fff;padding:20px 28px;border-radius:8px;letter-spacing:6px;font-size:28px;font-weight:700;">
                      {{OTP}}
                    </div>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 6px 0;font-size:13px;color:#64748b;">
                If you didn't request this, you can safely ignore this email or contact us at <a href="mailto:{{supportEmail}}" style="color:#2563eb;text-decoration:none;">{{supportEmail}}</a>.
              </p>

              <hr style="border:none;border-top:1px solid #e6eef6;margin:22px 0;" />

              <p style="margin:0;font-size:12px;color:#94a3b8;">
                This code will expire in {{expiryMinutes}} minutes. For security, do not share this code with anyone.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:18px 28px;background:#0f172a;color:#cbd5e1;font-size:12px;">
              <p style="margin:0;">© <span id="year">2025</span> {{appName}}. All rights reserved.</p>
            </td>
          </tr>
        </table>
        <!-- End container -->
      </td>
    </tr>
  </table>
</body>
</html>

`