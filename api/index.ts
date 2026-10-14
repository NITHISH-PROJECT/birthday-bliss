import type { VercelRequest, VercelResponse } from '@vercel/node';
import mongoose from 'mongoose';
import app from '../server/src/app';
import { config } from '../server/src/config';

let isConnected = false;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (config.mongodbUri && !isConnected && mongoose.connection.readyState !== 1) {
    try {
      await mongoose.connect(config.mongodbUri, {
        serverSelectionTimeoutMS: 5000,
      });
      isConnected = true;
    } catch (err) {
      console.warn('MongoDB connection error on Vercel:', err);
    }
  }
  return app(req, res);
}
