'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApiClient } from '@/lib/api/api-client-client';
import { UnauthorizedError, ValidationError } from '@/lib/api/api-errors';
import { toast } from 'sonner';
import type {
  AuthResponse,
  AuthUser,
  ForgotPasswordData,
  LockScreenData,
  LoginData,
  RefreshTokenResponse,
  RegisterData,
  ResetPasswordData,
} from './types';

export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
};

const BASE_PATH = '/auth';

export function useAuthSession() {
  const session = useSession();
  return session;
}

export function useAuth() {
  const { api, sessionStatus } = useApiClient();

  return useQuery({
    queryKey: authKeys.user(),
    queryFn: async () => {
      const response = await api.get<AuthUser>(`${BASE_PATH}/user`);

      if (!response.success || !response.data) {
        throw new Error(response.message ?? 'Failed to fetch user');
      }

      return response.data;
    },
    enabled: sessionStatus === 'authenticated',
    retry: (failureCount, error: unknown) => {
      const err = error as { status?: number } | null;
      if (err?.status === 401) return false;
      return failureCount < 2;
    },
  });
}

export function useLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { api } = useApiClient();

  const raw = searchParams.get('callbackUrl') ?? '/dashboard';
  const callbackUrl = raw.startsWith('/') ? raw : '/dashboard';

  return useMutation({
    mutationFn: async (credentials: LoginData) => {
      const response = await api.post<AuthResponse>(
        `${BASE_PATH}/login`,
        credentials,
        { skipAuth: true }
      );

      if (!response.success || !response.data) {
        throw new Error(response.message);
      }

      const result = await signIn('credentials', {
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

export function useRegister() {
  const router = useRouter();
  const { api } = useApiClient();

  return useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await api.post<AuthResponse>(
        `${BASE_PATH}/register`,
        data,
        { skipAuth: true }
      );

      if (!response.success || !response.data) {
        if (response.errors) throw new ValidationError(response.message, response.errors);
        throw new Error(response.message);
      }

      const result = await signIn('credentials', {
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
      router.push('/dashboard');
      router.refresh();
    },
  });
}

export function useUnlock() {
  const router = useRouter();
  const { api } = useApiClient();

  return useMutation({
    mutationFn: async (credentials: LockScreenData) => {
      const response = await api.post<null>(
        `${BASE_PATH}/unlock`,
        { password: credentials.password },
        { skipAuth: false }
      );

      if (!response.success) {
        throw new Error(response.message ?? 'Unlock failed');
      }

      return response.data;
    },
    onSuccess: () => {
      router.refresh();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Unlock failed');
      if (error instanceof UnauthorizedError) {
        router.push('/login');
        router.refresh();
      }
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { api } = useApiClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.post<null>(
        `${BASE_PATH}/logout`,
        {},
        { skipAuth: false }
      );

      if (!response.success) {
        throw new Error(response.message ?? 'Logout failed');
      }
      await signOut({ redirect: false });
    },
    onSuccess: () => {
      queryClient.clear();
      router.push('/login');
      router.refresh();
    },
  });
}

export function useForgotPassword() {
  const { api } = useApiClient();

  return useMutation({
    mutationFn: async (data: ForgotPasswordData) => {
      const response = await api.post(
        `${BASE_PATH}/forgot-password`,
        data,
        { skipAuth: true }
      );

      if (!response.success) {
        if (response.errors) throw new ValidationError(response.message, response.errors);
        throw new Error(response.message);
      }

      return response;
    },
  });
}

export function useResetPassword() {
  const router = useRouter();
  const { api } = useApiClient();

  return useMutation({
    mutationFn: async (data: ResetPasswordData) => {
      const response = await api.post(
        `${BASE_PATH}/reset-password`,
        data,
        { skipAuth: true }
      );

      if (!response.success) {
        if (response.errors) throw new ValidationError(response.message, response.errors);
        throw new Error(response.message);
      }

      return response;
    },
    onSuccess: () => {
      router.push('/login');
    },
  });
}

export function useVerifyEmail() {
  const { api } = useApiClient();

  return useMutation({
    mutationFn: async (token: string) => {
      const response = await api.post(
        `${BASE_PATH}/verify-email`,
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

export function useResendVerification() {
  const { api } = useApiClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.post(
        `${BASE_PATH}/resend-verification`,
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

export function useRefreshToken() {
  const { api } = useApiClient();
  const { update: updateSession } = useSession();

  return useMutation<RefreshTokenResponse, Error, boolean>({
    mutationFn: async (revokeOldToken = false) => {
      const response = await api.post<RefreshTokenResponse>(
        `${BASE_PATH}/refresh-token`,
        { revoke_old_token: revokeOldToken },
        { skipAuth: false }
      );

      if (!response.success || !response.data) {
        throw new Error(response.message ?? 'Failed to refresh token');
      }

      return response.data;
    },
    onSuccess: async (data) => {
      await updateSession({ user: { token: data.token } });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to refresh token');
    },
  });
}