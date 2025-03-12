import mongoose from 'mongoose';

const mealSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snack'],
    required: true
  },
  foods: [{
    foodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Food',
      required: true
    },
    quantity: {
      value: { type: Number, required: true },
      unit: { type: String, required: true, default: 'g' }
    }
  }],
  notes: String,
  tags: [String],
  totalNutrients: {
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbohydrates: { type: Number, default: 0 },
    fat: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Öğün oluşturulduğunda veya güncellendiğinde besin değerlerini hesapla
mealSchema.pre('save', async function(next) {
  try {
    const Food = mongoose.model('Food');
    let totalNutrients = {
      calories: 0,
      protein: 0,
      carbohydrates: 0,
      fat: 0
    };

    for (const food of this.foods) {
      const foodDoc = await Food.findById(food.foodId);
      if (foodDoc) {
        const multiplier = food.quantity.value / 100; // 100g başına besin değerleri
        totalNutrients.calories += (foodDoc.calories || 0) * multiplier;
        totalNutrients.protein += (foodDoc.protein || 0) * multiplier;
        totalNutrients.carbohydrates += (foodDoc.carbs || 0) * multiplier;
        totalNutrients.fat += (foodDoc.fat || 0) * multiplier;
      }
    }

    this.totalNutrients = totalNutrients;
    next();
  } catch (error) {
    next(error);
  }
});

// Model zaten varsa kullan, yoksa oluştur
export const Meal = mongoose.models.Meal || mongoose.model('Meal', mealSchema);
export default Meal;
