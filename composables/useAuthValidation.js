import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';

// Base Zod schemas (reusable) - Modül seviyesinde güvenli şekilde tanımla
const nameValidation = z
  .string({
    required_error: 'İsim gereklidir.',
    invalid_type_error: 'İsim bir metin olmalıdır.',
  })
  .min(2, { message: 'İsim en az 2 karakter olmalıdır.' })
  .max(50, { message: 'İsim en fazla 50 karakter olabilir.' })
  .regex(/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]*$/, {
    message: 'İsim sadece harf ve boşluk içerebilir.',
  });

const emailValidation = z
  .string({
    required_error: 'Email gereklidir.',
  })
  .email({ message: 'Geçerli bir email adresi giriniz.' });

const passwordValidation = z
  .string({
    required_error: 'Şifre gereklidir.',
  })
  .min(8, { message: 'Şifre en az 8 karakter olmalıdır.' })
  .regex(/[A-Z]/, {
    message: 'Şifre en az bir büyük harf içermelidir.',
  })
  .regex(/[a-z]/, {
    message: 'Şifre en az bir küçük harf içermelidir.',
  })
  .regex(/[0-9]/, { message: 'Şifre en az bir rakam içermelidir.' })
  .regex(/[@$!%*?&]/, {
    message: 'Şifre en az bir özel karakter içermelidir (@$!%*?&).',
  });

// Login schema
const loginSchemaRaw = z.object({
  email: emailValidation,
  password: passwordValidation,
});

// Register schema
const registerSchemaRaw = z
  .object({
    name: nameValidation,
    email: emailValidation,
    password: passwordValidation,
    passwordConfirm: z.string({
      required_error: 'Şifre onayı gereklidir.',
    }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Şifreler eşleşmiyor.',
    path: ['passwordConfirm'],
  });

// VeeValidate için Typed Schemas - Lazy initialization için fonksiyon içinde oluştur
let _loginSchema = null;
let _registerSchema = null;
let _emailSchema = null;
let _passwordSchema = null;
let _nameSchema = null;

// Composable for auth validation
export function useAuthValidation() {
  // Lazy initialization - İlk çağrıda şemaları oluştur
  if (!_loginSchema) {
    try {
      _loginSchema = toTypedSchema(loginSchemaRaw);
      _registerSchema = toTypedSchema(registerSchemaRaw);
      _emailSchema = toTypedSchema(emailValidation);
      _passwordSchema = toTypedSchema(passwordValidation);
      _nameSchema = toTypedSchema(nameValidation);
    } catch (error) {
      console.error('[useAuthValidation] Şema oluşturulurken hata:', error);
      throw new Error(`Validasyon şemaları oluşturulamadı: ${error.message}`);
    }
  }

  return {
    loginSchema: _loginSchema,
    registerSchema: _registerSchema,
    emailSchema: _emailSchema,
    passwordSchema: _passwordSchema,
    nameSchema: _nameSchema,
    // Ham şemaları da export et (ihtiyaç durumunda)
    rawSchemas: {
      loginSchemaRaw,
      registerSchemaRaw,
      emailValidation,
      passwordValidation,
      nameValidation,
    },
  };
}
