import { Food } from '~/server/models/Food'

export default defineEventHandler(async (event) => {
  try {
    const totalFoods = await Food.countDocuments()
    const categories = await Food.distinct('category')
    const totalCategories = categories.length

    // Calculate average calories
    const foods = await Food.find({}, 'nutrients.energy.value')
    const totalCalories = foods.reduce((sum, food) => sum + (food.nutrients.energy.value || 0), 0)
    const averageCalories = totalCalories / totalFoods

    return {
      totalFoods,
      totalCategories,
      averageCalories: Math.round(averageCalories),
      categories
    }
  } catch (error) {
    console.error('Error fetching food stats:', error)
    throw createError({
      statusCode: 500,
      message: 'Error fetching food statistics'
    })
  }
})
