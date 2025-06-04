import { z } from 'zod';

// ObjectId validasyonu - Mongoose otomatik oluşturduğu için daha esnek
const objectIdSchema = z
  .string({
    required_error: 'ID gereklidir',
  })
  .min(1, 'ID boş olamaz')
  .trim();

// Miktar şeması (besin miktarları için)
const quantitySchema = z.object({
  value: z
    .number({
      required_error: 'Miktar değeri gereklidir',
    })
    .min(0.1, 'Miktar en az 0.1 olmalıdır')
    .max(10000, 'Miktar çok büyük'),
  unit: z
    .string({
      required_error: 'Birim gereklidir',
    })
    .min(1, 'Birim belirtilmelidir')
    .default('g'),
});

// Besin öğesi şeması (öğündeki besinler için)
const foodItemSchema = z.object({
  foodId: objectIdSchema,
  quantity: quantitySchema,
});

// Besin değerleri şeması (hesaplanan toplam değerler)
const totalNutrientsSchema = z.object({
  calories: z.number().min(0).default(0),
  protein: z.number().min(0).default(0),
  carbohydrate: z.number().min(0).default(0),
  fat: z.number().min(0).default(0),
});

// Öğün türü enum'ı
const mealTypeEnum = ['breakfast', 'lunch', 'dinner', 'snack'];

// Temel öğün şeması
const mealBaseSchema = z.object({
  name: z
    .string({
      required_error: 'Öğün adı gereklidir',
    })
    .min(2, 'Öğün adı en az 2 karakter olmalıdır')
    .max(100, 'Öğün adı en fazla 100 karakter olabilir')
    .trim(),
  date: z
    .date({
      required_error: 'Tarih gereklidir',
    })
    .or(
      z.string().refine(
        (val) => !isNaN(Date.parse(val)),
        'Geçerli bir tarih formatı giriniz'
      ).transform((val) => new Date(val))
    ),
  type: z.enum(mealTypeEnum, {
    errorMap: () => ({ 
      message: `Öğün türü şunlardan biri olmalıdır: ${mealTypeEnum.join(', ')}` 
    }),
  }),
  foods: z
    .array(foodItemSchema, {
      required_error: 'En az bir besin eklemelisiniz',
    })
    .min(1, 'En az bir besin eklemelisiniz')
    .max(50, 'En fazla 50 besin ekleyebilirsiniz'),
  notes: z
    .string()
    .max(500, 'Notlar en fazla 500 karakter olabilir')
    .optional(),
  tags: z
    .array(z.string().min(1).max(30))
    .max(10, 'En fazla 10 etiket ekleyebilirsiniz')
    .optional(),
  photoUrl: z
    .string()
    .url('Geçerli bir URL giriniz')
    .optional(),
});

// Öğün oluşturma şeması
export const createMealSchema = mealBaseSchema.extend({
  userId: objectIdSchema,
});

// Öğün güncelleme şeması (tüm alanlar opsiyonel, userId hariç)
export const updateMealSchema = mealBaseSchema.partial().extend({
  // totalNutrients otomatik hesaplandığı için güncelleme şemasına dahil edilmez
  totalNutrients: totalNutrientsSchema.optional(),
});

// Öğün ID validasyonu
export const mealIdSchema = objectIdSchema;

// Kullanıcı ID validasyonu
export const userIdSchema = objectIdSchema;

