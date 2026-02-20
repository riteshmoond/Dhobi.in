const nodemailer = require("nodemailer");
const env = require("../config/env");

let transporter = null;

const hasSmtpConfig = () =>
  Boolean(env.smtpHost && env.smtpPort && env.smtpUser && env.smtpPass);

const getTransporter = () => {
  if (!hasSmtpConfig()) return null;
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpSecure,
    logger: env.smtpDebug,
    debug: env.smtpDebug,
    auth: {
      user: env.smtpUser,
      pass: env.smtpPass,
    },
  });

  return transporter;
};

const sendMail = async ({ to, subject, text, html }) => {
  const client = getTransporter();
  if (!client) return { sent: false, reason: "SMTP_NOT_CONFIGURED" };

  const from = env.smtpFromEmail || env.smtpUser;
  if (!from) return { sent: false, reason: "SMTP_FROM_MISSING" };

  await client.sendMail({ from, to, subject, text, html });
  return { sent: true };
};

module.exports = {
  hasSmtpConfig,
  sendMail,
};
