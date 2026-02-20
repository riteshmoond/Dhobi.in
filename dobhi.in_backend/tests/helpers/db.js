const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;

const connectTestDb = async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
};

const clearTestDb = async () => {
  const collections = mongoose.connection.collections;
  const tasks = Object.keys(collections).map((name) => collections[name].deleteMany({}));
  await Promise.all(tasks);
};

const disconnectTestDb = async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
};

module.exports = {
  connectTestDb,
  clearTestDb,
  disconnectTestDb,
};
