/**
 * Client-side API Client Hook
 *
 * A wrapper hook around the core API client tailored for Client Components.
 * It automatically injects the NextAuth session token into requests,
 * managing authentication state and preventing race conditions during hydration.
 *
 * @module lib/api/api-client-client
 */

import { useSession } from "next-auth/react";
import { api } from "./api-client";
import type { ApiClientOptions, ApiRequestOptions } from "./api-client";
import type { NormalizedApiResponse } from "./api-types";

/**
 * Return type definition for the `useApiClient` hook.
 * Exposes authenticated API methods and the current session loading state.
 */
export interface UseApiClientReturn {
  /**
   * Collection of API methods (GET, POST, PUT, PATCH, DELETE)
   * pre-configured with session authentication.
   */
  api: {
    /**
     * Performs a GET request.
     *
     * @template T - The expected response data type.
     * @param {string} url - The endpoint URL.
     * @param {ApiRequestOptions} [options] - Optional request configuration.
     * @returns {Promise<NormalizedApiResponse<T>>} The API response.
     */
    get: <T>(
      url: string,
      options?: ApiRequestOptions
    ) => Promise<NormalizedApiResponse<T>>;

    /**
     * Performs a POST request.
     *
     * @template T - The expected response data type.
     * @param {string} url - The endpoint URL.
     * @param {unknown} [body] - The payload data (JSON or FormData).
     * @param {ApiClientOptions} [options] - Optional request configuration.
     * @returns {Promise<NormalizedApiResponse<T>>} The API response.
     */
    post: <T>(
      url: string,
      body?: unknown,
      options?: ApiClientOptions
    ) => Promise<NormalizedApiResponse<T>>;

    /**
     * Performs a PUT request.
     *
     * @template T - The expected response data type.
     * @param {string} url - The endpoint URL.
     * @param {unknown} [body] - The payload data.
     * @param {ApiClientOptions} [options] - Optional request configuration.
     * @returns {Promise<NormalizedApiResponse<T>>} The API response.
     */
    put: <T>(
      url: string,
      body?: unknown,
      options?: ApiClientOptions
    ) => Promise<NormalizedApiResponse<T>>;

    /**
     * Performs a PATCH request.
     *
     * @template T - The expected response data type.
     * @param {string} url - The endpoint URL.
     * @param {unknown} [body] - The payload data.
     * @param {ApiClientOptions} [options] - Optional request configuration.
     * @returns {Promise<NormalizedApiResponse<T>>} The API response.
     */
    patch: <T>(
      url: string,
      body?: unknown,
      options?: ApiClientOptions
    ) => Promise<NormalizedApiResponse<T>>;

    /**
     * Performs a DELETE request.
     *
     * @template T - The expected response data type.
     * @param {string} url - The endpoint URL.
     * @param {ApiClientOptions} [options] - Optional request configuration.
     * @returns {Promise<NormalizedApiResponse<T>>} The API response.
     */
    delete: <T>(
      url: string,
      options?: ApiClientOptions
    ) => Promise<NormalizedApiResponse<T>>;
  };

  /**
   * The current authentication status of the NextAuth session.
   *
   * - `loading`: Session is currently being fetched.
   * - `authenticated`: User is logged in and token is available.
   * - `unauthenticated`: User is not logged in.
   */
  sessionStatus: "loading" | "authenticated" | "unauthenticated";
}

/**
 * useApiClient
 *
 * A React hook that provides an authenticated API client instance.
 * It consumes the current NextAuth session to attach the Bearer token
 * to all outgoing requests.
 *
 * Usage:
 * - Must be used within Next.js Client Components.
 * - Automatically handles Authorization headers.
 * - Bypasses internal redirects to allow the UI to handle auth states.
 *
 * @returns {UseApiClientReturn} The authenticated API methods and session status.
 *
 * @example
 * ```ts
 * const { api, sessionStatus } = useApiClient();
 *
 * useEffect(() => {
 * if (sessionStatus === "authenticated") {
 * api.get<User[]>("/users").then(response => setData(response.data));
 * }
 * }, [sessionStatus]);
 * ```
 */
export function useApiClient(): UseApiClientReturn {
  const { data: session, status } = useSession();

  /**
   * Constructs the request headers, injecting the Authorization token
   * if a valid session exists.
   *
   * @returns {HeadersInit} Headers object containing the Bearer token.
   */
  const getHeaders = (): HeadersInit => {
    const headers: HeadersInit = {};
    if (session?.user?.token) {
      headers.Authorization = `Bearer ${session.user.token}`;
    }
    return headers;
  };

  /**
   * Session-aware API method wrappers.
   * Authentication is injected manually here to avoid closure staleness.
   */
  const apiMethods = {
    get: async <T>(
      url: string,
      options?: ApiRequestOptions
    ): Promise<NormalizedApiResponse<T>> => {
      return api.get<T>(url, {
        ...options,
        headers: {
          ...getHeaders(),
          ...options?.headers,
        },
        skipAuth: true,
      });
    },

    post: async <T>(
      url: string,
      body?: unknown,
      options?: ApiClientOptions
    ): Promise<NormalizedApiResponse<T>> => {
      // Preserve automatic Content-Type for FormData, otherwise merge headers
      const headers =
        body instanceof FormData
          ? getHeaders()
          : { ...getHeaders(), ...options?.headers };

      return api.post<T>(url, body, {
        ...options,
        headers,
        skipAuth: true,
      });
    },

    put: async <T>(
      url: string,
      body?: unknown,
      options?: ApiClientOptions
    ): Promise<NormalizedApiResponse<T>> => {
      return api.put<T>(url, body, {
        ...options,
        headers: {
          ...getHeaders(),
          ...options?.headers,
        },
        skipAuth: true,
      });
    },

    patch: async <T>(
      url: string,
      body?: unknown,
      options?: ApiClientOptions
    ): Promise<NormalizedApiResponse<T>> => {
      return api.patch<T>(url, body, {
        ...options,
        headers: {
          ...getHeaders(),
          ...options?.headers,
        },
        skipAuth: true,
      });
    },

    delete: async <T>(
      url: string,
      options?: ApiClientOptions
    ): Promise<NormalizedApiResponse<T>> => {
      return api.delete<T>(url, {
        ...options,
        headers: {
          ...getHeaders(),
          ...options?.headers,
        },
        skipAuth: true,
      });
    },
  };

  return { api: apiMethods, sessionStatus: status };
}