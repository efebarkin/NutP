import mongoose from 'mongoose';

const mealSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    type: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner', 'snack'],
      required: true,
    },
    foods: [
      {
        foodId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Food',
          required: true,
        },
        quantity: {
          value: { type: Number, required: true },
          unit: { type: String, required: true, default: 'g' },
        },
      },
    ],
    notes: String,
    tags: [String],
    photoUrl: { type: String },
    totalNutrients: {
      calories: { type: Number, default: 0 },
      protein: { type: Number, default: 0 },
      carbohydrate: { type: Number, default: 0 },
      fat: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  },
);

// Helper function to calculate total nutrients, callable from multiple hooks
const calculateTotalNutrients = async (foods) => {
  const Food = mongoose.model('Food');
  let newTotalNutrients = {
    calories: 0,
    protein: 0,
    carbohydrate: 0,
    fat: 0,
  };

  if (!Array.isArray(foods)) {
    // Handle cases where foods might not be an array (e.g., if update is malformed)
    // Depending on desired behavior, could log a warning or return default nutrients
    return newTotalNutrients;
  }

  for (const foodItem of foods) {
    // Ensure foodId and quantity are present and valid
    if (
      !foodItem.foodId ||
      !foodItem.quantity ||
      typeof foodItem.quantity.value !== 'number'
    ) {
      // Skip this food item or handle error/warning
      continue;
    }
    const foodDoc = await Food.findById(foodItem.foodId);
    if (foodDoc && foodDoc.nutrients) {
      const multiplier = foodItem.quantity.value / 100; // Assuming nutrients are per 100g
      newTotalNutrients.calories +=
        (foodDoc.nutrients.energy?.value || 0) * multiplier;
      newTotalNutrients.protein +=
        (foodDoc.nutrients.protein?.value || 0) * multiplier;
      newTotalNutrients.carbohydrate +=
        (foodDoc.nutrients.carbohydrate?.value || 0) * multiplier;
      newTotalNutrients.fat += (foodDoc.nutrients.fat?.value || 0) * multiplier;
    }
  }
  return newTotalNutrients;
};

// Öğün oluşturulduğunda veya güncellendiğinde besin değerlerini hesapla (pre-save)
mealSchema.pre('save', async function (next) {
  try {
    this.totalNutrients = await calculateTotalNutrients(this.foods);
    next();
  } catch (error) {
    next(error);
  }
});

// Öğün güncellendiğinde (findOneAndUpdate) besin değerlerini hesapla
mealSchema.pre('findOneAndUpdate', async function (next) {
  try {
    const update = this.getUpdate();
    let foodsToCalculate = null;

    // Check if 'foods' is being directly set or is part of a $set operation
    if (update.foods) {
      foodsToCalculate = update.foods;
    } else if (update.$set && update.$set.foods) {
      foodsToCalculate = update.$set.foods;
    }

    if (foodsToCalculate) {
      const newNutrients = await calculateTotalNutrients(foodsToCalculate);
      this.set({ totalNutrients: newNutrients });
    }
    // Note: This hook is most effective when the client sends the entire 'foods' array
    // for modification. Operations like $push, $pull, $addToSet on 'foods'
    // might require fetching the document first to get the complete 'foods' array
    // for accurate recalculation, which adds complexity here.
    // If such granular updates are common, consider recalculating in the service layer
    // after fetching the updated document.
    next();
  } catch (error) {
    next(error);
  }
});

// Model zaten varsa kullan, yoksa oluştur
export const Meal = mongoose.models.Meal || mongoose.model('Meal', mealSchema);
export default Meal;
