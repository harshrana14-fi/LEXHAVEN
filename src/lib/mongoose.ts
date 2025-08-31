// lib/mongoose.ts
import mongoose, { Mongoose } from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/test';

if (!MONGO_URI) {
  throw new Error('Please define the MONGO_URI environment variable');
}

// Use a global cached connection so we don't reconnect on every hot reload
interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Extend Node's global object with our cache type
const globalWithMongoose = global as typeof global & {
  _mongooseCache?: MongooseCache;
};

let cached = globalWithMongoose._mongooseCache;

if (!cached) {
  cached = { conn: null, promise: null };
  globalWithMongoose._mongooseCache = cached;
}

export async function connectDB(): Promise<Mongoose> {
  // Ensure cached is defined
  if (!cached) {
    cached = { conn: null, promise: null };
    globalWithMongoose._mongooseCache = cached;
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = { 
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };
    cached.promise = mongoose.connect(MONGO_URI, opts);
  }

  try {
    cached.conn = await cached.promise;
    console.log('Connected to MongoDB successfully');
    return cached.conn;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    cached.promise = null;
    throw error;
  }
}

export default connectDB;