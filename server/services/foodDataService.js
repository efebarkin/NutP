// services/foodDataService.js

import Food from '../models/Food.js';
import axios from 'axios';

const API_KEY = 'n1jdLhZp6x0AWR6wiHcyaTMW69iulYntVXB4URUD';
const BASE_URL = 'https://api.nal.usda.gov/fdc/v1';

const NUTRIENT_IDS = {
  // Temel besin değerleri
  ENERGY: 1008,    // Energy (kcal)
  PROTEIN: 1003,   // Protein (g)
  FAT: 1004,       // Total lipids (fat) (g)
  CARBS: 1005,     // Carbohydrate, by difference (g)
  FIBER: 1079,     // Fiber, total dietary (g)
  SUGAR: 2000,     // Sugars, total including NLEA (g)
  
  // Yağlar ve Kolesterol
  CHOLESTEROL: 1253,          // Cholesterol (mg)
  SATURATED_FAT: 1258,        // Fatty acids, total saturated (g)
  MONOUNSATURATED_FAT: 1292,  // Fatty acids, total monounsaturated (g)
  POLYUNSATURATED_FAT: 1293,  // Fatty acids, total polyunsaturated (g)
  TRANS_FAT: 1257,            // Fatty acids, total trans (g)
  OMEGA_3: 1404,              // Omega-3 fatty acids (g)
  OMEGA_6: 1405,              // Omega-6 fatty acids (g)
  
  // Amino Asitler
  TRYPTOPHAN: 1210,    // Tryptophan (g)
  THREONINE: 1211,     // Threonine (g)
  ISOLEUCINE: 1212,    // Isoleucine (g)
  LEUCINE: 1213,       // Leucine (g)
  LYSINE: 1214,        // Lysine (g)
  METHIONINE: 1215,    // Methionine (g)
  PHENYLALANINE: 1217, // Phenylalanine (g)
  VALINE: 1219,        // Valine (g)
  HISTIDINE: 1221,     // Histidine (g)
  
  // Mineraller
  CALCIUM: 1087,   // Calcium, Ca (mg)
  IRON: 1089,      // Iron, Fe (mg)
  MAGNESIUM: 1090, // Magnesium, Mg (mg)
  PHOSPHORUS: 1091,// Phosphorus, P (mg)
  POTASSIUM: 1092, // Potassium, K (mg)
  SODIUM: 1093,    // Sodium, Na (mg)
  ZINC: 1095,      // Zinc, Zn (mg)
  COPPER: 1098,    // Copper, Cu (mg)
  SELENIUM: 1103,  // Selenium, Se (µg)
  MANGANESE: 1101, // Manganese, Mn (mg)
  FLUORIDE: 1099,  // Fluoride, F (µg)
  CHROMIUM: 1096,  // Chromium, Cr (µg)
  
  // Vitaminler
  VITAMIN_C: 1162,    // Vitamin C (mg)
  VITAMIN_B1: 1165,   // Thiamin (mg)
  VITAMIN_B2: 1166,   // Riboflavin (mg)
  VITAMIN_B3: 1167,   // Niacin (mg)
  VITAMIN_B5: 1170,   // Pantothenic acid (mg)
  VITAMIN_B6: 1175,   // Vitamin B-6 (mg)
  VITAMIN_B7: 1176,   // Biotin (µg)
  VITAMIN_B9: 1177,   // Folate, total (µg)
  VITAMIN_B12: 1178,  // Vitamin B-12 (µg)
  VITAMIN_A: 1106,    // Vitamin A, RAE (µg)
  VITAMIN_E: 1109,    // Vitamin E (mg)
  VITAMIN_D: 1114,    // Vitamin D (IU)
  VITAMIN_K: 1185,    // Vitamin K (µg)
  
  // Diğer Önemli Bileşenler
  CAFFEINE: 1057,        // Caffeine (mg)
  ALCOHOL: 1018,         // Alcohol, ethyl (g)
  WATER: 1051,          // Water (g)
  ASH: 1007,            // Ash (g)
  THEOBROMINE: 1058     // Theobromine (mg)
};