// Öğün sorgulama şeması (filtreleme için)
export const mealQuerySchema = z.object({
  userId: objectIdSchema.optional(),
  type: z.enum(mealTypeEnum).optional(),
  date: z.object({
    start: z
      .date()
      .or(
        z.string().refine(
          (val) => !isNaN(Date.parse(val)),
          'Geçerli bir başlangıç tarihi formatı giriniz'
        ).transform((val) => new Date(val))
      )
      .optional(),
    end: z
      .date()
      .or(
        z.string().refine(
          (val) => !isNaN(Date.parse(val)),
          'Geçerli bir bitiş tarihi formatı giriniz'
        ).transform((val) => new Date(val))
      )
      .optional(),
  }).optional(),
  tags: z.array(z.string()).optional(),
  limit: z
    .number()
    .int()
    .min(1, 'Limit en az 1 olmalıdır')
    .max(100, 'Limit en fazla 100 olabilir')
    .default(20)
    .optional(),
  page: z
    .number()
    .int()
    .min(1, 'Sayfa numarası en az 1 olmalıdır')
    .default(1)
    .optional(),
}).refine(
  (data) => {
    if (data.date?.start && data.date?.end) {
      return data.date.start <= data.date.end;
    }
    return true;
  },
  {
    message: 'Başlangıç tarihi bitiş tarihinden küçük olmalıdır',
    path: ['date.start'],
  }
);

// Toplu öğün işlemleri için şema
export const bulkMealOperationSchema = z.object({
  mealIds: z
    .array(objectIdSchema)
    .min(1, 'En az bir öğün ID\'si gereklidir')
    .max(50, 'En fazla 50 öğün işlenebilir'),
  operation: z.enum(['delete', 'archive'], {
    errorMap: () => ({ message: 'Geçerli bir işlem türü seçiniz' }),
  }),
});

// Validasyon yardımcı fonksiyonları
export const validateMealId = (id) => {
  try {
    return { success: true, data: mealIdSchema.parse(id) };
  } catch (error) {
    return { success: false, error: error.format() };
  }
};

export const validateUserId = (id) => {
  try {
    return { success: true, data: userIdSchema.parse(id) };
  } catch (error) {
    return { success: false, error: error.format() };
  }
};

export const validateCreateMeal = (data) => {
  try {
    return { success: true, data: createMealSchema.parse(data) };
  } catch (error) {
    return { success: false, error: error.format() };
  }
};

export const validateUpdateMeal = (data) => {
  try {
    return { success: true, data: updateMealSchema.parse(data) };
  } catch (error) {
    return { success: false, error: error.format() };
  }
};

export const validateMealQuery = (data) => {
  try {
    return { success: true, data: mealQuerySchema.parse(data) };
  } catch (error) {
    return { success: false, error: error.format() };
  }
};

export const validateBulkMealOperation = (data) => {
  try {
    return { success: true, data: bulkMealOperationSchema.parse(data) };
  } catch (error) {
    return { success: false, error: error.format() };
  }
};

// Özel validasyon fonksiyonları
export const validateMealFoods = (foods) => {
  try {
    const validatedFoods = z.array(foodItemSchema).parse(foods);
    
    // Aynı besin birden fazla kez eklenmişse kontrol et
    const foodIds = validatedFoods.map(food => food.foodId);
    const uniqueFoodIds = new Set(foodIds);
    
    if (foodIds.length !== uniqueFoodIds.size) {
      return { 
        success: false, 
        error: { message: 'Aynı besin birden fazla kez eklenemez' } 
      };
    }
    
    return { success: true, data: validatedFoods };
  } catch (error) {
    return { success: false, error: error.format() };
  }
};

export const validateMealDate = (date) => {
  try {
    const parsedDate = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(parsedDate.getTime())) {
      return { success: false, error: { message: 'Geçersiz tarih formatı' } };
    }
    
    // Gelecek tarih kontrolü (isteğe bağlı)
    const now = new Date();
    const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    if (parsedDate > oneWeekFromNow) {
      return { 
        success: false, 
        error: { message: 'Öğün tarihi en fazla 1 hafta ileride olabilir' } 
      };
    }
    
    return { success: true, data: parsedDate };
  } catch (error) {
    return { success: false, error: { message: 'Tarih validasyon hatası' } };
  }
};

// Besin değerleri hesaplama validasyonu
export const validateTotalNutrients = (nutrients) => {
  try {
    return { success: true, data: totalNutrientsSchema.parse(nutrients) };
  } catch (error) {
    return { success: false, error: error.format() };
  }
};