import { defineEventHandler, createError } from 'h3';
import Food from '../../models/Food.js';

const USDA_API_KEY = process.env.USDA_API_KEY;
const USDA_API_URL = 'https://api.nal.usda.gov/fdc/v1';

// Besin kategorilerini eşleştir
const mapCategory = (foodCategory) => {
  const categoryMap = {
    'Dairy and Egg Products': 'protein',
    'Spices and Herbs': 'other',
    'Baby Foods': 'other',
    'Fats and Oils': 'fat',
    'Poultry Products': 'protein',
    'Soups, Sauces, and Gravies': 'other',
    'Sausages and Luncheon Meats': 'protein',
    'Breakfast Cereals': 'carbohydrate',
    'Fruits and Fruit Juices': 'carbohydrate',
    'Pork Products': 'protein',
    'Vegetables and Vegetable Products': 'carbohydrate',
    'Nut and Seed Products': 'fat',
    'Beef Products': 'protein',
    'Beverages': 'other',
    'Finfish and Shellfish Products': 'protein',
    'Legumes and Legume Products': 'protein',
    'Lamb, Veal, and Game Products': 'protein',
    'Baked Products': 'carbohydrate',
    'Sweets': 'carbohydrate',
    'Cereal Grains and Pasta': 'carbohydrate',
    'Fast Foods': 'other',
    'Meals, Entrees, and Side Dishes': 'other',
    'Snacks': 'other',
    'American Indian/Alaska Native Foods': 'other',
    'Restaurant Foods': 'other'
  };

  return categoryMap[foodCategory] || 'other';
};

// Besin değerlerini bul
const findNutrientValue = (nutrients, nutrientId) => {
  const nutrient = nutrients.find(n => n.nutrientId === nutrientId);
  return nutrient ? nutrient.value : 0;
};

// USDA'dan veri çek
const fetchFromUSDA = async (pageSize = 50, pageNumber = 1) => {
  const response = await fetch(`${USDA_API_URL}/foods/list?api_key=${USDA_API_KEY}&pageSize=${pageSize}&pageNumber=${pageNumber}&dataType=Foundation,SR Legacy`);
  if (!response.ok) {
    throw new Error(`USDA API error: ${response.statusText}`);
  }
  return response.json();
};

// Veriyi MongoDB formatına dönüştür
const transformFoodData = (usdaFood) => {
  const nutrients = usdaFood.foodNutrients || [];
  
  return {
    name: {
      tr: usdaFood.description, // Daha sonra çeviri yapılacak
      en: usdaFood.description
    },
    nutrients: {
      energy: {
        value: findNutrientValue(nutrients, 1008), // Enerji (kcal)
        unit: 'KCAL'
      },
      protein: {
        value: findNutrientValue(nutrients, 1003), // Protein
        unit: 'G'
      },
      carbohydrate: {
        value: findNutrientValue(nutrients, 1005), // Karbonhidrat
        unit: 'G'
      },
      fat: {
        value: findNutrientValue(nutrients, 1004), // Yağ
        unit: 'G'
      },
      fiber: {
        value: findNutrientValue(nutrients, 1079), // Lif
        unit: 'G'
      },
      sugar: {
        value: findNutrientValue(nutrients, 2000), // Şeker
        unit: 'G'
      }
    },
    category: mapCategory(usdaFood.foodCategory?.description),
    source: 'usda',
    portions: [{
      name: '100 gram',
      weight: 100,
      isDefault: true
    }],
    metadata: {
      fdcId: usdaFood.fdcId,
      isVerified: true,
      addedBy: 'system',
      addedAt: new Date(),
      updatedAt: new Date()
    }
  };
};

export default defineEventHandler(async (event) => {
  try {
    console.log('Starting USDA data import...');

    if (!USDA_API_KEY) {
      throw new Error('USDA API key is not configured');
    }

    // Mevcut verileri temizle
    await Food.deleteMany({});
    console.log('Cleared existing data');

    const pageSize = 50;
    const totalPages = 10; // İlk 500 besin
    let importedCount = 0;
    let errors = [];

    for (let page = 1; page <= totalPages; page++) {
      try {
        console.log(`Fetching page ${page}/${totalPages}...`);
        const usdaFoods = await fetchFromUSDA(pageSize, page);
        
        const transformedFoods = usdaFoods
          .filter(food => food.foodCategory) // Kategorisi olan besinleri al
          .map(transformFoodData);

        if (transformedFoods.length > 0) {
          await Food.insertMany(transformedFoods);
          importedCount += transformedFoods.length;
          console.log(`Imported ${transformedFoods.length} foods from page ${page}`);
        }

        // API limitini aşmamak için bekle
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error importing page ${page}:`, error);
        errors.push(`Page ${page}: ${error.message}`);
      }
    }

    console.log('Import completed');
    return {
      success: true,
      message: `Successfully imported ${importedCount} foods`,
      errors: errors.length > 0 ? errors : undefined
    };
  } catch (error) {
    console.error('Import error:', error);
    throw createError({
      statusCode: 500,
      message: 'Veri aktarımı sırasında bir hata oluştu',
      cause: error
    });
  }
});
