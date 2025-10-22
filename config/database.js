import mongoose from 'mongoose';
import logger from '../utils/logger.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    logger.info(`MongoDB ulandi: ${conn.connection.host}`);
    
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB ulanish xatosi', { error: err.message });
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB ulanishi uzildi');
    });

  } catch (error) {
    logger.error('MongoDB ulanishda xato', { error: error.message });
    process.exit(1);
  }
};

export default connectDB;
