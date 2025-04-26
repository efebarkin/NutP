import { z } from 'zod';

//Temel Schemalar
const emailSchema = z
  .string({
    required_error: 'Email adresi gereklidir',
  })
  .min(1, 'Email adresi gereklidir')
  .email('Geçerli bir email adresi giriniz')
  .max(100, 'Email adresi çok uzun');

const passwordSchema = z
  .string({
    required_error: 'Şifre gereklidir',
  })
  .min(8, 'Şifre en az 8 karakter olmalıdır')
  .max(50, 'Şifre en fazla 50 karakter olabilir')
  .regex(/[a-z]/, 'Şifre en az bir küçük harf içermelidir')
  .regex(/[A-Z]/, 'Şifre en az bir büyük harf içermelidir')
  .regex(/\d/, 'Şifre en az bir rakam içermelidir')
  .regex(/[@$!%*?&]/, 'Şifre en az bir özel karakter (@$!%*?&) içermelidir');

const nameSchema = z
  .string({
    required_error: 'İsim gereklidir',
  })
  .min(2, 'İsim en az 2 karakter olmalıdır')
  .max(50, 'İsim en fazla 50 karakter olabilir')
  .regex(
    /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/,
    'İsim sadece harf ve boşluk içerebilir'
  );

// Login validation schema
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

// Register validation schema
export const registerSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    passwordConfirm: passwordSchema,
  })
  .refine(data => data.password === data.passwordConfirm, {
    message: 'Şifreler eşleşmiyor',
    path: ['passwordConfirm'],
  });

// Profile update validation schema
export const profileUpdateSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    currentPassword: passwordSchema,
    newPassword: passwordSchema,
    newPasswordConfirm: passwordSchema,
  })
  .refine(
    data => {
      if (data.newPassword) {
        return data.newPassword === data.newPasswordConfirm;
      }
      return true;
    },
    {
      message: 'Şifreler eşleşmiyor',
      path: ['newPasswordConfirm'],
    }
  );
