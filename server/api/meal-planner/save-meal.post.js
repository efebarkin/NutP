import { defineEventHandler, readBody } from 'h3';
import { ErrorTypes } from '~/server/utils/error';
import { Meal } from '~/server/models/meal';

export default defineEventHandler(async (event) => {
  try {
    const user = event.context.user;
    if (!user) {
      throw ErrorTypes.UNAUTHORIZED('Kullanıcı bulunamadı');
    }

    const { mealId, updates } = await readBody(event);
    if (!mealId || !updates) {
      throw ErrorTypes.BAD_REQUEST('Öğün ID ve güncellemeler gerekli');
    }

    // Find and verify meal ownership
    const meal = await Meal.findOne({
      _id: mealId,
      userId: user._id
    });

    if (!meal) {
      throw ErrorTypes.NOT_FOUND('Öğün bulunamadı');
    }

    // Update meal
    Object.assign(meal, updates);
    await meal.save();

    // Populate food references
    await meal.populate('foods.food');

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
      message: 'Öğün başarıyla güncellendi',
      meal
    };
  } catch (error) {
    console.error('Save meal error:', error);
    throw error;
  }
});
