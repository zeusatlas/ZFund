import { z } from 'zod';

const emailField = z.string().email('Invalid email address').toLowerCase();
const phoneField = z
  .string()
  .regex(/^[+]?[0-9 ()-]{9,}$/, 'Valid phone number is required');

export const requestOtpSchema = z.object({
  email: emailField,
  phone: phoneField,
});

export const verifyOtpSchema = z.object({
  email: emailField,
  phone: phoneField,
  code: z.string().regex(/^\d{6}$/, 'Enter the 6-digit code'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().optional(),
});

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export type RequestOtpInput = z.infer<typeof requestOtpSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
