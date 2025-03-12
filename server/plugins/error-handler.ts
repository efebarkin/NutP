import { defineNitroPlugin } from 'nitropack/runtime/plugin'
import { createError } from 'h3'

export default defineNitroPlugin((nitroApp) => {
  // Global error handler
  nitroApp.hooks.hook('error', (error) => {
    console.error('Nitro error:', error)

    // Eğer hata zaten formatlanmışsa, olduğu gibi kullan
    if (error.statusCode) {
      return error
    }

    // Diğer hataları formatla
    return createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: process.env.NODE_ENV === 'development' 
        ? error.message 
        : 'An unexpected error occurred'
    })
  })
})
