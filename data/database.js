const dotenv = require('dotenv');
dotenv.config();

const MongoClient = require('mongodb').MongoClient;

let database;

const initDb = (callback) => {
  if (database) {
    console.log('Db is already initialized');
    return callback(null, database);
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return callback(new Error('MONGODB_URI not found in .env'));
  }

  MongoClient.connect(uri)
    .then((client) => {
      database = client;
      console.log('Database connected successfully');
      callback(null, database);
    })
    .catch((err) => {
      console.error('Database connection failed:', err);
      callback(err);
    });
};

const getDatabase = () => {
  if (!database) {
    throw new Error('Database not initialized. Call initDb first.');
  }
  return database;
};

module.exports = { initDb, getDatabase };