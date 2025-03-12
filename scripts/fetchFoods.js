import mongoose from 'mongoose';
import FoodDataService from '../server/services/foodDataService.js';
import Food from '../server/models/Food.js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function main() {
  try {
    // Connect to MongoDB
    const mongoUri = 'mongodb://localhost:27017/nutritrack';
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB at:', mongoUri);

    // Mevcut verileri temizle
    await Food.deleteMany({});
    console.log('Mevcut besin verileri temizlendi');

    // Yeni verileri yükle
    const foodService = new FoodDataService();
    const totalFoods = await foodService.fetchAndSaveAllFoods();
    
    console.log(`Toplam ${totalFoods} besin yeni kategorilerle yüklendi`);
  } catch (error) {
    console.error('Hata:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

main();
