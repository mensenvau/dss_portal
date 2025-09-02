const nodemailer = require("nodemailer");

const { SMTP_HOST = "localhost", SMTP_PORT = "1025", SMTP_SECURE = "0", SMTP_USER = "", SMTP_PASS = "", EMAIL_FROM = "no-reply@example.com" } = process.env;
let transporter;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: SMTP_SECURE === "1",
      auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
    });
  }
  return transporter;
}

async function sendEmail({ to, subject, text, html }) {
  const tx = getTransporter();
  const info = await tx.sendMail({ from: EMAIL_FROM, to, subject, text, html });
  return { messageId: info.messageId, accepted: info.accepted, rejected: info.rejected };
}

module.exports = { sendEmail };
