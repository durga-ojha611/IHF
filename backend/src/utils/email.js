import nodemailer from 'nodemailer';

/**
 * Configure Nodemailer SMTP Transporter
 */
const createTransporter = () => {
  if (
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS
  ) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  // Fallback to test/mock transporter in dev
  return null;
};

/**
 * Send Consultation Booking Confirmation Email
 */
export const sendConsultationConfirmationEmail = async ({
  to,
  name,
  consultationNumber,
  date,
  time,
  room,
  type = 'Phone Consultation'
}) => {
  try {
    const transporter = createTransporter();
    const formattedType = type === 'phone' ? 'Phone Consultation' : type;

    const htmlContent = `
      <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #FAF9F5; color: #1c1917; border: 1px solid #E8E5DF;">
        <div style="text-align: center; border-bottom: 1px solid #E0DBD1; padding-bottom: 24px; margin-bottom: 24px;">
          <h1 style="letter-spacing: 4px; font-size: 24px; margin: 0; color: #1C1917;">I H F</h1>
          <p style="font-size: 11px; letter-spacing: 2px; color: #8F7642; margin-top: 4px; text-transform: uppercase;">Atelier Curtains & Bespoke Draperies</p>
        </div>

        <h2 style="font-size: 20px; font-weight: normal; color: #1C1917; margin-bottom: 12px;">Your Atelier Consultation is Confirmed</h2>
        <p style="font-size: 14px; line-height: 1.6; color: #44403C;">
          Dear <strong>${name}</strong>, thank you for booking a complimentary personal design session with India Home Furnishings.
        </p>

        <div style="background: #FFFFFF; border: 1px solid #E8E5DF; padding: 20px; border-radius: 4px; margin: 24px 0;">
          <div style="margin-bottom: 8px;"><strong>Booking Reference:</strong> <span style="color: #8F7642;">${consultationNumber}</span></div>
          <div style="margin-bottom: 8px;"><strong>Session Type:</strong> ${formattedType}</div>
          <div style="margin-bottom: 8px;"><strong>Preferred Date:</strong> ${date}</div>
          <div style="margin-bottom: 8px;"><strong>Time Window:</strong> ${time}</div>
          <div><strong>Target Room:</strong> ${room}</div>
        </div>

        <p style="font-size: 13px; line-height: 1.6; color: #78716C;">
          Our senior atelier specialist will contact you on your registered phone number at the scheduled time. If you need to make changes or share architectural drawings in advance, simply reply to this email.
        </p>

        <div style="margin-top: 36px; padding-top: 20px; border-top: 1px solid #E0DBD1; text-align: center; font-size: 11px; color: #A8A29E; letter-spacing: 1px;">
          INDIA HOME FURNISHINGS ATELIER • HANDCRAFTED LUXURY
        </div>
      </div>
    `;

    if (!transporter) {
      console.log(`[SMTP Dev Notice] Email confirmation simulated for: ${to} (Booking: ${consultationNumber})`);
      return { success: true, simulated: true };
    }

    const info = await transporter.sendMail({
      from: `"${process.env.FROM_NAME || 'IHF Atelier'}" <${process.env.FROM_EMAIL || 'concierge@ihfluxury.com'}>`,
      to,
      subject: `Complimentary Consultation Confirmed [${consultationNumber}] - India Home Furnishings`,
      html: htmlContent
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('[SMTP Error] Failed to dispatch consultation email:', error.message);
    return { success: false, error: error.message };
  }
};
