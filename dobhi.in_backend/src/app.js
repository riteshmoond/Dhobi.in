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

const allowedOrigins = new Set([env.frontendUrl, "http://localhost:5173", "http://127.0.0.1:5173"]);
app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser tools/calls without Origin header.
      if (!origin) return callback(null, true);

      if (allowedOrigins.has(origin)) return callback(null, true);

      // During local development, allow Vite on any localhost port.
      if (
        env.nodeEnv !== "production" &&
        (/^http:\/\/localhost:\d+$/.test(origin) || /^http:\/\/127\.0\.0\.1:\d+$/.test(origin))
      ) {
        return callback(null, true);
      }

      return callback(new Error("CORS blocked for this origin"));
    },
    credentials: true,
  })
);
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
