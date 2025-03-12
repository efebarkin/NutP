import { defineEventHandler, readBody, createError } from 'h3';
import { User } from '~/server/models/User';
import { getServerSession } from '~/server/utils/auth';

export default defineEventHandler(async (event) => {
  try {
    // Cookie-based authentication
    const session = await getServerSession(event);
    if (!session?.user?.id) {
      throw createError({
        statusCode: 401,
        message: 'Bu işlem için giriş yapmanız gerekiyor'
      });
    }

    const { foodId } = await readBody(event);
    if (!foodId) {
      throw createError({
        statusCode: 400,
        message: 'Besin ID\'si gerekli'
      });
    }

    // Check if food is already in favorites
    const user = await User.findById(session.user.id);
    if (!user) {
      throw createError({
        statusCode: 404,
        message: 'Kullanıcı bulunamadı'
      });
    }

    if (user.favoriteFoods.includes(foodId)) {
      return {
        success: true,
        message: 'Bu besin zaten favorilerinizde',
        alreadyExists: true
      };
    }

    // Add to favorites
    user.favoriteFoods.push(foodId);
    await user.save();

    return {
      success: true,
      message: 'Besin favorilere eklendi',
      data: {
        userId: user._id,
        foodId
      }
    };
  } catch (error) {
    console.error('Add to favorites error:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Besin favorilere eklenirken bir hata oluştu'
    });
  }
});
