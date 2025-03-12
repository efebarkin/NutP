import { defineEventHandler, getQuery, readBody, createError } from 'h3'
import { User } from '../models/User.js'
import Food from '../models/Food.js';
import { defineAuthenticatedHandler } from '../middleware/auth.js'

// Get user's favorite foods
export const GET = defineAuthenticatedHandler(async (event) => {
  try {
    // event.context.user direkt olarak mongoose dökümanı
    const userId = event.context.user._id
    const user = await User.findById(userId).populate('favoriteFoods')
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
export const POST = defineAuthenticatedHandler(async (event) => {
  try {
    const { foodId } = await readBody(event)
    const userId = event.context.user._id
    const user = await User.findById(userId)
    
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
    if (error.statusCode) {
      throw error // Eğer zaten bir HTTP hatası ise direkt ilet
    }
    throw createError({
      statusCode: 500,
      message: 'Besin favorilere eklenirken bir hata oluştu'
    })
  }
})

// Remove food from favorites
export const DELETE = defineAuthenticatedHandler(async (event) => {
  try {
    const { foodId } = getQuery(event)
    const userId = event.context.user._id
    const user = await User.findById(userId)
    
    // Check if food exists in favorites
    if (!user.favoriteFoods.includes(foodId)) {
      throw createError({
        statusCode: 404,
        message: 'Bu besin favorilerinizde bulunamadı'
      })
    }
    
    user.favoriteFoods = user.favoriteFoods.filter(id => id.toString() !== foodId)
    await user.save()
    
    return { message: 'Besin favorilerden kaldırıldı' }
  } catch (error) {
    console.error('Error removing from favorites:', error)
    if (error.statusCode) {
      throw error // Eğer zaten bir HTTP hatası ise direkt ilet
    }
    throw createError({
      statusCode: 500,
      message: 'Besin favorilerden kaldırılırken bir hata oluştu'
    })
  }
})
