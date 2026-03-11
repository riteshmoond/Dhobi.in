const app = require("./app");
const env = require("./config/env");
const { connectDB, markDbUnavailable } = require("./config/db");

async function startServer() {
  try {
    try {
      await connectDB();
    } catch (error) {
      markDbUnavailable(error);

      if (!(env.nodeEnv !== "production" && env.allowStartWithoutDb)) {
        throw error;
      }

      console.warn(
        `MongoDB unavailable. Starting API in local dev mode without database: ${error.message}`
      );
    }
    
    const server = app.listen(env.port, () => {
      console.log(`API running on http://localhost:${env.port}`);
    });

    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.error(`Port ${env.port} is already in use. Please stop other processes using this port.`);
        process.exit(1);
      } else {
        console.error("Server error:", err);
        process.exit(1);
      }
    });

    process.on("SIGTERM", () => {
      console.log("SIGTERM received, shutting down gracefully...");
      server.close(() => {
        console.log("Server closed");
        process.exit(0);
      });
    });

    process.on("SIGINT", () => {
      console.log("SIGINT received, shutting down gracefully...");
      server.close(() => {
        console.log("Server closed");
        process.exit(0);
      });
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
