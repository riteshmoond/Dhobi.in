const nodemailer = require("nodemailer");
const env = require("../config/env");

const transporterCache = new Map();

const hasSmtpConfig = () =>
  Boolean(env.smtpHost && env.smtpPort && env.smtpUser && env.smtpPass);

const getTransporter = ({ host, port, secure }) => {
  if (!hasSmtpConfig()) return null;
  const cacheKey = `${host}:${port}:${secure ? "secure" : "starttls"}`;
  if (transporterCache.has(cacheKey)) return transporterCache.get(cacheKey);

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    family: 4, // force IPv4
    requireTLS: !secure,
    logger: env.smtpDebug,
    debug: env.smtpDebug,
    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 45000,
    tls: {
      servername: host,
      minVersion: "TLSv1.2",
    },
    auth: {
      user: env.smtpUser,
      pass: env.smtpPass,
    },
  });

  transporterCache.set(cacheKey, transporter);
  return transporter;
};

const isConnectionError = (err) => {
  if (!err) return false;
  const code = String(err.code || "").toUpperCase();
  const msg = String(err.message || "").toLowerCase();
  return (
    code === "ETIMEDOUT" ||
    code === "ESOCKET" ||
    code === "ECONNECTION" ||
    code === "ECONNREFUSED" ||
    msg.includes("connection timeout") ||
    msg.includes("timed out")
  );
};

const sendWithConfig = async ({ to, subject, text, html, host, port, secure }) => {
  const client = getTransporter({ host, port, secure });
  if (!client) return { sent: false, reason: "SMTP_NOT_CONFIGURED" };

  const from = env.smtpFromEmail || env.smtpUser;
  if (!from) return { sent: false, reason: "SMTP_FROM_MISSING" };

  await client.sendMail({ from, to, subject, text, html });
  return { sent: true };
};

const sendMail = async ({ to, subject, text, html }) => {
  const primary = {
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpSecure,
  };

  try {
    return await sendWithConfig({ to, subject, text, html, ...primary });
  } catch (err) {
    // Some hosts/providers block one SMTP mode on cloud networks.
    const canTryFallback = isConnectionError(err);
    if (!canTryFallback) throw err;

    const fallback =
      primary.port === 587
        ? { host: env.smtpHost, port: 465, secure: true }
        : { host: env.smtpHost, port: 587, secure: false };

    try {
      return await sendWithConfig({ to, subject, text, html, ...fallback });
    } catch (fallbackErr) {
      throw fallbackErr;
    }
  }
};

module.exports = {
  hasSmtpConfig,
  sendMail,
};
