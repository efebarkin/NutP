import { z } from 'zod';

// Besin değerleri için value-unit şeması
const nutrientValueSchema = z.object({
  value: z.number().min(0, 'Değer negatif olamaz'),
  unit: z.string(),
});

// Besin değerleri şeması (Food modeli ile birebir uyumlu)
const nutrientsSchema = z.object({
  energy: nutrientValueSchema.optional(),
  protein: nutrientValueSchema.optional(),
  fat: nutrientValueSchema.optional(),
  carbohydrate: nutrientValueSchema.optional(), // carbohydrate (singular) to match database
  fiber: nutrientValueSchema.optional(),
  sugar: nutrientValueSchema.optional(),
  cholesterol: nutrientValueSchema.optional(),
  saturatedFat: nutrientValueSchema.optional(),
  monounsaturatedFat: nutrientValueSchema.optional(),
  polyunsaturatedFat: nutrientValueSchema.optional(),
  transFat: nutrientValueSchema.optional(),
  omega3: nutrientValueSchema.optional(),
  omega6: nutrientValueSchema.optional(),
  calcium: nutrientValueSchema.optional(),
  iron: nutrientValueSchema.optional(),
  magnesium: nutrientValueSchema.optional(),
  phosphorus: nutrientValueSchema.optional(),
  potassium: nutrientValueSchema.optional(),
  sodium: nutrientValueSchema.optional(),
  zinc: nutrientValueSchema.optional(),
  copper: nutrientValueSchema.optional(),
  manganese: nutrientValueSchema.optional(),
  selenium: nutrientValueSchema.optional(),
  vitaminA: nutrientValueSchema.optional(),
  vitaminE: nutrientValueSchema.optional(),
  vitaminD: nutrientValueSchema.optional(),
  vitaminC: nutrientValueSchema.optional(),
  thiamin: nutrientValueSchema.optional(),
  riboflavin: nutrientValueSchema.optional(),
  niacin: nutrientValueSchema.optional(),
  vitaminB6: nutrientValueSchema.optional(),
  folate: nutrientValueSchema.optional(),
  vitaminB12: nutrientValueSchema.optional(),
  caffeine: nutrientValueSchema.optional(),
  alcohol: nutrientValueSchema.optional(),
  water: nutrientValueSchema.optional(),
});

// Porsiyon şeması
const portionSchema = z.object({
  name: z.string().min(1, 'Porsiyon adı zorunludur'),
  weight: z.number().min(0, 'Ağırlık negatif olamaz'),
  isDefault: z.boolean().default(false),
});

// Metadata şeması
const metadataSchema = z.object({
  fdcId: z.string().optional(),
  isVerified: z.boolean().default(false),
  addedBy: z.string(),
  originalCategory: z.string().optional(),
});

// Temel besin bilgileri şeması
const foodBaseSchema = z.object({
  name: z.object({
    tr: z.string().min(2, 'Türkçe isim en az 2 karakter olmalıdır'),
    en: z.string().min(2, 'İngilizce isim en az 2 karakter olmalıdır'),
  }),
  photoUrl: z.string().optional(),
  category: z.enum(
    ['fruit', 'vegetable', 'meat', 'dairy', 'grain', 'beverage', 'other'],
    {
      errorMap: () => ({ message: 'Geçerli bir kategori seçiniz' }),
    },
  ),
  source: z.string(), // Zorunlu alan
  nutrients: nutrientsSchema,
  portions: z.array(portionSchema).optional(),
  metadata: metadataSchema.optional(),
});

// ID validasyonu
export const foodIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, 'Geçersiz besin ID formatı');

// Besin oluşturma şeması
export const createFoodSchema = foodBaseSchema;

// Besin güncelleme şeması (tüm alanlar opsiyonel)
export const updateFoodSchema = foodBaseSchema.partial();

// Validasyon yardımcı fonksiyonları
export const validateFoodId = (id) => {
  try {
    return { success: true, data: foodIdSchema.parse(id) };
  } catch (error) {
    return { success: false, error: error.format() };
  }
};

export const validateCreateFood = (data) => {
  try {
    return { success: true, data: createFoodSchema.parse(data) };
  } catch (error) {
    return { success: false, error: error.format() };
  }
};

export const validateUpdateFood = (data) => {
  try {
    return { success: true, data: updateFoodSchema.parse(data) };
  } catch (error) {
    return { success: false, error: error.format() };
  }
};
