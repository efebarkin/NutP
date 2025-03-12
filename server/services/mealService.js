// services/mealService.js

import { Meal } from '../models/Meal';
import { User } from '../models/User';
import { Food } from '../models/Food';
import createError from 'http-errors';

class MealService {
  static async createMeal(userId, mealData) {
    try {
      // Check if user exists
      const user = await User.findById(userId);
      if (!user) {
        throw createError({
          statusCode: 404,
          message: 'User not found'
        });
      }

      // Create new meal
      const meal = new Meal({
        ...mealData,
        userId: userId,
        date: mealData.date || new Date(),
        foods: mealData.foods.map(food => ({
          foodId: food.foodId,
          quantity: food.quantity || 100, // default to 100g if not specified
          unit: food.unit || 'g'
        }))
      });

      // Calculate total nutrients
      const foodIds = meal.foods.map(f => f.foodId);
      const foods = await Food.find({ _id: { $in: foodIds } });
      
      meal.totalNutrients = MealService.calculateTotalNutrients(foods, meal.foods);

      await meal.save();
      return meal;
    } catch (error) {
      console.error('Error creating meal:', error);
      throw error;
    }
  }

  static async getUserMeals(userId, query = {}) {
    try {
      const { startDate, endDate, type } = query;
      const queryObj = { userId };

      if (startDate || endDate) {
        queryObj.date = {};
        if (startDate) queryObj.date.$gte = new Date(startDate);
        if (endDate) queryObj.date.$lte = new Date(endDate);
      }

      if (type) {
        queryObj.type = type;
      }

      const meals = await Meal.find(queryObj)
        .populate('foods.foodId')
        .sort({ date: -1 });

      return meals;
    } catch (error) {
      console.error('Error getting user meals:', error);
      throw error;
    }
  }

  static async updateMeal(userId, mealId, updateData) {
    try {
      const meal = await Meal.findOne({ _id: mealId, userId });
      if (!meal) {
        throw createError({
          statusCode: 404,
          message: 'Meal not found or unauthorized'
        });
      }

      // Update meal data
      Object.assign(meal, updateData);

      // Recalculate nutrients if foods were updated
      if (updateData.foods) {
        const foodIds = meal.foods.map(f => f.foodId);
        const foods = await Food.find({ _id: { $in: foodIds } });
        meal.totalNutrients = MealService.calculateTotalNutrients(foods, meal.foods);
      }

      await meal.save();
      return meal;
    } catch (error) {
      console.error('Error updating meal:', error);
      throw error;
    }
  }

  static async deleteMeal(userId, mealId) {
    try {
      const result = await Meal.deleteOne({ _id: mealId, userId });
      if (result.deletedCount === 0) {
        throw createError({
          statusCode: 404,
          message: 'Meal not found or unauthorized'
        });
      }
      return { success: true };
    } catch (error) {
      console.error('Error deleting meal:', error);
      throw error;
    }
  }

  static async getMealById(mealId, userId) {
    try {
      const meal = await Meal.findOne({ _id: mealId, userId }).populate('foods.foodId');
      if (!meal) {
        throw new Error('Meal not found');
      }
      return meal;
    } catch (error) {
      throw error;
    }
  }

  static async addFoodToMeal(mealId, userId, foodData) {
    try {
      const meal = await Meal.findOne({ _id: mealId, userId });
      if (!meal) {
        throw new Error('Meal not found');
      }

      const food = await Food.findById(foodData.foodId);
      if (!food) {
        throw new Error('Food not found');
      }

      meal.foods.push(foodData);
      await meal.save();

      return meal;
    } catch (error) {
      throw error;
    }
  }

  static async removeFoodFromMeal(mealId, userId, foodId) {
    try {
      const meal = await Meal.findOne({ _id: mealId, userId });
      if (!meal) {
        throw new Error('Meal not found');
      }

      meal.foods = meal.foods.filter(food => food.foodId.toString() !== foodId);
      await meal.save();

      return meal;
    } catch (error) {
      throw error;
    }
  }

  static async getDailyNutrients(userId, date) {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const meals = await Meal.find({
        userId,
        date: {
          $gte: startOfDay,
          $lte: endOfDay
        }
      });

      return meals.reduce((totals, meal) => {
        const mealNutrients = meal.totalNutrients;
        return {
          energy: totals.energy + mealNutrients.energy.value,
          protein: totals.protein + mealNutrients.protein.value,
          carbohydrate: totals.carbohydrate + mealNutrients.carbohydrate.value,
          fat: totals.fat + mealNutrients.fat.value
        };
      }, { energy: 0, protein: 0, carbohydrate: 0, fat: 0 });
    } catch (error) {
      throw new Error(`Error calculating daily nutrients: ${error.message}`);
    }
  }

  static calculateTotalNutrients(foods, mealFoods) {
    const totalNutrients = {
      energy: { value: 0, unit: 'kcal' },
      protein: { value: 0, unit: 'g' },
      fat: { value: 0, unit: 'g' },
      carbohydrate: { value: 0, unit: 'g' },
      fiber: { value: 0, unit: 'g' }
    };

    mealFoods.forEach(mealFood => {
      const food = foods.find(f => f._id.toString() === mealFood.foodId.toString());
      if (food) {
        const multiplier = mealFood.quantity / 100; // Convert to percentage of 100g
        
        Object.keys(totalNutrients).forEach(nutrient => {
          if (food.nutrients[nutrient]) {
            totalNutrients[nutrient].value += food.nutrients[nutrient].value * multiplier;
          }
        });
      }
    });

    // Round all values to 1 decimal place
    Object.keys(totalNutrients).forEach(nutrient => {
      totalNutrients[nutrient].value = Math.round(totalNutrients[nutrient].value * 10) / 10;
    });

    return totalNutrients;
  }
}

export default MealService;
