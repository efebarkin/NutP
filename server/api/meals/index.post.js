import { defineEventHandler, readBody, createError } from 'h3';
import { Meal } from '~/server/models/Meal';
import { Food } from '~/server/models/Food';
import { defineAuthenticatedHandler } from '~/server/middleware/auth';

export default defineAuthenticatedHandler(async (event) => {
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
      userId: event.context.auth.user._id,
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
});
