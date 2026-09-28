/**
 * Email Service (Mock & Transporter Ready)
 * Sends password reset instructions, order confirmations, and fulfillment tracking updates.
 */

export async function sendEmail({ to, subject, text, html }) {
  console.log(`\n========================================`);
  console.log(`[EMAIL DISPATCH] To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Content:\n${text || html}`);
  console.log(`========================================\n`);

  return true;
}

export async function sendPasswordResetEmail({ to, resetUrl }) {
  const subject = 'Your Password Reset Request (Valid for 15 Minutes)';
  const text = `You requested a password reset for your IHF Luxury Draperies account.\n\nPlease reset your password using the following link:\n${resetUrl}\n\nIf you did not request this, please ignore this email.`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #1a1a1a;">Password Reset Request</h2>
      <p>You requested a password reset for your <strong>IHF Luxury Draperies</strong> account.</p>
      <p>Click the button below to reset your password. This link is valid for <strong>15 minutes</strong>.</p>
      <a href="${resetUrl}" style="display: inline-block; background-color: #1a1a1a; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
      <p style="margin-top: 20px; color: #777; font-size: 13px;">If you did not make this request, you can safely ignore this email.</p>
    </div>
  `;

  return sendEmail({ to, subject, text, html });
}

export default {
  sendEmail,
  sendPasswordResetEmail
};
