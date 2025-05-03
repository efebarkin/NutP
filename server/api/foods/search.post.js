import { readBody, createError } from 'h3';
import { Food } from '~/server/models/Food';
import { defineAuthenticatedHandler } from '~/server/utils/auth';

export default defineAuthenticatedHandler(async (event) => {
  try {
    const body = await readBody(event);
    
    if (!body.query) {
      throw createError({
        statusCode: 400,
        message: 'Arama terimi gerekli'
      });
    }

    const foods = await Food.find({
      $or: [
        { 'name.tr': { $regex: body.query, $options: 'i' } },
        { name: { $regex: body.query, $options: 'i' } }
      ]
    }).limit(10);

    return { foods };
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Server error'
    });
  }
});
