// backend/src/config/db.ts
import mongoose, { ConnectOptions } from 'mongoose';
import { config } from './env';
import { logger } from './logger';

export async function connectMongo(): Promise<void> {
  const opts: ConnectOptions = {
    // recommended options
    // strictQuery: false is required only in some versions; ensure your mongoose version
  };

  try {
    await mongoose.connect(config.MONGO_URI, opts);
    logger.info('MongoDB connected');
  } catch (err) {
    logger.error({ err }, 'MongoDB connection error');
    throw err;
  }
}
