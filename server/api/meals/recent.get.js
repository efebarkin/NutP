import { Meal } from '~/server/models/Meal';
import { getServerSession } from '#auth';

export default defineEventHandler(async (event) => {
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
});
