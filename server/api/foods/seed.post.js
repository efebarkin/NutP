import { defineEventHandler, createError } from 'h3';
import Food from '../../models/Food.js';

const sampleFoods = [
  {
    name: {
      tr: 'Elma',
      en: 'Apple'
    },
    nutrients: {
      energy: {
        value: 52,
        unit: 'KCAL'
      },
      protein: {
        value: 0.3,
        unit: 'G'
      },
      carbohydrate: {
        value: 14,
        unit: 'G'
      },
      fat: {
        value: 0.2,
        unit: 'G'
      },
      fiber: {
        value: 2.4,
        unit: 'G'
      },
      sugar: {
        value: 10.4,
        unit: 'G'
      }
    },
    category: 'other',
    source: 'usda',
    portions: [
      {
        name: '1 orta boy',
        weight: 182,
        isDefault: true
      },
      {
        name: '100 gram',
        weight: 100,
        isDefault: false
      }
    ],
    metadata: {
      fdcId: '09003',
      isVerified: true,
      addedBy: 'system'
    }
  }
];

export default defineEventHandler(async (event) => {
  try {
    console.log('Starting seed operation...');
    
    // Mevcut verileri temizle
    console.log('Clearing existing data...');
    await Food.deleteMany({});
    
    // Yeni verileri ekle
    console.log('Inserting sample foods...');
    console.log('Sample food data:', JSON.stringify(sampleFoods[0], null, 2));
    
    const foods = await Food.insertMany(sampleFoods);
    console.log(`Successfully inserted ${foods.length} foods`);
    
    return {
      success: true,
      message: 'Test verileri başarıyla eklendi',
      count: foods.length
    };
  } catch (error) {
    console.error('Seed error:', error);
    throw createError({
      statusCode: 500,
      message: 'Test verileri eklenirken bir hata oluştu',
      cause: error
    });
  }
});
