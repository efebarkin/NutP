import { defineEventHandler, getQuery, createError } from 'h3';
import Food from '~/server/models/Food';
import { ErrorTypes } from '~/server/utils/error';

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 20;
    const search = query.search || '';
    const category = query.category || '';
    const sortField = query.sortField || 'name.tr';
    const sortOrder = query.sortOrder === 'desc' ? -1 : 1;

    // Build query
    const dbQuery = {};
    if (search) {
      dbQuery['$or'] = [
        { 'name.tr': { $regex: search, $options: 'i' } },
        { 'name.en': { $regex: search, $options: 'i' } }
      ];
    }
    if (category) {
      dbQuery.category = category;
    }

    // Get total count for pagination
    const total = await Food.countDocuments(dbQuery);

    // Get paginated results
    const foods = await Food.find(dbQuery)
      .sort({ [sortField]: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Get category statistics
    const categories = await Food.aggregate([
      { $group: { 
        _id: '$category', 
        count: { $sum: 1 },
        avgCalories: { $avg: '$nutrients.energy.value' },
        avgProtein: { $avg: '$nutrients.protein.value' }
      }},
      { $sort: { count: -1 } }
    ]);

    // Return response
    return {
      foods,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      stats: {
        categories,
        total
      }
    };
  } catch (error) {
    console.error('Error fetching foods:', error);
    throw createError({
      statusCode: 500,
      message: 'Internal server error'
    });
  }
});
