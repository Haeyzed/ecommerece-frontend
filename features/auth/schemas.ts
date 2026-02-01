/**
 * Authentication Schemas
 *
 * Validation schemas and type definitions for authentication-related forms
 * including login, registration, password recovery, and reset.
 * Uses Zod for schema validation and type inference.
 *
 * @module features/auth/schemas
 */

import { z } from "zod";

/**
 * loginSchema
 *
 * Zod schema for validating user login credentials.
 * Requires a non-empty identifier (username or email) and password.
 */
export const loginSchema = z.object({
  identifier: z.string().min(1, "Email or username is required"),
  password: z.string().min(1, "Password is required"),
});

/**
 * registerSchema
 *
 * Zod schema for validating new user registration.
 * Enforces:
 * - Name length (min 2 chars)
 * - Valid email format
 * - Password length (min 8 chars)
 * - Password confirmation matching
 */
export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

/**
 * forgotPasswordSchema
 *
 * Zod schema for the "Forgot Password" request form.
 * Validates that a proper email format is provided.
 */
export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

/**
 * resetPasswordSchema
 *
 * Zod schema for the password reset form.
 * Validates the email, the reset token, and ensures the new password
 * meets security requirements and matches the confirmation.
 */
export const resetPasswordSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    token: z.string().min(1, "Token is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

/**
 * lockScreenSchema
 *
 * Zod schema for validating the lock screen form.
 * Validates that a password is provided.
 */
export const lockScreenSchema = z.object({
  password: z.string().min(1, "Password is required"),
});


/**
 * LoginFormData
 *
 * Type inferred from loginSchema.
 */
export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * RegisterFormData
 *
 * Type inferred from registerSchema.
 */
export type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * ForgotPasswordFormData
 *
 * Type inferred from forgotPasswordSchema.
 */
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

/**
 * ResetPasswordFormData
 *
 * Type inferred from resetPasswordSchema.
 */
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

/**
 * LockScreenFormData
 *
 * Type inferred from lockScreenSchema.
 */
export type LockScreenFormData = z.infer<typeof lockScreenSchema>;