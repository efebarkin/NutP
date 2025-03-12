import Food from '../models/Food';
import FoodDataService from './foodDataService';
import User from '../models/User';
import createError from 'http-errors';

export default class FoodService {
  constructor() {
    this.usdaService = new FoodDataService();
  }

  // Besin ara
  async searchFoods(query = '', pageSize = 25, pageNumber = 1) {
    try {
      const skip = (pageNumber - 1) * pageSize;
      
      let searchQuery = {};
      if (query && query.trim()) {
        searchQuery = {
          $or: [
            { 'name.tr': { $regex: query, $options: 'i' } },
            { 'name.en': { $regex: query, $options: 'i' } }
          ]
        };
      }

      const [foods, totalCount] = await Promise.all([
        Food.find(searchQuery)
          .skip(skip)
          .limit(pageSize)
          .sort({ 'name.tr': 1 }),
        Food.countDocuments(searchQuery)
      ]);

      return {
        foods,
        totalHits: totalCount,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalCount / pageSize)
      };
    } catch (error) {
      console.error('Error searching foods:', error);
      throw error;
    }
  }

  // Besin detayını getir
  async getFoodById(id) {
    try {
      const food = await Food.findById(id);
      if (!food) {
        throw new Error('Besin bulunamadı');
      }
      return food;
    } catch (error) {
      console.error('Error fetching food:', error);
      throw error;
    }
  }

  // USDA'dan besin verilerini MongoDB'ye aktar
  async importFromUSDA(pageSize = 100, pageNumber = 1) {
    try {
      const result = await this.usdaService.getFoodsList(pageSize, pageNumber);
      
      for (const usdaFood of result.foods) {
        const existingFood = await Food.findOne({ 'metadata.fdcId': usdaFood.fdcId });
        
        if (!existingFood) {
          const food = new Food({
            name: {
              en: usdaFood.description,
              tr: usdaFood.description // Başlangıçta İngilizce ismi kullan
            },
            nutrients: {
              energy: this.extractNutrient(usdaFood, 'Energy'),
              protein: this.extractNutrient(usdaFood, 'Protein'),
              carbohydrate: this.extractNutrient(usdaFood, 'Carbohydrate, by difference'),
              fat: this.extractNutrient(usdaFood, 'Total lipid (fat)'),
              fiber: this.extractNutrient(usdaFood, 'Fiber, total dietary'),
              sugar: this.extractNutrient(usdaFood, 'Sugars, total including NLEA')
            },
            category: this.determineCategory(usdaFood),
            source: 'usda',
            portions: [{
              name: '100 gram',
              weight: 100,
              isDefault: true
            }],
            metadata: {
              fdcId: usdaFood.fdcId,
              isVerified: true,
              addedBy: 'system'
            }
          });

          await food.save();
        }
      }

      return {
        imported: result.foods.length,
        totalPages: result.totalPages
      };
    } catch (error) {
      console.error('Error importing from USDA:', error);
      throw error;
    }
  }

  // USDA besin verilerinden besin değerini çıkar
  extractNutrient(food, nutrientName) {
    const nutrient = food.foodNutrients?.find(n => 
      n.nutrientName?.toLowerCase().includes(nutrientName.toLowerCase()) ||
      n.name?.toLowerCase().includes(nutrientName.toLowerCase())
    );

    return {
      value: nutrient ? (nutrient.value || nutrient.amount || 0) : 0,
      unit: nutrient ? (nutrient.unitName || 'g') : 'g'
    };
  }

  // Besin kategorisini belirle
  determineCategory(food) {
    const description = food.description.toLowerCase();
    
    if (description.includes('milk') || description.includes('cheese') || description.includes('yogurt')) {
      return 'dairy';
    } else if (description.includes('meat') || description.includes('chicken') || description.includes('fish')) {
      return 'meat';
    } else if (description.includes('vegetable') || description.includes('carrot') || description.includes('tomato')) {
      return 'vegetable';
    } else if (description.includes('fruit') || description.includes('apple') || description.includes('banana')) {
      return 'fruit';
    } else if (description.includes('bread') || description.includes('rice') || description.includes('pasta')) {
      return 'grain';
    } else if (description.includes('juice') || description.includes('beverage') || description.includes('drink')) {
      return 'beverage';
    }
    
    return 'other';
  }
}

export async function addFavoriteFood(userId, foodId) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw createError({
        statusCode: 404,
        message: 'User not found'
      });
    }

    // Check if food exists
    const food = await Food.findById(foodId);
    if (!food) {
      throw createError({
        statusCode: 404,
        message: 'Food not found'
      });
    }

    // Add to favorites if not already added
    if (!user.favoriteFoods.includes(foodId)) {
      user.favoriteFoods.push(foodId);
      await user.save();
    }

    return user.favoriteFoods;
  } catch (error) {
    console.error('Error adding favorite food:', error);
    throw error;
  }
}

export async function removeFavoriteFood(userId, foodId) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw createError({
        statusCode: 404,
        message: 'User not found'
      });
    }

    // Remove from favorites
    user.favoriteFoods = user.favoriteFoods.filter(id => id.toString() !== foodId);
    await user.save();

    return user.favoriteFoods;
  } catch (error) {
    console.error('Error removing favorite food:', error);
    throw error;
  }
}

export async function getFavoriteFoods(userId) {
  try {
    const user = await User.findById(userId).populate('favoriteFoods');
    if (!user) {
      throw createError({
        statusCode: 404,
        message: 'User not found'
      });
    }

    return user.favoriteFoods;
  } catch (error) {
    console.error('Error getting favorite foods:', error);
    throw error;
  }
}
