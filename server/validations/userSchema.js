import { z } from 'zod';

// Login validation schema
export const loginSchema = z.object({
  email: z.string()
    .min(1, 'Email adresi gereklidir')
    .email('Geçerli bir email adresi giriniz'),
  password: z.string()
    .min(1, 'Şifre gereklidir')
    .min(6, 'Şifre en az 6 karakter olmalıdır')
});

// Register validation schema
export const registerSchema = z.object({
  name: z.string()
    .min(1, 'İsim gereklidir')
    .min(2, 'İsim en az 2 karakter olmalıdır')
    .max(50, 'İsim en fazla 50 karakter olabilir')
    .regex(/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/, 'İsim sadece harf içerebilir'),
  email: z.string()
    .min(1, 'Email adresi gereklidir')
    .email('Geçerli bir email adresi giriniz')
    .max(100, 'Email adresi çok uzun'),
  password: z.string()
    .min(1, 'Şifre gereklidir')
    .min(6, 'Şifre en az 6 karakter olmalıdır')
    .max(50, 'Şifre en fazla 50 karakter olabilir')
    .regex(/[A-Z]/, 'Şifre en az bir büyük harf içermelidir')
    .regex(/[a-z]/, 'Şifre en az bir küçük harf içermelidir')
    .regex(/[0-9]/, 'Şifre en az bir rakam içermelidir'),
  passwordConfirm: z.string()
    .min(1, 'Şifre tekrarı gereklidir')
}).refine((data) => data.password === data.passwordConfirm, {
  message: 'Şifreler eşleşmiyor',
  path: ['passwordConfirm']
});

// Profile update validation schema
export const profileUpdateSchema = z.object({
  name: z.string()
    .min(2, 'İsim en az 2 karakter olmalıdır')
    .max(50, 'İsim en fazla 50 karakter olabilir')
    .regex(/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/, 'İsim sadece harf içerebilir')
    .optional(),
  email: z.string()
    .email('Geçerli bir email adresi giriniz')
    .max(100, 'Email adresi çok uzun')
    .optional(),
  currentPassword: z.string()
    .min(6, 'Şifre en az 6 karakter olmalıdır')
    .optional(),
  newPassword: z.string()
    .min(6, 'Şifre en az 6 karakter olmalıdır')
    .max(50, 'Şifre en fazla 50 karakter olabilir')
    .regex(/[A-Z]/, 'Şifre en az bir büyük harf içermelidir')
    .regex(/[a-z]/, 'Şifre en az bir küçük harf içermelidir')
    .regex(/[0-9]/, 'Şifre en az bir rakam içermelidir')
    .optional(),
  newPasswordConfirm: z.string()
    .optional()
}).refine((data) => {
  if (data.newPassword) {
    return data.newPassword === data.newPasswordConfirm;
  }
  return true;
}, {
  message: 'Şifreler eşleşmiyor',
  path: ['newPasswordConfirm']
});
