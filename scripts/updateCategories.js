import mongoose from 'mongoose';
import FoodDataService from '../server/services/foodDataService.js';

const MONGODB_URI = 'mongodb://127.0.0.1:27017/nutdb';

async function updateFoodCategories() {
  try {
    // MongoDB'ye bağlan
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB bağlantısı başarılı');

    // Mevcut verileri temizle
    await mongoose.connection.dropCollection('foods');
    console.log('Mevcut besin verileri temizlendi');

    // Yeni verileri yükle
    const foodService = new FoodDataService();
    const totalFoods = await foodService.fetchAndSaveAllFoods();
    
    console.log(`Toplam ${totalFoods} besin yeni kategorilerle yüklendi`);
    
    await mongoose.disconnect();
    console.log('MongoDB bağlantısı kapatıldı');
    
  } catch (error) {
    console.error('Hata:', error);
    process.exit(1);
  }
}

updateFoodCategories();
