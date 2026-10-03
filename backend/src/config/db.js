import mongoose from 'mongoose';
import { setupMockDatabase } from '../../test/mockDb.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      autoIndex: true,
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[MongoDB] Local connection failed (${error.message}).`);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    } else {
      console.log(`[Database] Initializing High-Performance In-Memory DB Mode with Seeding...`);
      setupMockDatabase();
      console.log(`[Database] In-Memory Mock Database is Ready (Users, Products, Categories, Customizer Rules, Orders seeded)`);
    }
  }
};

export default connectDB;

