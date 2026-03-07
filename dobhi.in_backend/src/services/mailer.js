const nodemailer = require("nodemailer");
const dns = require("node:dns");
const https = require("node:https");
const env = require("../config/env");

const transporterCache = new Map();
dns.setDefaultResultOrder("ipv4first");

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
    lookup: (hostname, options, callback) => {
      const lookupOptions = {
        family: 4,
        all: false,
        hints: options?.hints,
      };
      dns.lookup(hostname, lookupOptions, callback);
    },
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

const hasResendConfig = () => Boolean(env.resendApiKey && (env.resendFromEmail || env.smtpFromEmail || env.smtpUser));

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

const sendViaResend = async ({ to, subject, text, html }) => {
  if (!hasResendConfig()) return { sent: false, reason: "RESEND_NOT_CONFIGURED" };

  const from = env.resendFromEmail || env.smtpFromEmail || env.smtpUser;
  const payload = JSON.stringify({
    from,
    to: Array.isArray(to) ? to : [to],
    subject,
    text,
    html,
  });

  await new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: "api.resend.com",
        path: "/emails",
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.resendApiKey}`,
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload),
        },
        timeout: 15000,
      },
      (res) => {
        let body = "";
        res.on("data", (chunk) => {
          body += chunk;
        });
        res.on("end", () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve();
            return;
          }
          reject(new Error(`Resend API failed (${res.statusCode}): ${body || "UNKNOWN_ERROR"}`));
        });
      }
    );

    req.on("timeout", () => {
      req.destroy(new Error("Resend API timeout"));
    });
    req.on("error", reject);
    req.write(payload);
    req.end();
  });

  return { sent: true };
};

const sendMail = async ({ to, subject, text, html }) => {
  const primary = {
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpSecure,
  };

  if (!hasSmtpConfig()) {
    return sendViaResend({ to, subject, text, html });
  }

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
      if (hasResendConfig()) {
        return sendViaResend({ to, subject, text, html });
      }
      throw fallbackErr;
    }
  }
};

module.exports = {
  hasSmtpConfig,
  sendMail,
};
