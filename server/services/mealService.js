import { Meal } from '../models/Meal';
import { Food } from '../models/Food';
import createError from 'http-errors';
import { getServerSession } from '~/server/utils/auth';
import { ErrorTypes } from '~/server/utils/error';
import { readBody } from 'h3';

class MealService {
  async createMeal(event) {
    try {
      // Request body'den verileri al
      const body = await readBody(event);
      
      // Gerekli alanları kontrol et
      if (!body.name || !body.type || !body.date || !Array.isArray(body.foods) || body.foods.length === 0) {
        throw createError({
          statusCode: 400,
          message: 'Eksik bilgi: name, type, date ve en az bir besin gerekli'
        });
      }
  
      // Foods array'indeki her öğeyi kontrol et
      const foodPromises = body.foods.map(async (food) => {
        if (!food.foodId || !food.quantity) {
          throw createError({
            statusCode: 400,
            message: 'Her besin için foodId ve quantity gerekli'
          });
        }
  
        // Food'un veritabanında var olduğunu kontrol et
        const existingFood = await Food.findById(food.foodId);
        if (!existingFood) {
          throw createError({
            statusCode: 404,
            message: `${food.foodId} ID'li besin bulunamadı`
          });
        }
  
        return {
          foodId: food.foodId,
          quantity: {
            value: parseInt(food.quantity),
            unit: 'g'
          }
        };
      });
  
      // Tüm food promise'larını çözümle
      const validatedFoods = await Promise.all(foodPromises);
  
      // Yeni meal oluştur
      const meal = new Meal({
        userId: event.context.auth.user._id, // _id yerine id kullanıyoruz
        name: body.name,
        type: body.type,
        date: new Date(body.date),
        foods: validatedFoods
      });
  
      // Meal'i kaydet
      await meal.save();
  
      return {
        success: true,
        message: 'Öğün başarıyla oluşturuldu',
        meal: meal
      };
    } catch (error) {
      console.error('Error creating meal:', error);
      throw createError({
        statusCode: error.statusCode || 500,
        message: error.message || 'Öğün oluşturulurken bir hata oluştu'
      });
    }
  }

  async getUserMeals(event) {
    try {
      // Find meals and populate food details
      const meals = await Meal.find({ userId: event.context.auth.user._id })
        .populate({
          path: 'foods.foodId',
          model: 'Food',
          select: 'name nutrients category portionSize servingSize image'
        })
        .sort({ date: -1 });
  
      return { meals };
    } catch (error) {
      throw createError({
        statusCode: error.statusCode || 500,
        message: error.message || 'Öğünler getirilirken bir hata oluştu'
      });
    }
  }

  async updateMeal(event) {
    try {
      const session = await getServerSession(event);
      const user = session.user;
      const mealId = event.context.params.id;
      const updateData = await readBody(event);
  
      // Find and update meal
      const meal = await Meal.findOneAndUpdate(
        {
          _id: mealId,
          userId: user._id
        },
        { $set: updateData },
        { new: true }
      ).populate('foods.food');
  
      if (!meal) {
        throw createError({
          statusCode: 404,
          message: 'Öğün bulunamadı'
        });
      }
  
      return { meal };
    } catch (error) {
      throw createError({
        statusCode: error.statusCode || 500,
        message: error.message || 'Öğün güncellenirken bir hata oluştu'
      });
    }
  }

  async deleteMeal(event) {
    try {
      const session = await getServerSession(event);
      const user = session.user;
      const mealId = event.context.params.id;
  
      // Find and delete meal
      const meal = await Meal.findOneAndDelete({
        _id: mealId,
        userId: user._id // id yerine _id kullanıyoruz
      });
  
      if (!meal) {
        throw createError({
          statusCode: 404,
          message: ErrorTypes.MEAL_NOT_FOUND
        });
      }
  
      return {
        success: true,
        message: 'Öğün başarıyla silindi'
      };
    } catch (error) {
      throw createError({
        statusCode: error.statusCode || 500,
        message: error.message || ErrorTypes.INTERNAL_SERVER_ERROR
      });
    }
  }

  async getMealById(event) {
    try {
      const session = await getServerSession(event);
      const user = session.user;
      const mealId = event.context.params.id;
  
      // Find meal
      const meal = await Meal.findOne({
        _id: mealId,
        userId: user._id
      }).populate('foods.food');
  
      if (!meal) {
        throw createError({
          statusCode: 404,
          message: 'Öğün bulunamadı'
        });
      }
  
      return { meal };
    } catch (error) {
      throw createError({
        statusCode: error.statusCode || 500,
        message: error.message || ErrorTypes.INTERNAL_SERVER_ERROR
      });
    }
  }

  async getRecentMeals(event){
    try {
      // Kullanıcı oturumunu kontrol et
      const session = await getServerSession(event);
      if (!session) {
        throw createError({
          statusCode: 401,
          message: 'Unauthorized'
        });
      }
  
      // Son 5 öğünü getir
      const meals = await Meal.find({ userId: session.user._id }) // id yerine _id kullanıyoruz
        .sort({ date: -1 })
        .limit(5)
        .populate({
          path: 'foods.foodId',
          model: 'Food',
          select: 'name category nutrients calories protein carbs fat'
        });
  
      // Veriyi istemcinin beklediği formata dönüştür
      const formattedMeals = meals.map(meal => ({
        _id: meal._id,
        userId: meal.userId,
        date: meal.date,
        mealType: meal.type,
        foods: meal.foods.map(food => ({
          _id: food._id,
          food: {
            _id: food.foodId._id,
            name: {
              tr: food.foodId.name?.tr || food.foodId.name || ''
            },
            category: food.foodId.category || {},
            nutrients: {
              energy: {
                value: food.foodId.calories || food.foodId.nutrients?.energy?.value || 0,
                unit: 'kcal'
              },
              protein: {
                value: food.foodId.protein || food.foodId.nutrients?.protein?.value || 0,
                unit: 'g'
              },
              carbohydrates: {
                value: food.foodId.carbs || food.foodId.nutrients?.carbohydrates?.value || 0,
                unit: 'g'
              },
              fat: {
                value: food.foodId.fat || food.foodId.nutrients?.fat?.value || 0,
                unit: 'g'
              }
            }
          },
          quantity: food.quantity
        })),
        totalNutrients: meal.totalNutrients,
        notes: meal.notes,
        tags: meal.tags,
        createdAt: meal.createdAt,
        updatedAt: meal.updatedAt
      }));
  
      return formattedMeals;
    } catch (error) {
      console.error('Get recent meals error:', error);
      throw createError({
        statusCode: 500,
        message: 'Error getting recent meals'
      });
    }
  }
    
}

const mealService = new MealService();

export default mealService;
