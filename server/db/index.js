import mongoose from 'mongoose';
import { defineNitroPlugin } from 'nitropack/runtime/plugin';

mongoose.set('strictQuery', false);

export default defineNitroPlugin(async (nitroApp) => {
  const config = useRuntimeConfig();
  

  // MongoDB bağlantı seçenekleri
  const options = {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    maxPoolSize: 10,
    minPoolSize: 5,
    retryWrites: true,
    retryReads: true,
  };

  // Mevcut bağlantıyı kontrol et
  if (mongoose.connection.readyState === 1) {
    console.log('MongoDB is already connected');
    return;
  }

  try {
    await mongoose.connect(config.mongodbUri, options);
    console.log('MongoDB connected successfully');

    // Bağlantı olaylarını dinle
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }

  nitroApp.hooks.hook('close', async () => {
    // Sadece bağlantı açıksa kapatmayı dene
    if (mongoose.connection.readyState === 1) {
      try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed successfully due to application shutdown.');
      } catch (err) {
        console.error('Error closing MongoDB connection during application shutdown:', err);
      }
    }
  });
});