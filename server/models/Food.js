import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema(
  {
    name: {
      tr: { type: String, required: true },
      en: { type: String, required: true },
    },
    photoUrl: { type: String },
    nutrients: {
      energy: {
        value: { type: Number, default: 0 },
        unit: { type: String, default: 'KCAL' },
      },
      protein: {
        value: { type: Number, default: 0 },
        unit: { type: String, default: 'G' },
      },
      fat: {
        value: { type: Number, default: 0 },
        unit: { type: String, default: 'G' },
      },
      carbohydrate: {
        value: { type: Number, default: 0 },
        unit: { type: String, default: 'G' },
      },
      fiber: {
        value: { type: Number, default: 0 },
        unit: { type: String, default: 'G' },
      },
      sugar: {
        value: { type: Number, default: 0 },
        unit: { type: String, default: 'G' },
      },
      cholesterol: {
        value: { type: Number, default: 0 },
        unit: { type: String, default: 'MG' },
      },
      saturatedFat: {
        value: { type: Number, default: 0 },
        unit: { type: String, default: 'G' },
      },
      monounsaturatedFat: {
        value: { type: Number, default: 0 },
        unit: { type: String, default: 'G' },
      },
      polyunsaturatedFat: {
        value: { type: Number, default: 0 },
        unit: { type: String, default: 'G' },
      },
      transFat: {
        value: { type: Number, default: 0 },
        unit: { type: String, default: 'G' },
      },
      omega3: {
        value: { type: Number, default: 0 },
        unit: { type: String, default: 'G' },
      },
      omega6: {
        value: { type: Number, default: 0 },
        unit: { type: String, default: 'G' },
      },
      calcium: {
        value: { type: Number, default: 0 },
        unit: { type: String, default: 'MG' },
      },
      iron: {
        value: { type: Number, default: 0 },
        unit: { type: String, default: 'MG' },
      },
      magnesium: {
        value: { type: Number, default: 0 },
        unit: { type: String, default: 'MG' },
      },
      phosphorus: {
        value: { type: Number, default: 0 },
        unit: { type: String, default: 'MG' },
      },
      potassium: {
        value: { type: Number, default: 0 },
        unit: { type: String, default: 'MG' },
      },
      sodium: {
        value: { type: Number, default: 0 },
        unit: { type: String, default: 'MG' },
      },
      zinc: {
        value: { type: Number, default: 0 },
        unit: { type: String, default: 'MG' },
      },
      copper: {
        value: { type: Number, default: 0 },
        unit: { type: String, default: 'MG' },
      },
      manganese: {
        value: { type: Number, default: 0 },
        unit: { type: String, default: 'MG' },
      },
      selenium: {
        value: { type: Number, default: 0 },
        unit: { type: String, default: 'UG' },
      },
      vitaminA: {
        value: { type: Number, default: 0 },
        unit: { type: String, default: 'UG' },
      },
      vitaminE: {
        value: { type: Number, default: 0 },
        unit: { type: String, default: 'MG' },
      },
      vitaminD: {
        value: { type: Number, default: 0 },
        unit: { type: String, default: 'UG' },
      },
      vitaminC: {
        value: { type: Number, default: 0 },
        unit: { type: String, default: 'MG' },
      },
      thiamin: {
        value: { type: Number, default: 0 },
        unit: { type: String, default: 'MG' },
      },
      riboflavin: {
        value: { type: Number, default: 0 },
        unit: { type: String, default: 'MG' },
      },
      niacin: {
        value: { type: Number, default: 0 },
        unit: { type: String, default: 'MG' },
      },
      vitaminB6: {
        value: { type: Number, default: 0 },
        unit: { type: String, default: 'MG' },
      },
      folate: {
        value: { type: Number, default: 0 },
        unit: { type: String, default: 'UG' },
      },
      vitaminB12: {
        value: { type: Number, default: 0 },
        unit: { type: String, default: 'UG' },
      },
      caffeine: {
        value: { type: Number, default: 0 },
        unit: { type: String, default: 'MG' },
      },
      alcohol: {
        value: { type: Number, default: 0 },
        unit: { type: String, default: 'G' },
      },
      water: {
        value: { type: Number, default: 0 },
        unit: { type: String, default: 'G' },
      },
    },
    category: { type: String, required: true },
    source: { type: String, required: true },
    portions: [
      {
        name: { type: String, required: true },
        weight: { type: Number, required: true },
        isDefault: { type: Boolean, default: false },
      },
    ],
    metadata: {
      fdcId: { type: String },
      isVerified: { type: Boolean, default: false },
      addedBy: { type: String, required: true },
      originalCategory: { type: String },
    },
  },
  {
    timestamps: true,
  },
);

// Model zaten varsa kullan, yoksa oluştur
const Food = mongoose.models.Food || mongoose.model('Food', foodSchema);

// Named ve default export
export { Food };
export default Food;
