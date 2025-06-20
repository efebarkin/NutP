import { Meal } from '../models/Meal';
import { Food } from '../models/Food';
import User from '../models/User.js';
import createError from 'http-errors';
import { ErrorTypes } from '~/server/utils/error';
import { readBody, getQuery } from 'h3';
import mealPhotoService from './mealPhotoService';
import {
  validateCreateMeal,
  validateUpdateMeal,
  validateMealId,
} from '../validations/mealValidation';

class MealService {
  async createMeal(event) {
    try {
      // Auth middleware garantisi ile user her zaman mevcut
      const user = event.context.auth.user;

      // Request body'den verileri al
      const body = await readBody(event);
      console.log(
        '[MealService] Received body for createMeal:',
        JSON.stringify(body, null, 2),
      );

      // userId'yi body'ye ekle
      const dataToValidate = {
        ...body,
        userId: user._id.toString(), // user._id'yi string'e çevir
      };
      console.log(
        '[MealService] Data to validate for createMeal:',
        JSON.stringify(dataToValidate, null, 2),
      );

      // Zod ile validasyon yap
      const validation = validateCreateMeal(dataToValidate);
      if (!validation.success) {
        console.error(
          '[MealService] Zod validation failed:',
          JSON.stringify(validation.error.flatten(), null, 2),
        );
        const formattedErrors = validation.error.flatten();

        // İlk alan hatasını veya genel bir mesajı al
        const firstFieldErrorMessage = Object.values(
          formattedErrors.fieldErrors,
        )[0]?.[0];
        const firstFormErrorMessage = formattedErrors.formErrors[0];

        let errorMessage = 'Geçersiz veri formatı.';
        if (firstFieldErrorMessage) {
          errorMessage = firstFieldErrorMessage;
        } else if (firstFormErrorMessage) {
          errorMessage = firstFormErrorMessage;
        } else if (
          validation.error.issues &&
          validation.error.issues.length > 0
        ) {
          errorMessage = validation.error.issues
            .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
            .join('; ');
        }

        throw createError({
          statusCode: 400,
          message: errorMessage,
          data: formattedErrors,
        });
      }

      const validatedData = validation.data;

      // Foods array'indeki her besin için veritabanında varlığını kontrol et
      const foodPromises = validatedData.foods.map(async (food) => {
        const existingFood = await Food.findById(food.foodId);
        if (!existingFood) {
          throw createError({
            statusCode: 404,
            message: `${food.foodId} ID'li besin bulunamadı`,
          });
        }
        return food;
      });

      // Tüm food promise'larını çözümle
      const validatedFoods = await Promise.all(foodPromises);

      // Yeni meal oluştur
      const meal = new Meal({
        userId: user._id, // Auth'dan gelen user ID
        name: validatedData.name,
        type: validatedData.type,
        date: validatedData.date,
        foods: validatedFoods,
        notes: validatedData.notes,
        tags: validatedData.tags,
        photoUrl: validatedData.photoUrl,
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
      const user = event.context.auth.user;

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
      // Auth middleware garantisi ile user her zaman mevcut
      const user = event.context.auth.user;

      const mealId = event.context.params.id;
      const updateData = await readBody(event);

      // Meal ID validasyonu
      const mealIdValidation = validateMealId(mealId);
      if (!mealIdValidation.success) {
        throw createError({
          statusCode: 400,
          message: 'Geçersiz öğün ID formatı',
        });
      }

      // Update data validasyonu
      const validation = validateUpdateMeal(updateData);
      if (!validation.success) {
        const firstError =
          Object.values(validation.error._errors || {})[0]?.[0] ||
          validation.error.message ||
          'Geçersiz güncelleme verisi';
        throw createError({
          statusCode: 400,
          message: firstError,
        });
      }

      const validatedData = validation.data;

      // Eğer foods array güncelleniyorsa, besinlerin veritabanında var olduğunu kontrol et
      if (validatedData.foods && Array.isArray(validatedData.foods)) {
        const foodPromises = validatedData.foods.map(async (food) => {
          const existingFood = await Food.findById(food.foodId);
          if (!existingFood) {
            throw createError({
              statusCode: 404,
              message: `${food.foodId} ID'li besin bulunamadı`,
            });
          }
          return food;
        });
        await Promise.all(foodPromises);
      }

      // totalNutrients'i updateData'dan çıkar - pre-save hook hesaplayacak
      const { totalNutrients, ...safeUpdateData } = validatedData;

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
      // Auth middleware garantisi ile user her zaman mevcut
      const user = event.context.auth.user;

      const mealId = event.context.params.id;

      // Meal ID validasyonu
      const mealIdValidation = validateMealId(mealId);
      if (!mealIdValidation.success) {
        throw createError({
          statusCode: 400,
          message: 'Geçersiz öğün ID formatı',
        });
      }

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
      // Auth middleware garantisi ile user her zaman mevcut
      const user = event.context.auth.user;

      const mealId = event.context.params.id;

      // Meal ID validasyonu
      const mealIdValidation = validateMealId(mealId);
      if (!mealIdValidation.success) {
        throw createError({
          statusCode: 400,
          message: 'Geçersiz öğün ID formatı',
        });
      }

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
      // Auth middleware garantisi ile user her zaman mevcut
      const user = event.context.auth.user;

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

  /**
   * Kullanıcının belirli bir gündeki tüm öğün kayıtlarını getirir ve toplar.
   * @param {object} event - H3 event objesi
   * @returns {Promise<object>} - Günlük öğün özeti ve kayıtlar listesi
   */
  async getDailyMealEntries(event) {
    try {
      // Auth middleware garantisi ile user her zaman mevcut
      const user = event.context.auth.user;

      // Kullanıcının günlük kalori hedefini getir
      const userProfile = await User.findById(user._id || user.id).select(
        'dailyCalorieGoal',
      );
      const userCalorieGoal = userProfile?.dailyCalorieGoal || 2000;

      // Tarih parametresini al (query parameter'dan)
      const date = getQuery(event)?.date;
      const timezone = getQuery(event)?.timezone || 'UTC';

      if (!date) {
        throw createError({
          statusCode: 400,
          message:
            'Tarih parametresi gerekli. YYYY-MM-DD formatında gönderiniz.',
        });
      }

      // Tarih formatını valide et
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(date)) {
        throw createError({
          statusCode: 400,
          message: 'Geçersiz tarih formatı. YYYY-MM-DD formatında gönderiniz.',
        });
      }

      // Kullanıcının lokal timezone'ına göre günün başlangıç ve bitiş tarihlerini oluştur
      // T00:00:00 ile T23:59:59.999 arasındaki tüm kayıtları al (timezone suffix olmadan)
      const startOfDay = new Date(date + 'T00:00:00');
      const endOfDay = new Date(date + 'T23:59:59.999');

      // Belirtilen tarih aralığındaki öğün kayıtlarını getir
      const mealEntries = await Meal.find({
        userId: user._id,
        date: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      })
        .select('+photoUrl')
        .populate({
          path: 'foods.foodId',
          model: 'Food',
          select: 'name nutrients category',
        })
        .sort({ date: 1 })
        .lean();

      // Toplam besin değerlerini hesapla
      const totalNutrients = {
        calories: 0,
        protein: 0,
        carbohydrate: 0,
        fat: 0,
      };

      let totalMeals = mealEntries.length;
      const mealsByType = {};

      mealEntries.forEach((meal) => {
        // Öğün tipine göre grupla
        if (!mealsByType[meal.type]) {
          mealsByType[meal.type] = [];
        }
        mealsByType[meal.type].push(meal);

        // Toplam besin değerlerini ekle
        if (meal.totalNutrients) {
          totalNutrients.calories += meal.totalNutrients.calories || 0;
          totalNutrients.protein += meal.totalNutrients.protein || 0;
          totalNutrients.carbohydrate += meal.totalNutrients.carbohydrate || 0;
          totalNutrients.fat += meal.totalNutrients.fat || 0;
        }
      });

      // Günlük hedeflerle karşılaştırma (kalori hedefi kullanıcı bazlı, diğerleri standart)
      const dailyGoals = {
        calories: userCalorieGoal,
        protein: 150,
        carbohydrate: 250,
        fat: 67,
      };

      // İlerleme yüzdelerini hesapla
      const progressPercentages = {
        calories: Math.min(
          Math.round((totalNutrients.calories / dailyGoals.calories) * 100),
          100,
        ),
        protein: Math.min(
          Math.round((totalNutrients.protein / dailyGoals.protein) * 100),
          100,
        ),
        carbohydrate: Math.min(
          Math.round(
            (totalNutrients.carbohydrate / dailyGoals.carbohydrate) * 100,
          ),
          100,
        ),
        fat: Math.min(
          Math.round((totalNutrients.fat / dailyGoals.fat) * 100),
          100,
        ),
      };

      // Hedeflere ulaşıp ulaşmadığını kontrol et
      const goalsReached = {
        calories: totalNutrients.calories >= dailyGoals.calories,
        protein: totalNutrients.protein >= dailyGoals.protein,
        carbohydrate: totalNutrients.carbohydrate >= dailyGoals.carbohydrate,
        fat: totalNutrients.fat >= dailyGoals.fat,
      };

      const overallProgress = Math.round(
        (progressPercentages.calories +
          progressPercentages.protein +
          progressPercentages.carbohydrate +
          progressPercentages.fat) /
          4,
      );

      return {
        date: date,
        summary: {
          totalMeals: totalMeals,
          totalNutrients: {
            calories: Math.round(totalNutrients.calories),
            protein: Math.round(totalNutrients.protein * 10) / 10,
            carbohydrate: Math.round(totalNutrients.carbohydrate * 10) / 10,
            fat: Math.round(totalNutrients.fat * 10) / 10,
          },
          dailyGoals,
          progressPercentages,
          goalsReached,
          overallProgress,
          mealsByType: Object.keys(mealsByType).map((type) => ({
            type,
            count: mealsByType[type].length,
            meals: mealsByType[type],
          })),
        },
        entries: mealEntries,
        dateRange: {
          startOfDay: startOfDay.toISOString(),
          endOfDay: endOfDay.toISOString(),
        },
      };
    } catch (error) {
      console.error('Error getting daily meal entries:', error);
      if (error.statusCode === 400) throw error;
      throw createError({
        statusCode: error.statusCode || 500,
        message:
          error.message ||
          'Günlük öğün kayıtları getirilirken bir hata oluştu.',
      });
    }
  }

  /**
   * Kullanıcının belirli bir tarih aralığındaki günlük öğün özetlerini getirir.
   * Takvim görünümü için kullanılır.
   * @param {object} event - H3 event objesi
   * @returns {Promise<object>} - Tarih aralığındaki günlük öğün özetleri
   */
  async getMealEntriesByDateRange(event) {
    try {
      // Auth middleware garantisi ile user her zaman mevcut
      const user = event.context.auth.user;

      // Kullanıcının günlük kalori hedefini getir
      const userProfile = await User.findById(user._id || user.id).select(
        'dailyCalorieGoal',
      );
      const userCalorieGoal = userProfile?.dailyCalorieGoal || 2000;

      // Tarih aralığı parametrelerini al
      const { startDate, endDate, timezone } = getQuery(event);

      if (!startDate || !endDate) {
        throw createError({
          statusCode: 400,
          message:
            'Başlangıç ve bitiş tarihleri gerekli. YYYY-MM-DD formatında gönderiniz.',
        });
      }

      // Basit tarih format validasyonu
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
        throw createError({
          statusCode: 400,
          message: 'Geçersiz tarih formatı. YYYY-MM-DD formatında gönderiniz.',
        });
      }

      // Kullanıcının lokal timezone'ına göre tarih aralığının başlangıç ve bitiş tarihlerini oluştur
      // T00:00:00 ile T23:59:59.999 arasındaki tüm kayıtları al (timezone suffix olmadan)
      const startOfRange = new Date(startDate + 'T00:00:00');
      const endOfRange = new Date(endDate + 'T23:59:59.999');

      // Belirtilen tarih aralığındaki tüm öğün kayıtlarını getir
      const mealEntries = await Meal.find({
        userId: user._id,
        date: {
          $gte: startOfRange,
          $lte: endOfRange,
        },
      })
        .select('+photoUrl')
        .populate({
          path: 'foods.foodId',
          model: 'Food',
          select: 'name nutrients category',
        })
        .sort({ date: 1 })
        .lean();

      // Günlük özetleri oluştur
      const dailySummaries = {};

      // Önce tüm günleri başlat
      const currentDate = new Date(startOfRange);
      while (currentDate <= endOfRange) {
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const dateKey = `${year}-${month}-${day}`;

        dailySummaries[dateKey] = {
          date: dateKey,
          totalMeals: 0,
          totalCalories: 0,
          totalProtein: 0,
          totalCarbohydrate: 0,
          totalFat: 0,
          dailyGoalCalories: userCalorieGoal,
          progressPercentage: 0,
          isGoalReached: false,
          mealsByType: {},
          entries: [],
        };
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Öğün kayıtlarını günlere göre grupla ve hesapla
      mealEntries.forEach((meal) => {
        const mealDate = new Date(meal.date);
        const year = mealDate.getFullYear();
        const month = String(mealDate.getMonth() + 1).padStart(2, '0');
        const day = String(mealDate.getDate()).padStart(2, '0');
        const mealDateKey = `${year}-${month}-${day}`;

        if (dailySummaries[mealDateKey]) {
          const summary = dailySummaries[mealDateKey];

          // Öğün sayısını artır
          summary.totalMeals += 1;

          // Besin değerlerini ekle
          if (meal.totalNutrients) {
            summary.totalCalories += meal.totalNutrients.calories || 0;
            summary.totalProtein += meal.totalNutrients.protein || 0;
            summary.totalCarbohydrate += meal.totalNutrients.carbohydrate || 0;
            summary.totalFat += meal.totalNutrients.fat || 0;
          }

          // Öğün tipine göre grupla
          if (!summary.mealsByType[meal.type]) {
            summary.mealsByType[meal.type] = 0;
          }
          summary.mealsByType[meal.type] += 1;

          // İlerleme yüzdesini ve hedef durumunu güncelle
          summary.progressPercentage = Math.min(
            Math.round(
              (summary.totalCalories / summary.dailyGoalCalories) * 100,
            ),
            100,
          );
          summary.isGoalReached =
            summary.totalCalories >= summary.dailyGoalCalories;
          summary.entries.push(meal);
        }
      });

      // Genel istatistikler
      const totalDays = Object.keys(dailySummaries).length;
      const daysWithMeals = Object.values(dailySummaries).filter(
        (day) => day.totalMeals > 0,
      ).length;
      const daysGoalReached = Object.values(dailySummaries).filter(
        (day) => day.isGoalReached,
      ).length;
      const totalCaloriesInRange = Object.values(dailySummaries).reduce(
        (sum, day) => sum + day.totalCalories,
        0,
      );
      const averageDailyCalories =
        totalDays > 0 ? Math.round(totalCaloriesInRange / totalDays) : 0;

      return {
        dateRange: {
          startDate: startDate,
          endDate: endDate,
          totalDays,
        },
        summary: {
          daysWithMeals,
          daysGoalReached,
          totalCaloriesInRange: Math.round(totalCaloriesInRange),
          averageDailyCalories: averageDailyCalories,
          goalCompletionRate:
            totalDays > 0 ? Math.round((daysGoalReached / totalDays) * 100) : 0,
        },
        dailySummaries: Object.values(dailySummaries).sort((a, b) =>
          a.date.localeCompare(b.date),
        ),
      };
    } catch (error) {
      console.error('Error getting meal entries by date range:', error);
      if (error.statusCode === 400) throw error;
      throw createError({
        statusCode: error.statusCode || 500,
        message:
          error.message ||
          'Tarih aralığı öğün kayıtları getirilirken bir hata oluştu.',
      });
    }
  }
}

const mealService = new MealService();

export default mealService;
