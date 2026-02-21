/**
 * Core API Client
 *
 * A robust, typed HTTP client wrapper for interacting with the Laravel backend.
 *
 * Capabilities:
 * - Compatible with Next.js Server Components, Route Handlers, and Client Components.
 * - Centralizes authentication logic (Bearer token attachment).
 * - Standardizes error handling by mapping HTTP codes to typed exceptions.
 * - Normalizes API responses for consistent consumption.
 *
 * @module lib/api/api-client
 */

import { AUTH_REDIRECT_MESSAGE_KEY } from "@/lib/auth/constants";
import type {
  ApiResponse,
  NormalizedApiResponse,
} from "./api-types";
import {
  UnauthorizedError,
  ValidationError,
  NotFoundError,
  ServerError,
  ForbiddenError,
  ConflictError,
} from "./api-errors";

/**
 * Configuration options for the API client instance.
 * Extends standard `RequestInit` fetch options.
 */
export interface ApiClientOptions extends RequestInit {
  /**
   * If true, prevents the client from automatically attaching the Bearer token.
   * Useful for public endpoints (e.g., login, register).
   */
  skipAuth?: boolean;

  /**
   * Base URL override for a specific request.
   * Defaults to `NEXT_PUBLIC_API_URL` environment variable.
   */
  baseURL?: string;
}

/**
 * Extended options for API requests, including query parameters.
 */
export interface ApiRequestOptions extends ApiClientOptions {
  /**
   * Key-value pairs to be serialized as query parameters in the URL.
   */
  params?: Record<string, string | number | boolean | null | undefined>;
}

/**
 * ApiClient
 *
 * The main class for handling HTTP communication.
 * Manages base URL configuration, token retrieval (server-side),
 * request construction, and response parsing.
 */
class ApiClient {
  /** The base URL for the API. */
  private readonly baseURL: string;

  /**
   * Initializes a new API client.
   *
   * @param baseURL - Optional override for the base URL.
   */
  constructor(baseURL?: string) {
    this.baseURL = baseURL || process.env.NEXT_PUBLIC_API_URL || "";
  }

  /**
   * Retrieves the authentication token from the NextAuth session.
   *
   * Context:
   * - Server-side: Dynamically imports `auth` from NextAuth to get the session.
   * - Client-side: Returns null (client-side auth should use the `useApiClient` hook).
   *
   * @returns {Promise<string | null>} The Bearer token or null.
   */
  private async getAuthToken(): Promise<string | null> {
    // Only works in server context
    if (typeof window === "undefined") {
      try {
        const { auth } = await import("@/auth");
        const session = await auth();
        return (session?.user as { token?: string })?.token || null;
      } catch {
        return null;
      }
    }

    // Client components should use useApiClient hook
    return null;
  }

