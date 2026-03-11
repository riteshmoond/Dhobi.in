const mongoose = require("mongoose");

const env = require("./env");

let dbAvailable = false;
let dbUnavailableReason = "";

const isSrvLookupError = (error) => {
  const message = String(error?.message || "");
  return (
    message.includes("querySrv") &&
    (message.includes("ECONNREFUSED") || message.includes("ENOTFOUND"))
  );
};

async function connectWithUri(uri) {
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
  });
}

async function connectDB() {
  try {
    await connectWithUri(env.mongoUri);
    dbAvailable = true;
    dbUnavailableReason = "";
    console.log("MongoDB connected");
    return;
  } catch (error) {
    const canFallback =
      env.mongoFallbackUri &&
      env.mongoFallbackUri !== env.mongoUri &&
      isSrvLookupError(error);

    if (!canFallback) {
      throw error;
    }

    console.warn(
      `Primary MongoDB SRV lookup failed. Retrying with fallback URI: ${env.mongoFallbackUri}`
    );

    await mongoose.disconnect().catch(() => {});
    try {
      await connectWithUri(env.mongoFallbackUri);
      dbAvailable = true;
      dbUnavailableReason = "";
      console.log("MongoDB connected via fallback URI");
      return;
    } catch (fallbackError) {
      dbAvailable = false;
      dbUnavailableReason = String(fallbackError?.message || fallbackError || "");
      throw fallbackError;
    }
  }

}

const markDbUnavailable = (error) => {
  dbAvailable = false;
  dbUnavailableReason = String(error?.message || error || "");
};

const isDbAvailable = () => dbAvailable && mongoose.connection.readyState === 1;

const getDbUnavailableReason = () => dbUnavailableReason;

module.exports = {
  connectDB,
  isDbAvailable,
  markDbUnavailable,
  getDbUnavailableReason,
};
