import { Meal } from '../models/Meal';
import { Food } from '../models/Food';
import createError from 'http-errors';
import { ErrorTypes } from '~/server/utils/error';
import { readBody } from 'h3';
import mealPhotoService from './mealPhotoService'; // Import mealPhotoService

class MealService {
  async createMeal(event) {
    try {
      // Get authenticated user from context (provided by defineAuthenticatedHandler)
      const user = event.context.auth?.user;
      if (!user) {
        throw createError({
          statusCode: 401,
          message: 'Unauthorized',
        });
      }

      // Request body'den verileri al
      const body = await readBody(event);

      // Gerekli alanları kontrol et
      if (
        !body.name ||
        !body.type ||
        !body.date ||
        !Array.isArray(body.foods) ||
        body.foods.length === 0
      ) {
        throw createError({
          statusCode: 400,
          message: 'Eksik bilgi: name, type, date ve en az bir besin gerekli',
        });
      }

      // Foods array'indeki her öğeyi kontrol et
      const foodPromises = body.foods.map(async (food) => {
        if (!food.foodId || !food.quantity) {
          throw createError({
            statusCode: 400,
            message: 'Her besin için foodId ve quantity gerekli',
          });
        }

        // Food'un veritabanında var olduğunu kontrol et
        const existingFood = await Food.findById(food.foodId);
        if (!existingFood) {
          throw createError({
            statusCode: 404,
            message: `${food.foodId} ID'li besin bulunamadı`,
          });
        }

        return {
          foodId: food.foodId,
          quantity: {
            value:
              typeof food.quantity === 'object'
                ? food.quantity.value
                : parseInt(food.quantity),
            unit: typeof food.quantity === 'object' ? food.quantity.unit : 'g',
          },
        };
      });

      // Tüm food promise'larını çözümle
      const validatedFoods = await Promise.all(foodPromises);

      // Yeni meal oluştur
      const meal = new Meal({
        userId: user._id,
        name: body.name,
        type: body.type,
        date: new Date(body.date),
        foods: validatedFoods,
      });

      // Meal'i kaydet
      await meal.save();

      return {
        success: true,
        message: 'Öğün başarıyla oluşturuldu',
        meal: meal,
      };
    } catch (error) {
      console.error('Error creating meal:', error);
      throw createError({
        statusCode: error.statusCode || 500,
        message: error.message || 'Öğün oluşturulurken bir hata oluştu',
      });
    }
  }

  async getUserMeals(event) {
    try {
      // Get authenticated user from context (provided by defineAuthenticatedHandler)
      const user = event.context.auth?.user;
      if (!user) {
        throw createError({
          statusCode: 401,
          message: 'Unauthorized',
        });
      }

      // Find meals and populate food details
      const meals = await Meal.find({ userId: user._id })
        .select('+photoUrl') // Ensure photoUrl is selected
        .populate({
          path: 'foods.foodId',
          model: 'Food',
          select: 'name nutrients category portionSize servingSize image',
        })
        .sort({ date: -1 });

      return { meals };
    } catch (error) {
      throw createError({
        statusCode: error.statusCode || 500,
        message: error.message || 'Öğünler getirilirken bir hata oluştu',
      });
    }
  }

  async updateMeal(event) {
    try {
      const user = event.context.auth?.user;
      if (!user) {
        throw createError({
          statusCode: 401,
          message: 'Unauthorized',
        });
      }
      const mealId = event.context.params.id;
      const updateData = await readBody(event);

      // totalNutrients'i updateData'dan çıkar - pre-save hook hesaplayacak
      const { totalNutrients, ...safeUpdateData } = updateData;

      // Find and update meal
      const meal = await Meal.findOneAndUpdate(
        {
          _id: mealId,
          userId: user._id,
        },
        { $set: safeUpdateData },
        { new: true },
      ).populate('foods.foodId');

      if (!meal) {
        throw createError({
          statusCode: 404,
          message: 'Öğün bulunamadı',
        });
      }

      return { meal };
    } catch (error) {
      throw createError({
        statusCode: error.statusCode || 500,
        message: error.message || 'Öğün güncellenirken bir hata oluştu',
      });
    }
  }

