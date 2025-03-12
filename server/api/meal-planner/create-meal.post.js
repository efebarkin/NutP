import { defineEventHandler, readBody } from 'h3';
import { ErrorTypes } from '~/server/utils/error';
import { Meal } from '~/server/models/meal';

export default defineEventHandler(async (event) => {
  try {
    const user = event.context.user;
    if (!user) {
      throw ErrorTypes.UNAUTHORIZED('Kullanıcı bulunamadı');
    }

    const { name, foods, totalNutrients, notes } = await readBody(event);
    
    if (!name || !foods || !Array.isArray(foods) || foods.length === 0) {
      throw ErrorTypes.BAD_REQUEST('Geçersiz öğün bilgisi');
    }

    // Create new meal
    const newMeal = new Meal({
      userId: user._id,
      name,
      foods: foods.map(item => ({
        food: item.food,
        portion: item.portion
      })),
      totalNutrients,
      notes,
      createdAt: new Date()
    });

    await newMeal.save();
    await newMeal.populate('foods.food');

    // Get current tokens from headers
    const currentAccessToken = event.node.req.headers['authorization']?.replace('Bearer ', '');
    const currentRefreshToken = event.node.req.headers['refresh-token'];

    // Set current tokens in response headers to maintain session
    if (currentAccessToken) {
      event.node.res.setHeader('Access-Token', currentAccessToken);
    }
    if (currentRefreshToken) {
      event.node.res.setHeader('Refresh-Token', currentRefreshToken);
    }

    return {
      success: true,
      message: 'Öğün başarıyla oluşturuldu',
      meal: newMeal
    };
  } catch (error) {
    console.error('Create meal error:', error);
    throw error;
  }
});
