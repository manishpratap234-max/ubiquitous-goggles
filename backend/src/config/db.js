const mongoose = require('mongoose');
const { mongoUri } = require('./env');

async function connectDatabase() {
  if (!mongoUri) throw new Error('MONGO_URI is required');
  await mongoose.connect(mongoUri);
  console.log('MongoDB connected');
}

module.exports = { connectDatabase };
