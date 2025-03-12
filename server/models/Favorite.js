import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  foodId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Food',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Bir kullanıcı aynı yiyeceği birden fazla kez favoriye ekleyemesin
favoriteSchema.index({ userId: 1, foodId: 1 }, { unique: true });

export const Favorite = mongoose.model('Favorite', favoriteSchema);
