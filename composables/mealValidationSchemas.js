import { z } from 'zod';

// Öğün türü enum'ı
const mealTypeEnum = ['breakfast', 'lunch', 'dinner', 'snack'];

// Frontend için öğün formu validasyon şeması
export const mealFormSchema = z.object({
  name: z
    .string({
      required_error: 'Öğün adı gereklidir',
    })
    .min(2, 'Öğün adı en az 2 karakter olmalıdır')
    .max(100, 'Öğün adı en fazla 100 karakter olabilir')
    .trim(),

  type: z.enum(mealTypeEnum, {
    errorMap: () => ({
      message: `Öğün türü seçmelisiniz`,
    }),
  }),

  date: z
    .string({
      required_error: 'Tarih gereklidir',
    })
    .refine((val) => {
      if (!val) return false;
      const date = new Date(val);
      return !isNaN(date.getTime());
    }, 'Geçerli bir tarih seçiniz')
    .refine((val) => {
      const selectedDate = new Date(val);
      const now = new Date();
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(now.getFullYear() - 1);
      const oneYearLater = new Date();
      oneYearLater.setFullYear(now.getFullYear() + 1);

      return selectedDate >= oneYearAgo && selectedDate <= oneYearLater;
    }, 'Tarih geçerli bir aralıkta olmalıdır'),
});

// Seçilen besinler validasyon şeması
export const selectedFoodsSchema = z
  .array(
    z.object({
      _id: z.string().min(1, 'Besin ID gereklidir').trim(),
      name: z.union([
        z.string(),
        z.object({
          tr: z.string(),
        }),
      ]),
      quantity: z
        .number({
          required_error: 'Miktar gereklidir',
        })
        .min(1, 'Miktar en az 1 gram olmalıdır')
        .max(10000, 'Miktar çok büyük (max 10kg)'),
      nutrients: z
        .object({
          energy: z
            .object({
              value: z.number().optional(),
            })
            .optional(),
        })
        .optional(),
    }),
    {
      required_error: 'En az bir besin eklemelisiniz',
    },
  )
  .min(1, 'En az bir besin eklemelisiniz')
  .max(50, 'En fazla 50 besin ekleyebilirsiniz');

// Backend format için besin öğesi şeması
export const backendFoodItemSchema = z.object({
  foodId: z.string().min(1, 'Besin ID gereklidir'),
  quantity: z.object({
    value: z
      .number({
        required_error: 'Miktar değeri gereklidir',
      })
      .min(0.1, 'Miktar en az 0.1 olmalıdır')
      .max(10000, 'Miktar çok büyük'),
    unit: z.string().min(1, 'Birim belirtilmelidir').default('g'),
  }),
});

// Backend için öğün şeması
export const backendMealSchema = z.object({
  name: z
    .string({
      required_error: 'Öğün adı gereklidir',
    })
    .min(2, 'Öğün adı en az 2 karakter olmalıdır')
    .max(100, 'Öğün adı en fazla 100 karakter olabilir')
    .trim(),

  type: z.enum(mealTypeEnum, {
    errorMap: () => ({
      message: `Öğün türü seçmelisiniz`,
    }),
  }),

  date: z
    .string({
      required_error: 'Tarih gereklidir',
    })
    .refine((val) => {
      if (!val) return false;
      const date = new Date(val);
      return !isNaN(date.getTime());
    }, 'Geçerli bir tarih seçiniz'),

  foods: z
    .array(backendFoodItemSchema)
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

  photoUrl: z.string().url('Geçerli bir URL giriniz').optional(),
});

// Fotoğraf validasyon şeması
export const photoFileSchema = z
  .instanceof(File)
  .optional()
  .refine((file) => {
    if (!file) return true;
    return file.size <= 5 * 1024 * 1024; // 5MB
  }, "Fotoğraf boyutu 5MB'dan küçük olmalıdır")
  .refine((file) => {
    if (!file) return true;
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    return allowedTypes.includes(file.type);
  }, 'Desteklenen formatlar: JPG, PNG, WEBP');

// Tam öğün validasyon şeması (form + besinler)
export const completeMealSchema = z.object({
  mealForm: mealFormSchema,
  selectedFoods: selectedFoodsSchema,
  photoFile: photoFileSchema,
});

// Besin arama validasyon şeması
export const searchQuerySchema = z
  .string()
  .min(2, 'En az 2 karakter yazınız')
  .max(100, 'Arama terimi çok uzun');

// Besin miktarı validasyon şeması
export const foodQuantitySchema = z
  .number()
  .min(1, 'Miktar en az 1 gram olmalıdır')
  .max(10000, 'Miktar çok büyük');