// USDA kategori eşleştirmeleri
const FOOD_CATEGORIES = {
  'Dairy and Egg Products': 'dairy_and_eggs',
  'Spices and Herbs': 'spices_and_herbs',
  'Baby Foods': 'baby_foods',
  'Fats and Oils': 'fats_and_oils',
  'Poultry Products': 'poultry',
  'Soups, Sauces, and Gravies': 'soups_and_sauces',
  'Sausages and Luncheon Meats': 'processed_meats',
  'Breakfast Cereals': 'cereals',
  'Fruits and Fruit Juices': 'fruits',
  'Pork Products': 'pork',
  'Vegetables and Vegetable Products': 'vegetables',
  'Nut and Seed Products': 'nuts_and_seeds',
  'Beef Products': 'beef',
  'Beverages': 'beverages',
  'Finfish and Shellfish Products': 'seafood',
  'Legumes and Legume Products': 'legumes',
  'Lamb, Veal, and Game Products': 'other_meats',
  'Baked Products': 'baked_goods',
  'Sweets': 'sweets',
  'Cereal Grains and Pasta': 'grains_and_pasta',
  'Fast Foods': 'fast_foods',
  'Meals, Entrees, and Side Dishes': 'prepared_meals',
  'Snacks': 'snacks',
  'Restaurant Foods': 'restaurant_foods',
  'American Indian/Alaska Native Foods': 'ethnic_foods',
  'Ethnic Foods': 'ethnic_foods'
};

