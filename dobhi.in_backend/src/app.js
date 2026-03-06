const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const env = require("./config/env");
const routes = require("./routes");
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");
const { globalLimiter, securityHeaders } = require("./middlewares/security");

const app = express();

app.use(securityHeaders);
app.use(globalLimiter);

const normalizeOrigin = (value) => String(value || "").trim().replace(/\/+$/, "");
const parseOrigins = (value) =>
  String(value || "")
    .split(",")
    .map((item) => normalizeOrigin(item))
    .filter(Boolean);

const allowedOrigins = new Set(
  [
    ...parseOrigins(env.frontendUrls),
    normalizeOrigin(env.frontendUrl),
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://dhobi-in.vercel.app",
  ]
    .map((item) => normalizeOrigin(item))
    .filter(Boolean)
);
app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser tools/calls without Origin header.
      if (!origin) return callback(null, true);

      const normalizedOrigin = normalizeOrigin(origin);
      if (allowedOrigins.has(normalizedOrigin)) return callback(null, true);

      // Allow Vercel preview domains for this project.
      if (/^https:\/\/dhobi-in-[a-z0-9-]+\.vercel\.app$/i.test(normalizedOrigin)) {
        return callback(null, true);
      }

      // During local development, allow Vite on any localhost port.
      if (
        env.nodeEnv !== "production" &&
        (/^http:\/\/localhost:\d+$/.test(normalizedOrigin) ||
          /^http:\/\/127\.0\.0\.1:\d+$/.test(normalizedOrigin))
      ) {
        return callback(null, true);
      }

      return callback(new Error("CORS blocked for this origin"));
    },
    credentials: true,
  })
);
// Ensure preflight requests get CORS headers.
app.options("*", cors());
app.use(express.json({ limit: "1mb" }));
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API running",
  });
});

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
