import { defineEventHandler, getQuery } from 'h3';
import { Meal } from '~/server/models/Meal';
import { ErrorTypes } from '~/server/utils/error';

export default defineEventHandler(async (event) => {
  try {
    const user = event.context.user;
    if (!user) {
      throw ErrorTypes.UNAUTHORIZED('Kullanıcı bulunamadı');
    }

    // Get query parameters
    const query = getQuery(event);
    const startDate = query.startDate ? new Date(query.startDate) : new Date();
    const endDate = query.endDate ? new Date(query.endDate) : new Date(startDate);
    endDate.setDate(endDate.getDate() + 7); // Default to 7 days if no end date

    // Find all meals for the user within date range
    const meals = await Meal.find({
      userId: user._id,
      date: {
        $gte: startDate,
        $lt: endDate
      }
    }).populate('foods.food').sort({ date: 1 });

    // Group meals by date
    const weeklyPlan = {};
    meals.forEach(meal => {
      const dateStr = meal.date.toISOString().split('T')[0];
      if (!weeklyPlan[dateStr]) {
        weeklyPlan[dateStr] = {
          breakfast: null,
          lunch: null,
          dinner: null,
          snacks: []
        };
      }

      if (meal.type === 'snack') {
        weeklyPlan[dateStr].snacks.push(meal);
      } else {
        weeklyPlan[dateStr][meal.type] = meal;
      }
    });

    return {
      startDate,
      endDate,
      weeklyPlan
    };
  } catch (error) {
    console.error('Get weekly plan error:', error);
    throw error;
  }
});