export default class FoodDataService {
  constructor() {
    this.apiKey = API_KEY;
    this.axiosInstance = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  // Tek bir yiyecek detayını getir
  async getFoodById(fdcId) {
    try {
      const response = await this.axiosInstance.get(`/food/${fdcId}`, {
        params: {
          api_key: this.apiKey
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching food details:', error.message);
      if (error.response) {
        console.error('API Error:', error.response.data);
      }
      throw error;
    }
  }

  // Birden fazla yiyecek detayını getir
  async getFoodsByIds(fdcIds) {
    try {
      const response = await this.axiosInstance.post('/foods', {
        fdcIds: fdcIds
      }, {
        params: {
          api_key: this.apiKey
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching multiple foods:', error.message);
      if (error.response) {
        console.error('API Error:', error.response.data);
      }
      throw error;
    }
  }

  // Yiyecek listesini getir (sayfalı)
  async getFoodsList(pageSize = 25, pageNumber = 1) {
    try {
      const response = await this.axiosInstance.get('/foods/search', {
        params: {
          api_key: this.apiKey,
          query: '*',
          pageSize,
          pageNumber,
          dataType: 'Foundation,SR Legacy'
        }
      });
      const data = response.data;
      return {
        foods: data.foods || [],
        totalHits: data.totalHits || 0,
        currentPage: data.currentPage || pageNumber,
        totalPages: Math.ceil((data.totalHits || 0) / pageSize)
      };
    } catch (error) {
      console.error('Error fetching foods list:', error.message);
      if (error.response) {
        console.error('API Error:', error.response.data);
      }
      throw error;
    }
  }

  // Yiyecek ara
  async searchFoods(query, pageSize = 25, pageNumber = 1) {
    try {
      const response = await this.axiosInstance.get('/foods/search', {
        params: {
          api_key: this.apiKey,
          query,
          pageSize,
          pageNumber,
          dataType: 'Foundation,SR Legacy',
          sortBy: 'dataType.keyword',
          sortOrder: 'asc'
        }
      });
      const data = response.data;
      
      return {
        foods: data.foods || [],
        totalHits: data.totalHits || 0,
        currentPage: pageNumber,
        totalPages: Math.ceil((data.totalHits || 0) / pageSize)
      };
    } catch (error) {
      console.error('Error searching foods:', error.message);
      if (error.response) {
        console.error('API Error:', error.response.data);
      }
      throw error;
    }
  }

  // Tüm yiyecekleri USDA'dan çek ve MongoDB'ye kaydet
  async fetchAndSaveAllFoods() {
    try {
      let pageNumber = 1;
      const pageSize = 200; // Her sayfada 200 yiyecek
      let totalFoods = 0;
      let hasMorePages = true;

      while (hasMorePages) {
        console.log(`Fetching page ${pageNumber}...`);
        const response = await this.axiosInstance.get('/foods/search', {
          params: {
            api_key: this.apiKey,
            pageSize,
            pageNumber,
            dataType: 'Foundation,SR Legacy'
          }
        });

        const data = response.data;

        if (!data.foods || data.foods.length === 0) {
          hasMorePages = false;
          break;
        }

        const foods = data.foods.map(food => ({
          name: {
            en: food.description,
            tr: food.description // İngilizce ismi geçici olarak Türkçe için de kullanıyoruz
          },
          nutrients: {
            energy: {
              value: this._getNutrientValueById(food.foodNutrients, NUTRIENT_IDS.ENERGY) || 0,
              unit: 'KCAL'
            },
            protein: {
              value: this._getNutrientValueById(food.foodNutrients, NUTRIENT_IDS.PROTEIN) || 0,
              unit: 'G'
            },
            carbohydrate: {
              value: this._getNutrientValueById(food.foodNutrients, NUTRIENT_IDS.CARBS) || 0,
              unit: 'G'
            },
            fat: {
              value: this._getNutrientValueById(food.foodNutrients, NUTRIENT_IDS.FAT) || 0,
              unit: 'G'
            },
            fiber: {
              value: this._getNutrientValueById(food.foodNutrients, NUTRIENT_IDS.FIBER) || 0,
              unit: 'G'
            },
            sugar: {
              value: this._getNutrientValueById(food.foodNutrients, NUTRIENT_IDS.SUGAR) || 0,
              unit: 'G'
            },
            cholesterol: {
              value: this._getNutrientValueById(food.foodNutrients, NUTRIENT_IDS.CHOLESTEROL) || 0,
              unit: 'MG'
            },
            saturatedFat: {
              value: this._getNutrientValueById(food.foodNutrients, NUTRIENT_IDS.SATURATED_FAT) || 0,
              unit: 'G'
            },
            monounsaturatedFat: {
              value: this._getNutrientValueById(food.foodNutrients, NUTRIENT_IDS.MONOUNSATURATED_FAT) || 0,
              unit: 'G'
            },
            polyunsaturatedFat: {
              value: this._getNutrientValueById(food.foodNutrients, NUTRIENT_IDS.POLYUNSATURATED_FAT) || 0,
              unit: 'G'
            },
            transFat: {
              value: this._getNutrientValueById(food.foodNutrients, NUTRIENT_IDS.TRANS_FAT) || 0,
              unit: 'G'
            },
            omega3: {
              value: this._getNutrientValueById(food.foodNutrients, NUTRIENT_IDS.OMEGA_3) || 0,
              unit: 'G'
            },
            omega6: {
              value: this._getNutrientValueById(food.foodNutrients, NUTRIENT_IDS.OMEGA_6) || 0,
              unit: 'G'
            }
          },
          aminoAcids: {
            tryptophan: {
              value: this._getNutrientValueById(food.foodNutrients, NUTRIENT_IDS.TRYPTOPHAN) || 0,
              unit: 'G'
            },
            threonine: {
              value: this._getNutrientValueById(food.foodNutrients, NUTRIENT_IDS.THREONINE) || 0,
              unit: 'G'
            },
            isoleucine: {
              value: this._getNutrientValueById(food.foodNutrients, NUTRIENT_IDS.ISOLEUCINE) || 0,
              unit: 'G'
            },
            leucine: {
              value: this._getNutrientValueById(food.foodNutrients, NUTRIENT_IDS.LEUCINE) || 0,
              unit: 'G'
            },
            lysine: {
              value: this._getNutrientValueById(food.foodNutrients, NUTRIENT_IDS.LYSINE) || 0,
              unit: 'G'
            },
            methionine: {
              value: this._getNutrientValueById(food.foodNutrients, NUTRIENT_IDS.METHIONINE) || 0,
              unit: 'G'
            },
            phenylalanine: {
              value: this._getNutrientValueById(food.foodNutrients, NUTRIENT_IDS.PHENYLALANINE) || 0,
              unit: 'G'
            },
            valine: {
              value: this._getNutrientValueById(food.foodNutrients, NUTRIENT_IDS.VALINE) || 0,
              unit: 'G'
            },
            histidine: {
              value: this._getNutrientValueById(food.foodNutrients, NUTRIENT_IDS.HISTIDINE) || 0,
              unit: 'G'
            }
          },
          minerals: {
            calcium: {
              value: this._getNutrientValueById(food.foodNutrients, NUTRIENT_IDS.CALCIUM) || 0,
              unit: 'MG'
            },
            iron: {
              value: this._getNutrientValueById(food.foodNutrients, NUTRIENT_IDS.IRON) || 0,
              unit: 'MG'
            },
            magnesium: {
              value: this._getNutrientValueById(food.foodNutrients, NUTRIENT_IDS.MAGNESIUM) || 0,
              unit: 'MG'
            },
            phosphorus: {
              value: this._getNutrientValueById(food.foodNutrients, NUTRIENT_IDS.PHOSPHORUS) || 0,
              unit: 'MG'
            },
            potassium: {
              value: this._getNutrientValueById(food.foodNutrients, NUTRIENT_IDS.POTASSIUM) || 0,
              unit: 'MG'
            },
            sodium: {
              value: this._getNutrientValueById(food.foodNutrients, NUTRIENT_IDS.SODIUM) || 0,
              unit: 'MG'
            },
            zinc: {
              value: this._getNutrientValueById(food.foodNutrients, NUTRIENT_IDS.ZINC) || 0,
              unit: 'MG'
            },
            copper: {
              value: this._getNutrientValueById(food.foodNutrients, NUTRIENT_IDS.COPPER) || 0,
              unit: 'MG'
            },
            selenium: {
              value: this._getNutrientValueById(food.foodNutrients, NUTRIENT_IDS.SELENIUM) || 0,
              unit: 'UG'
            },
            manganese: {
              value: this._getNutrientValueById(food.foodNutrients, NUTRIENT_IDS.MANGANESE) || 0,
              unit: 'MG'
            },
            fluoride: {
              value: this._getNutrientValueById(food.foodNutrients, NUTRIENT_IDS.FLUORIDE) || 0,
              unit: 'UG'
            },
            chromium: {
              value: this._getNutrientValueById(food.foodNutrients, NUTRIENT_IDS.CHROMIUM) || 0,
              unit: 'UG'
            }
          },
          vitamins: {
            c: {
              value: this._getNutrientValueById(food.foodNutrients, NUTRIENT_IDS.VITAMIN_C) || 0,
              unit: 'MG'
            },
            b1: {
              value: this._getNutrientValueById(food.foodNutrients, NUTRIENT_IDS.VITAMIN_B1) || 0,
              unit: 'MG'
            },
            b2: {
              value: this._getNutrientValueById(food.foodNutrients, NUTRIENT_IDS.VITAMIN_B2) || 0,
              unit: 'MG'
            },
            b3: {
              value: this._getNutrientValueById(food.foodNutrients, NUTRIENT_IDS.VITAMIN_B3) || 0,
              unit: 'MG'
            },
            b5: {
              value: this._getNutrientValueById(food.foodNutrients, NUTRIENT_IDS.VITAMIN_B5) || 0,
              unit: 'MG'
            },
            b6: {
              value: this._getNutrientValueById(food.foodNutrients, NUTRIENT_IDS.VITAMIN_B6) || 0,
              unit: 'MG'
            },
            b7: {
              value: this._getNutrientValueById(food.foodNutrients, NUTRIENT_IDS.VITAMIN_B7) || 0,
              unit: 'UG'
            },
            b9: {
              value: this._getNutrientValueById(food.foodNutrients, NUTRIENT_IDS.VITAMIN_B9) || 0,
              unit: 'UG'
            },
            b12: {
              value: this._getNutrientValueById(food.foodNutrients, NUTRIENT_IDS.VITAMIN_B12) || 0,
              unit: 'UG'
            },
            a: {
              value: this._getNutrientValueById(food.foodNutrients, NUTRIENT_IDS.VITAMIN_A) || 0,
              unit: 'UG'
            },
            e: {
              value: this._getNutrientValueById(food.foodNutrients, NUTRIENT_IDS.VITAMIN_E) || 0,
              unit: 'MG'
            },
            d: {
              value: this._getNutrientValueById(food.foodNutrients, NUTRIENT_IDS.VITAMIN_D) || 0,
              unit: 'IU'
            },
            k: {
              value: this._getNutrientValueById(food.foodNutrients, NUTRIENT_IDS.VITAMIN_K) || 0,
              unit: 'UG'
            }
          },
          category: FOOD_CATEGORIES[food.foodCategory?.description] || 'other',
          source: 'usda',
          portions: [{
            name: 'gram',
            weight: 100,
            isDefault: true
          }],
          metadata: {
            fdcId: food.fdcId,
            isVerified: true,
            addedBy: 'system',
            originalCategory: food.foodCategory?.description || 'Unknown'
          }
        }));

        // MongoDB'ye kaydet
        await Food.insertMany(foods, { ordered: false }).catch(err => {
          console.log(`Some foods in page ${pageNumber} already exist, continuing...`);
        });

        totalFoods += foods.length;
        console.log(`Saved ${foods.length} foods from page ${pageNumber}. Total foods saved: ${totalFoods}`);
        
        pageNumber++;
        
        // API limit aşımını önlemek için her istekten sonra kısa bir bekleme
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      console.log(`Completed! Total foods saved: ${totalFoods}`);
      return totalFoods;
    } catch (error) {
      console.error('Error fetching and saving foods:', error.message);
      if (error.response) {
        console.error('API Error:', error.response.data);
      }
      throw error;
    }
  }

  // Besin değerini ID'ye göre bul
  _getNutrientValueById(nutrients, nutrientId) {
    const nutrient = nutrients.find(n => n.nutrientId === nutrientId);
    return nutrient ? nutrient.value : 0;
  }
}
