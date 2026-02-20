"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useApiClient } from "@/lib/api/api-client-client";
import type {
  LoginData,
  RegisterData,
  ForgotPasswordData,
  ResetPasswordData,
  AuthResponse,
  AuthUser,
  LockScreenData,
} from './types';
import { UnauthorizedError, ValidationError } from "@/lib/api/api-errors";

export const authKeys = {
  all: ["auth"] as const,
  user: () => [...authKeys.all, "user"] as const,
};

export function useAuthSession() {
  const session = useSession();
  return session;
}

export function useAuth() {
  const { api, sessionStatus } = useApiClient();

  return useQuery({
    queryKey: authKeys.user(),
    queryFn: async () => {
      const response = await api.get<AuthUser>("/auth/me");

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to fetch user");
      }

      return response.data;
    },
    enabled: sessionStatus === "authenticated",
    retry: (failureCount, error: any) => {
      if (error?.status === 401) return false;
      return failureCount < 2;
    },
  });
}

export function useLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { api } = useApiClient();

  const raw = searchParams.get("callbackUrl") ?? "/dashboard";
  const callbackUrl = raw.startsWith("/") ? raw : "/dashboard";

  return useMutation({
    mutationFn: async (credentials: LoginData) => {
      const response = await api.post<AuthResponse>(
        "/auth/login",
        credentials,
        { skipAuth: true }
      );

      if (!response.success || !response.data) {
        throw new Error(response.message);
      }

      const result = await signIn("credentials", {
        identifier: credentials.identifier,
        password: credentials.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      return response.data;
    },
    onSuccess: () => {
      router.push(callbackUrl);
      router.refresh();
    },
    onError: (error) => {
      if (error instanceof ValidationError) {
        throw error;
      }
    },
  });
}

/**
 * useRegister
 *
 * Mutation hook to handle new user registration.
 *
 * Process:
 * 1. Creates a new account via the API.
 * 2. Automatically logs the user in via NextAuth upon success.
 * 3. Redirects to the dashboard.
 *
 * @returns {UseMutationResult} TanStack Mutation result.
 */
export function useRegister() {
  const router = useRouter();
  const { api } = useApiClient();

  return useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await api.post<AuthResponse>(
        "/auth/register",
        data,
        { skipAuth: true }
      );

      if (!response.success || !response.data) {
        if (response.errors) {
          throw new ValidationError(response.message, response.errors);
        }
        throw new Error(response.message);
      }

      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      return response.data;
    },
    onSuccess: () => {
      router.push("/dashboard");
      router.refresh();
    },
  });
}

/**
 * useUnlock
 *
 * Mutation hook to verify a user's password while keeping the session active (Lock Screen).
 *
 * Behavior:
 * - Validates the password against the API.
 * - Redirects to login (full logout) if verification fails with a 401.
 *
 * @returns {UseMutationResult} TanStack Mutation result.
 */
export function useUnlock() {
  const router = useRouter();
  const { api } = useApiClient();

  return useMutation({
    mutationFn: async (credentials: LockScreenData) => {
      const response = await api.post<null>(
        "/auth/unlock",
        { password: credentials.password },
        { skipAuth: false }
      );

      if (!response.success) {
        throw new Error(response.message || "Unlock failed");
      }

      return response.data;
    },

    onSuccess: () => {
      router.refresh();
    },

    onError: (error) => {
      if (error instanceof UnauthorizedError) {
        router.push("/login");
        router.refresh();
      }
    },
  });
}

/**
 * useLogout
 *
 * Mutation hook to log the user out.
 *
 * Process:
 * 1. Signs out via NextAuth.
 * 2. Clears the React Query client cache to remove sensitive data.
 * 3. Redirects to the login page.
 *
 * @returns {UseMutationResult} TanStack Mutation result.
 */
export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { api } = useApiClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.post<null>(
        "/auth/logout",
        {},
        { skipAuth: false }
      );

      if (!response.success) {
        throw new Error(response.message || "Logout failed");
      }
      await signOut({ redirect: false });
    },
    onSuccess: () => {
      queryClient.clear();
      router.push("/login");
      router.refresh();
    },
  });
}

/**
 * useForgotPassword
 *
 * Mutation hook to initiate the password recovery process.
 * Sends a reset link to the user's email.
 *
 * @returns {UseMutationResult} TanStack Mutation result.
 */
export function useForgotPassword() {
  const { api } = useApiClient();

  return useMutation({
    mutationFn: async (data: ForgotPasswordData) => {
      const response = await api.post(
        "/auth/forgot-password",
        data,
        { skipAuth: true }
      );

      if (!response.success) {
        if (response.errors) {
          throw new ValidationError(response.message, response.errors);
        }
        throw new Error(response.message);
      }

      return response;
    },
  });
}

/**
 * useResetPassword
 *
 * Mutation hook to complete the password reset process using a token.
 * Redirects the user to the login page upon success.
 *
 * @returns {UseMutationResult} TanStack Mutation result.
 */
export function useResetPassword() {
  const router = useRouter();
  const { api } = useApiClient();

  return useMutation({
    mutationFn: async (data: ResetPasswordData) => {
      const response = await api.post(
        "/auth/reset-password",
        data,
        { skipAuth: true }
      );

      if (!response.success) {
        if (response.errors) {
          throw new ValidationError(response.message, response.errors);
        }
        throw new Error(response.message);
      }

      return response;
    },
    onSuccess: () => {
      router.push("/login");
    },
  });
}

/**
 * useVerifyEmail
 *
 * Mutation hook to verify a user's email address using a verification token.
 *
 * @returns {UseMutationResult} TanStack Mutation result.
 */
export function useVerifyEmail() {
  const { api } = useApiClient();

  return useMutation({
    mutationFn: async (token: string) => {
      const response = await api.post(
        "/auth/verify-email",
        { token },
        { skipAuth: true }
      );

      if (!response.success) {
        throw new Error(response.message);
      }

      return response;
    },
  });
}

/**
 * useResendVerification
 *
 * Mutation hook to resend the email verification link to the currently logged-in user.
 *
 * @returns {UseMutationResult} TanStack Mutation result.
 */
export function useResendVerification() {
  const { api } = useApiClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.post(
        "/auth/resend-verification",
        {},
        { skipAuth: false }
      );

      if (!response.success) {
        throw new Error(response.message);
      }

      return response;
    },
  });
}