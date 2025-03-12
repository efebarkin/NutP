import { defineEventHandler, createError } from 'h3';
import Food from '../../models/Food';
import { ErrorTypes } from '~/server/utils/error';

// Basit Türkçe çeviri sözlüğü
const translations = {
  'apple': 'elma',
  'banana': 'muz',
  'orange': 'portakal',
  'meat': 'et',
  'chicken': 'tavuk',
  'fish': 'balık',
  'bread': 'ekmek',
  'water': 'su',
  'milk': 'süt',
  'egg': 'yumurta',
  // Temel besinler için çeviriler eklenebilir
};

// Basit çeviri fonksiyonu
function translateToTurkish(text) {
  const lowerText = text.toLowerCase();
  return translations[lowerText] || text; // Çeviri bulunamazsa orijinal metni döndür
}

export default defineEventHandler(async (event) => {
  try {
    // Tüm yiyecekleri getir
    const foods = await Food.find({});
    let translatedCount = 0;
    
    // Her yiyecek için
    for (const food of foods) {
      // İngilizce ismi varsa ve Türkçe isim yoksa veya İngilizce ile aynıysa
      if (food.name.en && (!food.name.tr || food.name.tr === food.name.en)) {
        // Türkçe çevirisini bul
        const turkishName = translateToTurkish(food.name.en);
        
        // Eğer çeviri orijinalden farklıysa güncelle
        if (turkishName !== food.name.en) {
          food.name.tr = turkishName;
          await food.save();
          translatedCount++;
        }
      }
    }

    return {
      success: true,
      message: `${translatedCount} yiyecek çevirildi`,
      totalProcessed: foods.length
    };
  } catch (error) {
    console.error('Translation error:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || ErrorTypes.INTERNAL_SERVER_ERROR
    });
  }
});
