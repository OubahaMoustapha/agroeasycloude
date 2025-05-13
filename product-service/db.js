// db.js
const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI;
const dbName = 'agroeasy';

let db;

async function connectDB() {
  if (db) return db;
  const client = new MongoClient(uri, { useUnifiedTopology: true });
  await client.connect();
  db = client.db(dbName);
  return db;
}

module.exports = connectDB;