import { defineEventHandler, getQuery, readBody, createError } from 'h3'
import { User } from '../models/User.js'

// Get user's favorite foods
export const GET = defineEventHandler(async (event) => {
  try {
    const user = await User.findById(event.context.user.id).populate('favoriteFoods')
    return user.favoriteFoods
  } catch (error) {
    console.error('Error fetching favorite foods:', error)
    throw createError({
      statusCode: 500,
      message: 'Favori besinler getirilirken bir hata oluştu'
    })
  }
})

// Add food to favorites
export const POST = defineEventHandler(async (event) => {
  try {
    const { foodId } = await readBody(event)
    const user = await User.findById(event.context.user.id)
    
    if (user.favoriteFoods.includes(foodId)) {
      throw createError({
        statusCode: 400,
        message: 'Bu besin zaten favorilerinizde'
      })
    }
    
    user.favoriteFoods.push(foodId)
    await user.save()
    
    return { message: 'Besin favorilere eklendi' }
  } catch (error) {
    console.error('Error adding food to favorites:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Besin favorilere eklenirken bir hata oluştu'
    })
  }
})

// Remove food from favorites
export const DELETE = defineEventHandler(async (event) => {
  try {
    const { foodId } = getQuery(event)
    const user = await User.findById(event.context.user.id)
    
    user.favoriteFoods = user.favoriteFoods.filter(id => id.toString() !== foodId)
    await user.save()
    
    return { message: 'Besin favorilerden kaldırıldı' }
  } catch (error) {
    console.error('Error removing food from favorites:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Besin favorilerden kaldırılırken bir hata oluştu'
    })
  }
})