  /**
   * Constructs the full request URL.
   *
   * @param url - The relative path or full URL.
   * @param params - Optional query parameters to append.
   * @returns {string} The complete URL string.
   */
  private buildURL(
    url: string,
    params?: Record<string, string | number | boolean | null | undefined>
  ): string {
    const base = url.startsWith("http")
      ? url
      : `${this.baseURL}${url.startsWith("/") ? url : `/${url}`}`;

    if (!params || Object.keys(params).length === 0) {
      return base;
    }

    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        searchParams.append(key, String(value));
      }
    });

    const separator = base.includes("?") ? "&" : "?";
    return `${base}${separator}${searchParams.toString()}`;
  }

  /**
   * Normalizes the raw API response into a standard format.
   *
   * @template T - The type of the data payload.
   * @param response - The raw response from the server.
   * @returns {NormalizedApiResponse<T>} The normalized response structure.
   */
  private normalizeResponse<T>(
    response: ApiResponse<T>
  ): NormalizedApiResponse<T> {
    return {
      success: response.success,
      message: response.message,
      data: response.data,
      meta: response.meta,
      errors: response.errors,
    };
  }

  /**
   * Intercepts HTTP errors and throws typed API exceptions.
   *
   * @param response - The fetch Response object.
   * @throws {UnauthorizedError} For 401 statuses.
   * @throws {NotFoundError} For 404 statuses.
   * @throws {ValidationError} For 422 statuses.
   * @throws {ServerError} For 500+ statuses.
   */
  private async handleError(response: Response): Promise<never> {
    let errorData: ApiResponse | null = null;

    try {
      errorData = await response.json();
    } catch {
      // Response is not JSON
    }

    const message =
      errorData?.message || response.statusText || "An error occurred";
    const errors = errorData?.errors;

    switch (response.status) {
      case 401:
        if (typeof window !== "undefined") {
          try {
            sessionStorage.setItem(AUTH_REDIRECT_MESSAGE_KEY, message);
          } catch {
            // ignore
          }
          try {
            const { signOut } = await import("next-auth/react");
            signOut({ redirect: true, callbackUrl: "/login" });
          } catch {
            // signOut not available
          }
        }
        throw new UnauthorizedError(message);

      case 403:
        throw new ForbiddenError(message);

      case 404:
        throw new NotFoundError(message);

      case 409:
        throw new ConflictError(message);

      case 422:
        throw new ValidationError(message, errors || {});

      case 500:
      default:
        throw new ServerError(message);
    }
  }

  /**
   * Internal method to execute the Fetch request.
   * Handles headers, body serialization, and auth token injection.
   *
   * @template T - The expected response type.
   * @param url - The endpoint URL.
   * @param options - Request configuration.
   * @returns {Promise<NormalizedApiResponse<T>>} The API response.
   */
  private async request<T>(
    url: string,
    options: ApiRequestOptions = {}
  ): Promise<NormalizedApiResponse<T>> {
    const {
      skipAuth = false,
      baseURL,
      params,
      headers = {},
      ...fetchOptions
    } = options;

    const fullURL = this.buildURL(url, params);
    const clientBaseURL = baseURL || this.baseURL;

    // Retrieve auth token if required
    let authToken: string | null = null;
    if (!skipAuth) {
      authToken = await this.getAuthToken();
    }

    // Determine request body type
    const isFormData = fetchOptions.body instanceof FormData;

    // Prepare request headers
    const requestHeaders: Record<string, string> = {
      Accept: "application/json",
      ...(headers as Record<string, string>),
    };

    // Only set Content-Type for JSON payloads
    if (!isFormData) {
      requestHeaders["Content-Type"] = "application/json";
    }

    // Attach auth token if available
    if (authToken) {
      requestHeaders.Authorization = `Bearer ${authToken}`;
    }

    // Execute request
    const response = await fetch(fullURL, {
      ...fetchOptions,
      headers: requestHeaders,
    });

    // Handle non-success responses
    if (!response.ok) {
      await this.handleError(response);
    }

    // Parse and normalize response
    const data: ApiResponse<T> = await response.json();
    return this.normalizeResponse(data);
  }

  /**
   * performs a GET request.
   *
   * @template T - The response data type.
   * @param url - Endpoint URL.
   * @param options - Request options.
   */
  async get<T>(
    url: string,
    options?: ApiRequestOptions
  ): Promise<NormalizedApiResponse<T>> {
    return this.request<T>(url, {
      ...options,
      method: "GET",
    });
  }

  /**
   * Performs a POST request.
   *
   * @template T - The response data type.
   * @param url - Endpoint URL.
   * @param body - Request payload (JSON object or FormData).
   * @param options - Request options.
   */
  async post<T>(
    url: string,
    body?: unknown,
    options?: ApiClientOptions
  ): Promise<NormalizedApiResponse<T>> {
    return this.request<T>(url, {
      ...options,
      method: "POST",
      body:
        body instanceof FormData
          ? body
          : body
          ? JSON.stringify(body)
          : undefined,
    });
  }

  /**
   * Performs a PUT request.
   *
   * @template T - The response data type.
   * @param url - Endpoint URL.
   * @param body - Request payload.
   * @param options - Request options.
   */
  async put<T>(
    url: string,
    body?: unknown,
    options?: ApiClientOptions
  ): Promise<NormalizedApiResponse<T>> {
    return this.request<T>(url, {
      ...options,
      method: "PUT",
      body:
        body instanceof FormData
          ? body
          : body
          ? JSON.stringify(body)
          : undefined,
    });
  }

  /**
   * Performs a PATCH request.
   *
   * @template T - The response data type.
   * @param url - Endpoint URL.
   * @param body - Request payload.
   * @param options - Request options.
   */
  async patch<T>(
    url: string,
    body?: unknown,
    options?: ApiClientOptions
  ): Promise<NormalizedApiResponse<T>> {
    return this.request<T>(url, {
      ...options,
      method: "PATCH",
      body:
        body instanceof FormData
          ? body
          : body
          ? JSON.stringify(body)
          : undefined,
    });
  }

  /**
   * Performs a DELETE request.
   *
   * @template T - The response data type.
   * @param url - Endpoint URL.
   * @param options - Request options.
   */
  async delete<T>(
    url: string,
    options?: ApiClientOptions
  ): Promise<NormalizedApiResponse<T>> {
    return this.request<T>(url, {
      ...options,
      method: "DELETE",
    });
  }

  /**
   * Performs a POST request and returns the response as a Blob.
   * Used for file downloads (e.g., export to Excel/PDF).
   *
   * @param url - Endpoint URL.
   * @param body - Request payload (JSON object).
   * @param options - Request options.
   * @returns {Promise<Blob>} The response body as a Blob.
   */
  async postBlob(
    url: string,
    body?: unknown,
    options?: ApiClientOptions
  ): Promise<Blob> {
    const fullURL = this.buildURL(url);
    const isFormData = body instanceof FormData;

    const requestHeaders: Record<string, string> = {
      Accept: "*/*",
      ...(options?.headers as Record<string, string>),
    };

    if (!isFormData && body) {
      requestHeaders["Content-Type"] = "application/json";
    }

    let authToken: string | null = null;
    if (!options?.skipAuth) {
      authToken = await this.getAuthToken();
    }
    if (authToken) {
      requestHeaders.Authorization = `Bearer ${authToken}`;
    }

    const response = await fetch(fullURL, {
      ...options,
      method: "POST",
      headers: requestHeaders,
      body:
        body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      await this.handleError(response);
    }

    return response.blob();
  }

  /**
   * Performs a GET request and returns the response as a Blob.
   * Used for downloading static files (e.g., CSV templates).
   *
   * @param url - Endpoint URL.
   * @param options - Request options.
   * @returns {Promise<Blob>} The response body as a Blob.
   */
  async getBlob(
    url: string,
    options?: ApiRequestOptions
  ): Promise<Blob> {
    const { skipAuth = false, params, headers = {}, ...fetchOptions } =
    options || {};

    const fullURL = this.buildURL(url, params);

    const requestHeaders: Record<string, string> = {
      Accept: "*/*",
      ...(headers as Record<string, string>),
    };

    let authToken: string | null = null;
    if (!skipAuth) {
      authToken = await this.getAuthToken();
    }

    if (authToken) {
      requestHeaders.Authorization = `Bearer ${authToken}`;
    }

    const response = await fetch(fullURL, {
      ...fetchOptions,
      method: "GET",
      headers: requestHeaders,
    });

    if (!response.ok) {
      await this.handleError(response);
    }

    return response.blob();
  }
}

/**
 * Singleton instance of ApiClient.
 * Use this for default API interactions.
 */
export const api = new ApiClient();

/**
 * Export the class for instantiating custom clients (e.g. different base URLs).
 */
export { ApiClient };