import mongoose from 'mongoose';

let mongoConnectionError = null;

export function getMongoStatus() {
  const readyState = mongoose.connection.readyState;
  return {
    configured: Boolean(process.env.MONGODB_URI),
    connected: readyState === 1,
    database: mongoose.connection.name || process.env.MONGODB_DB_NAME || null,
    host: mongoose.connection.host || null,
    error: mongoConnectionError,
  };
}

export async function connectMongoDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes('<username>') || uri.includes('<password>')) {
    mongoConnectionError =
      'MONGODB_URI is not set. Add your MongoDB Atlas connection string in backend/.env';
    console.log(`ℹ️ ${mongoConnectionError}`);
    return false;
  }

  try {
    await mongoose.connect(uri, {
      dbName: process.env.MONGODB_DB_NAME || 'pk_workspace',
      serverSelectionTimeoutMS: 8000,
    });
    mongoConnectionError = null;
    console.log(
      `✅ Connected to MongoDB Atlas (${mongoose.connection.name} @ ${mongoose.connection.host})`
    );
    return true;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to connect to MongoDB Atlas';
    mongoConnectionError = message;
    console.error('⚠️ MongoDB Atlas connection error:', message);
    return false;
  }
}

