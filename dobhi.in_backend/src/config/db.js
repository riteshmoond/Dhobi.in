const mongoose = require("mongoose");

const env = require("./env");

let dbAvailable = false;
let dbUnavailableReason = "";
let activeDbMode = "disconnected";
let memoryServer = null;

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

async function connectMemoryDb() {
  if (env.isProduction || !env.useMemoryDbInDev) {
    return false;
  }

  let MongoMemoryServer;
  try {
    ({ MongoMemoryServer } = require("mongodb-memory-server"));
  } catch (error) {
    dbUnavailableReason = `mongodb-memory-server unavailable: ${error.message}`;
    return false;
  }

  memoryServer = await MongoMemoryServer.create({
    instance: {
      dbName: "dobhi_in",
    },
  });

  const uri = memoryServer.getUri("dobhi_in");
  await connectWithUri(uri);
  dbAvailable = true;
  dbUnavailableReason = "";
  activeDbMode = "memory";
  console.log(`MongoDB connected via in-memory dev server: ${uri}`);
  return true;
}

async function connectDB() {
  try {
    await connectWithUri(env.mongoUri);
    dbAvailable = true;
    dbUnavailableReason = "";
    activeDbMode = "primary";
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
      activeDbMode = "fallback";
      console.log("MongoDB connected via fallback URI");
      return;
    } catch (fallbackError) {
      const fallbackReason = String(fallbackError?.message || fallbackError || "");
      const memoryDbConnected = await connectMemoryDb().catch((memoryError) => {
        dbAvailable = false;
        dbUnavailableReason = fallbackReason;
        activeDbMode = "disconnected";
        return false;
      });

      if (memoryDbConnected) {
        return;
      }

      dbAvailable = false;
      if (!dbUnavailableReason) {
        dbUnavailableReason = fallbackReason;
      }
      activeDbMode = "disconnected";
      throw fallbackError;
    }
  }
}

const markDbUnavailable = (error) => {
  dbAvailable = false;
  dbUnavailableReason = String(error?.message || error || "");
  activeDbMode = "disconnected";
};

const isDbAvailable = () => dbAvailable && mongoose.connection.readyState === 1;

const getDbUnavailableReason = () => dbUnavailableReason;
const getDbMode = () => activeDbMode;

module.exports = {
  connectDB,
  isDbAvailable,
  markDbUnavailable,
  getDbUnavailableReason,
  getDbMode,
};
