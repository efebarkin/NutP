import { defineEventHandler, getQuery, createError } from 'h3';
import { Food } from '~/server/models/Food';

export default defineEventHandler(async (event) => {
  try {
    const { q } = getQuery(event);

    if (!q) {
      return {
        foods: []
      };
    }

    // Case-insensitive arama yapalım
    const foods = await Food.find({
      name: { $regex: q, $options: 'i' }
    })
    .select('name calories protein carbs fat')
    .limit(10);

    return {
      foods
    };
  } catch (error) {
    console.error('Food search error:', error);
    throw createError({
      statusCode: 500,
      message: 'Besin arama sırasında bir hata oluştu'
    });
  }
});
