import { z } from 'zod';

// Email validation với các quy tắc nghiêm ngặt
export const emailSchema = z.string()
  .email('Email không hợp lệ')
  .min(5, 'Email quá ngắn')
  .max(100, 'Email quá dài')
  .regex(/^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Định dạng email không đúng')
  .transform(email => email.toLowerCase().trim());

// Name validation
export const nameSchema = z.string()
  .min(2, 'Tên phải có ít nhất 2 ký tự')
  .max(100, 'Tên quá dài')
  .regex(/^[a-zA-ZÀ-ỹ\s]+$/, 'Tên chỉ được chứa chữ cái và khoảng trắng')
  .transform(name => name.trim());

// Payment method validation
export const paymentMethodSchema = z.enum(['momo', 'vnpay', 'bank', 'stripe'], {
  errorMap: () => ({ message: 'Phương thức thanh toán không hợp lệ' })
});

// Purchase request schema
export const purchaseSchema = z.object({
  email: emailSchema,
  name: nameSchema,
  paymentMethod: paymentMethodSchema
});

// License key validation
export const licenseKeySchema = z.string()
  .regex(/^ADBLOCK-PRO-[A-Z0-9]+-[A-Z0-9]+$/, 'License key không hợp lệ');

// Validate license request
export const validateLicenseSchema = z.object({
  licenseKey: licenseKeySchema,
  email: emailSchema
});

// Type exports
export type PurchaseRequest = z.infer<typeof purchaseSchema>;
export type ValidateLicenseRequest = z.infer<typeof validateLicenseSchema>;
