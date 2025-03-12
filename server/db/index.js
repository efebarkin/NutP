import mongoose from 'mongoose';
import { defineNitroPlugin } from 'nitropack/runtime/plugin';

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

    // Uygulama kapatıldığında bağlantıyı temiz bir şekilde kapat
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
      } catch (err) {
        console.error('Error closing MongoDB connection:', err);
        process.exit(1);
      }
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
});