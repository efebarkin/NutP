import { z } from 'zod';

// Updated objectIdSchema for more specific MongoDB ObjectId validation
const objectIdSchema = z
  .string({
    required_error: 'ID gereklidir',
    invalid_type_error: 'ID string olmalıdır',
  })
  .regex(
    /^[0-9a-fA-F]{24}$/,
    'Geçersiz ID formatı. 24 karakterlik hexadecimal bir değer olmalıdır.',
  )
  .trim();

// Updated amountSchema to align with the Water model
const amountSchema = z.object({
  value: z
    .number({
      required_error: 'Miktar değeri gereklidir',
      invalid_type_error: 'Miktar sayı olmalıdır',
    })
    .min(1, 'Miktar en az 1 olmalıdır') // Aligned with model: min: [1, ...]
    .max(10000, 'Miktar en fazla 10000 olmalıdır'), // Aligned with model
  unit: z
    .enum(['ml', 'l', 'bardak'], {
      required_error: 'Birim gereklidir',
      invalid_type_error:
        "Geçersiz birim. Sadece 'ml', 'l', veya 'bardak' kabul edilir.",
    })
    .default('ml'), // Model also has default 'ml'
});

// Schema for consumedAt, expecting an ISO string, converting to Date, and validating
const consumedAtSchema = z
  .string({
    invalid_type_error: 'Tüketim tarihi string formatında olmalıdır.',
  })
  .datetime({
    message:
      'Geçersiz tarih formatı. ISO 8601 formatında (YYYY-MM-DDTHH:mm:ss.sssZ) olmalıdır.',
  })
  .transform((dateString) => new Date(dateString))
  .refine((date) => !isNaN(date.getTime()), {
    // Ensure the date string was valid and parsed correctly
    message: 'Geçersiz tarih değeri.',
  })
  .refine((date) => date <= new Date(), {
    message: 'Tüketim tarihi gelecekte olamaz.',
  })
  .optional(); // Optional because the model has a default value (Date.now)

// Schema for creating a new water entry
export const createWaterValidationSchema = z.object({
  userId: objectIdSchema, // Assuming userId is passed and needs validation
  amount: amountSchema,
  consumedAt: consumedAtSchema,
});

// Schema for updating an existing water entry
export const updateWaterValidationSchema = z
  .object({
    amount: amountSchema.optional(),
    consumedAt: consumedAtSchema, // Keep optional, as it might not always be updated
  })
  .partial() // Makes all fields in the object optional
  .strip(); // Removes any unrecognized fields during validation

// Export for validating a water record's ID (e.g., in URL parameters)
export const validateWaterId = objectIdSchema;

// Example of how to validate a specific field if needed elsewhere
export const validateAmount = amountSchema;
export const validateConsumedAt = consumedAtSchema;

// Schema for validating a date string in YYYY-MM-DD format
export const dateStringYYYYMMDDSchema = z
  .string({
    required_error: 'Tarih gereklidir.',
    invalid_type_error: 'Tarih string formatında olmalıdır.',
  })
  .regex(
    /^\d{4}-\d{2}-\d{2}$/,
    'Geçersiz tarih formatı. YYYY-MM-DD şeklinde olmalıdır.',
  )
  .refine(
    (dateStr) => {
      const parts = dateStr.split('-');
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10); // Month is 1-12
      const day = parseInt(parts[2], 10); // Day is 1-31

      // Basic checks for year, month, day ranges
      if (
        year < 1900 ||
        year > 2100 ||
        month === 0 ||
        month > 12 ||
        day === 0 ||
        day > 31
      ) {
        return false;
      }
      // More accurate check by creating a date and seeing if it matches
      // JavaScript's Date constructor month is 0-indexed (0 for January, 11 for December)
      const d = new Date(year, month - 1, day);
      return (
        d.getFullYear() === year &&
        d.getMonth() + 1 === month &&
        d.getDate() === day
      );
    },
    {
      message:
        'Geçersiz tarih. Lütfen geçerli bir gün girin (örn: 2023-12-31).',
    },
  );
