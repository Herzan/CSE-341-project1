const dotenv = require('dotenv');
dotenv.config();

const { MongoClient } = require('mongodb');

let database;

const initDb = async (callback) => {
  if (database) {
    console.log('Database already initialized');
    return callback(null, database);
  }

  try {
    const client = await MongoClient.connect(process.env.MONGODB_URL);
    database = client.db();
    console.log('Database connected');
    callback(null, database);
  } catch (err) {
    callback(err);
  }
};

const getDatabase = () => {
  if (!database) {
    throw new Error('Database not initialized');
  }
  return database;
};

module.exports = {
  initDb,
  getDatabase
};