  async deleteMeal(event) {
    try {
      const user = event.context.auth?.user;
      if (!user) {
        throw createError({
          statusCode: 401,
          message: 'Unauthorized',
        });
      }
      const mealId = event.context.params.id;

      // Find the meal to get the photoUrl before deleting
      const mealToDelete = await Meal.findOne({
        _id: mealId,
        userId: user._id,
      }).select('+photoUrl');

      if (!mealToDelete) {
        throw createError({
          statusCode: 404,
          message: ErrorTypes.MEAL_NOT_FOUND,
        });
      }

      console.log('[MealService] Deleting meal:', {
        mealId,
        userId: user._id,
        hasPhoto: !!mealToDelete.photoUrl,
        photoUrl: mealToDelete.photoUrl,
      });

      // If meal has a photo, delete it from S3 BEFORE deleting the meal
      if (mealToDelete.photoUrl) {
        try {
          console.log(
            '[MealService] Attempting to delete photo from S3:',
            mealToDelete.photoUrl,
          );
          const deleteResult = await mealPhotoService.deleteMealPhoto(
            mealToDelete.photoUrl,
          );
          console.log('[MealService] Photo deletion result:', deleteResult);
        } catch (s3Error) {
          // Log the S3 deletion error, but don't fail the whole operation
          console.error(
            '[MealService] Error deleting photo from S3 (continuing with meal deletion):',
            s3Error,
          );
          // You can decide if this should be a critical failure or not
        }
      }

      // Delete meal from database
      const meal = await Meal.findOneAndDelete({
        _id: mealId,
        userId: user._id,
      });

      if (!meal) {
        // Should not happen if mealToDelete was found, but as a safeguard
        throw createError({
          statusCode: 404,
          message: ErrorTypes.MEAL_NOT_FOUND,
        });
      }

      console.log('[MealService] Meal successfully deleted from database');

      return {
        success: true,
        message: 'Öğün başarıyla silindi',
      };
    } catch (error) {
      console.error('[MealService] Error in deleteMeal:', error);
      throw createError({
        statusCode: error.statusCode || 500,
        message: error.message || ErrorTypes.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getMealById(event) {
    try {
      const user = event.context.auth?.user;
      if (!user) {
        throw createError({
          statusCode: 401,
          message: 'Unauthorized',
        });
      }
      const mealId = event.context.params.id;

      // Find meal
      const meal = await Meal.findOne({
        _id: mealId,
        userId: user._id,
      })
        .select('+photoUrl') // Ensure photoUrl is selected
        .populate({ path: 'foods.foodId', model: 'Food' }); // Consistent population with other methods

      if (!meal) {
        throw createError({
          statusCode: 404,
          message: 'Öğün bulunamadı',
        });
      }

      return { meal };
    } catch (error) {
      throw createError({
        statusCode: error.statusCode || 500,
        message: error.message || ErrorTypes.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getRecentMeals(event) {
    try {
      const user = event.context.auth?.user;
      if (!user) {
        throw createError({
          statusCode: 401,
          message: 'Unauthorized',
        });
      }

      const meals = await Meal.find({ userId: user._id })
        .select('+photoUrl') // Ensure photoUrl is selected
        .sort({ date: -1 })
        .limit(5)
        .populate({
          path: 'foods.foodId',
          model: 'Food',
          select: 'name category nutrients calories protein carbs fat',
        });

      const formattedMeals = meals.map((meal) => {
        const mealData = {
          _id: meal._id,
          userId: meal.userId,
          date: meal.date,
          mealType: meal.type,
          photoUrl: meal.photoUrl, // Include photoUrl
          foods: meal.foods.map((foodItem) => {
            if (!foodItem.foodId) {
              return {
                _id: foodItem._id,
                food: null,
                quantity: foodItem.quantity,
              };
            }
            return {
              _id: foodItem._id,
              food: {
                _id: foodItem.foodId._id,
                name: {
                  tr: foodItem.foodId.name?.tr || foodItem.foodId.name || '',
                },
                category: foodItem.foodId.category || {},
                nutrients: {
                  energy: {
                    value:
                      foodItem.foodId.calories ||
                      foodItem.foodId.nutrients?.energy?.value ||
                      0,
                    unit: 'kcal',
                  },
                  protein: {
                    value:
                      foodItem.foodId.protein ||
                      foodItem.foodId.nutrients?.protein?.value ||
                      0,
                    unit: 'g',
                  },
                  carbohydrate: {
                    value:
                      foodItem.foodId.carbs ||
                      foodItem.foodId.nutrients?.carbohydrate?.value ||
                      0,
                    unit: 'g',
                  },
                  fat: {
                    value:
                      foodItem.foodId.fat ||
                      foodItem.foodId.nutrients?.fat?.value ||
                      0,
                    unit: 'g',
                  },
                },
              },
              quantity: foodItem.quantity,
            };
          }),
          totalNutrients: meal.totalNutrients,
          notes: meal.notes,
          tags: meal.tags,
          createdAt: meal.createdAt,
          updatedAt: meal.updatedAt,
        };
        return mealData;
      });

      return formattedMeals;
    } catch (error) {
      console.error('Get recent meals error:', error);
      throw createError({
        statusCode: 500,
        message: 'Error getting recent meals',
      });
    }
  }
}

const mealService = new MealService();

export default mealService;
