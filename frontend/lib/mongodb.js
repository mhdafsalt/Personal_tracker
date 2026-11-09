import mongoose from 'mongoose';

/**
 * Serverless MongoDB connection manager with connection caching.
 * Ensures fast execution on Vercel and prevents exhausting connection pools.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null, error: null };
}

export function getMongoStatus() {
  const readyState = mongoose.connection.readyState;
  return {
    configured: Boolean(process.env.MONGODB_URI),
    connected: readyState === 1,
    database: mongoose.connection.name || process.env.MONGODB_DB_NAME || null,
    host: mongoose.connection.host || null,
    error: cached.error,
  };
}

export async function connectMongoDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes('<username>') || uri.includes('<password>')) {
    cached.error = 'MONGODB_URI is not set. Add your MongoDB connection string in environment variables.';
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: process.env.MONGODB_DB_NAME || 'pk_workspace',
      serverSelectionTimeoutMS: 8000,
    };

    cached.promise = mongoose.connect(uri, opts).then((m) => {
      cached.error = null;
      return m;
    }).catch((err) => {
      cached.error = err instanceof Error ? err.message : 'MongoDB connection failed';
      cached.promise = null;
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err) {
    cached.promise = null;
    return null;
  }
}

