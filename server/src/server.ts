import mongoose from 'mongoose';
import app from './app';
import { config } from './config';
import { storageService } from './services/storageService';

async function startServer() {
  console.log('✨ Starting Birthday Bliss Server...');

  // Attempt to connect to MongoDB, but don't crash if offline in local dev mode
  try {
    console.log(`🔌 Attempting to connect to MongoDB at: ${config.mongodbUri}`);
    await mongoose.connect(config.mongodbUri, {
      serverSelectionTimeoutMS: 3000, // Quick timeout for local fallback
    });
    console.log('✅ MongoDB connected successfully!');
  } catch (err: any) {
    console.warn(
      `⚠️ MongoDB connection skipped or failed (${err.message}).`
    );
    console.log('🚀 Activating Persistent Local JSON Storage mode. All data will be saved safely in data/surprises.json!');
  }

  app.listen(config.port, () => {
    console.log(`🎉 Birthday Bliss API running at: http://localhost:${config.port}`);
    console.log(`📦 Active Storage Mode: ${storageService.getStorageMode()}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
