/**
 * Authentication Types
 *
 * Type definitions for authentication-related data structures, including
 * user profiles, API responses, and form payloads for login, registration,
 * and password recovery flows.
 *
 * @module features/auth/types
 */

/**
 * Represents the authenticated user profile returned by the API.
 */
export interface AuthUser {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    user_permissions: string[];
  }
  
  /**
   * The payload returned upon successful login or registration.
   * Contains the user profile and the API access token.
   */
  export interface AuthResponse {
    user: AuthUser;
    token: string;
  }
  
  /**
   * Payload required for user authentication.
   * Supports login via email or username (`identifier`).
   */
  export interface LoginData {
    identifier: string;
    password: string;
  }
  
  /**
   * Payload required for registering a new user account.
   */
  export interface RegisterData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }
  
  /**
   * Payload for initiating the password recovery process.
   */
  export interface ForgotPasswordData {
    email: string;
  }
  
  /**
   * Payload for completing the password reset process using a token.
   */
  export interface ResetPasswordData {
    email: string;
    token: string;
    password: string;
    password_confirmation: string;
  }

  /**
   * Payload required for unlocking the screen.
   */
  export interface LockScreenData {
    password: string;
  }