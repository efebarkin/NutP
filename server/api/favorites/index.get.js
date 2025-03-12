import { User } from '~/server/models/User';
import { createError } from 'h3';
import { getServerSession } from '~/server/utils/auth';

export default defineEventHandler(async (event) => {
  try {
    const session = await getServerSession(event);
    if (!session?.user?.id) {
      throw createError({ 
        statusCode: 401, 
        message: 'Yetkilendirme gerekli' 
      });
    }

    const user = await User.findById(session.user.id)
      .populate({
        path: 'favoriteFoods',
        select: 'name nutrients category portionSize servingSize image',
        populate: {
          path: 'category',
          select: 'name'
        }
      })
      .lean();

    if (!user) {
      throw createError({ 
        statusCode: 404, 
        message: 'Kullanıcı bulunamadı' 
      });
    }

    // Transform the data to ensure all required fields exist
    const favorites = user.favoriteFoods.map(food => ({
      id: food._id,
      name: food.name || { tr: 'İsimsiz', en: 'Unnamed' },
      nutrients: food.nutrients || {
        energy: { value: 0, unit: 'KCAL' },
        protein: { value: 0, unit: 'G' },
        fat: { value: 0, unit: 'G' },
        carbohydrates: { value: 0, unit: 'G' },
        fiber: { value: 0, unit: 'G' },
        sugar: { value: 0, unit: 'G' }
      },
      category: food.category ? {
        id: food.category._id,
        name: food.category.name || { tr: 'Kategorisiz', en: 'Uncategorized' }
      } : null,
      portionSize: food.portionSize || { value: 100, unit: 'G' },
      servingSize: food.servingSize || { value: 100, unit: 'G' },
      image: food.image || null
    }));

    return favorites;
  } catch (error) {
    console.error('Error fetching favorite foods:', error);
    throw createError({ 
      statusCode: error.statusCode || 500,
      message: error.message || 'Favori besinler getirilirken bir hata oluştu'
    });
  }
});
