const nodemailer = require("nodemailer");

const isEnabled = () => String(process.env.EMAIL_ENABLED || "false").toLowerCase() === "true";

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const sendEmail = async ({ to, subject, html }) => {
  if (!isEnabled()) {
    console.log("Email disabled. Skipping send to", to);
    return;
  }

  const transporter = createTransporter();
  await transporter.sendMail({
    from: process.env.SMTP_FROM || "Dynamix LMS <no-reply@dynamix.local>",
    to,
    subject,
    html,
  });
};

module.exports = { sendEmail };
