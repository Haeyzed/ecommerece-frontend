/**
 * API Error Definitions
 *
 * Defines a hierarchy of error classes representing various HTTP status codes
 * and application-specific error scenarios.
 *
 * Architecture:
 * - `ApiError`: The abstract base class.
 * - Client Errors (4xx): Validation, Auth, Not Found, etc.
 * - Server Errors (5xx): Internal Server Error, Bad Gateway, etc.
 * - Domain Errors: Token issues, Permission failures.
 *
 * These classes are used by the API client to throw typed exceptions,
 * allowing consumers (like React Query or Next.js pages) to handle specific
 * failure modes gracefully (e.g., `if (error instanceof UnauthorizedError)`).
 *
 * @module lib/api/api-errors
 */

/**
 * Base class for all API-related errors.
 * Extends the native `Error` class to support stack traces and standard error handling.
 */
export class ApiError extends Error {
  /**
   * Creates a new ApiError instance.
   *
   * @param message - A human-readable description of the error.
   * @param statusCode - The HTTP status code returned by the server.
   * @param errors - Optional dictionary of validation errors (field -> messages[]).
   * @param code - Optional machine-readable error code (e.g., "USER_NOT_FOUND").
   */
  constructor(
    message: string,
    public statusCode: number,
    public errors?: Record<string, string[]>,
    public code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * =====================================================
 * 4xx – Client Errors
 * =====================================================
 */

/**
 * Represents an HTTP 422 Unprocessable Entity error.
 * Commonly used for form validation failures.
 */
export class ValidationError extends ApiError {
  /**
   * @param message - The error message. Defaults to "Validation failed".
   * @param errors - An object mapping field names to arrays of error messages.
   */
  constructor(message = "Validation failed", errors: Record<string, string[]>) {
    super(message, 422, errors, "VALIDATION_ERROR");
    this.name = "ValidationError";
  }
}

/**
 * Represents an HTTP 400 Bad Request error.
 * Indicates the request was malformed or contained invalid parameters.
 */
export class BadRequestError extends ApiError {
  constructor(message = "Bad request") {
    super(message, 400, undefined, "BAD_REQUEST");
    this.name = "BadRequestError";
  }
}

/**
 * Represents an HTTP 401 Unauthorized error.
 * Indicates the user is not authenticated or the session is invalid.
 */
export class UnauthorizedError extends ApiError {
  constructor(message = "Unauthorized") {
    super(message, 401, undefined, "UNAUTHORIZED");
    this.name = "UnauthorizedError";
  }
}

/**
 * Represents an HTTP 403 Forbidden error.
 * Indicates the user is authenticated but lacks permission to access the resource.
 */
export class ForbiddenError extends ApiError {
  constructor(message = "Forbidden") {
    super(message, 403, undefined, "FORBIDDEN");
    this.name = "ForbiddenError";
  }
}

/**
 * Represents an HTTP 404 Not Found error.
 * Indicates the requested resource does not exist.
 */
export class NotFoundError extends ApiError {
  constructor(message = "Resource not found") {
    super(message, 404, undefined, "NOT_FOUND");
    this.name = "NotFoundError";
  }
}

/**
 * Represents an HTTP 409 Conflict error.
 * Indicates a request conflict with the current state of the target resource (e.g., duplicate entry).
 */
export class ConflictError extends ApiError {
  constructor(message = "Resource conflict") {
    super(message, 409, undefined, "CONFLICT");
    this.name = "ConflictError";
  }
}

/**
 * Represents an HTTP 410 Gone error.
 * Indicates the requested resource is no longer available and will not be available again.
 */
export class GoneError extends ApiError {
  constructor(message = "Resource no longer available") {
    super(message, 410, undefined, "GONE");
    this.name = "GoneError";
  }
}

/**
 * Represents an HTTP 429 Too Many Requests error.
 * Indicates the user has sent too many requests in a given amount of time.
 */
export class TooManyRequestsError extends ApiError {
  constructor(message = "Too many requests") {
    super(message, 429, undefined, "TOO_MANY_REQUESTS");
    this.name = "TooManyRequestsError";
  }
}

/**
 * =====================================================
 * 5xx – Server Errors
 * =====================================================
 */

/**
 * Represents an HTTP 500 Internal Server Error.
 * Indicates a generic error message, given when an unexpected condition was encountered.
 */
export class ServerError extends ApiError {
  constructor(message = "Internal server error") {
    super(message, 500, undefined, "SERVER_ERROR");
    this.name = "ServerError";
  }
}

/**
 * Represents an HTTP 501 Not Implemented error.
 * Indicates the server does not support the functionality required to fulfill the request.
 */
export class NotImplementedError extends ApiError {
  constructor(message = "Not implemented") {
    super(message, 501, undefined, "NOT_IMPLEMENTED");
    this.name = "NotImplementedError";
  }
}

/**
 * Represents an HTTP 502 Bad Gateway error.
 * Indicates the server, while acting as a gateway or proxy, received an invalid response from the upstream server.
 */
export class BadGatewayError extends ApiError {
  constructor(message = "Bad gateway") {
    super(message, 502, undefined, "BAD_GATEWAY");
    this.name = "BadGatewayError";
  }
}

/**
 * Represents an HTTP 503 Service Unavailable error.
 * Indicates the server is currently unable to handle the request due to a temporary overload or scheduled maintenance.
 */
export class ServiceUnavailableError extends ApiError {
  constructor(message = "Service unavailable") {
    super(message, 503, undefined, "SERVICE_UNAVAILABLE");
    this.name = "ServiceUnavailableError";
  }
}

/**
 * Represents an HTTP 504 Gateway Timeout error.
 * Indicates the server, while acting as a gateway or proxy, did not receive a timely response from the upstream server.
 */
export class GatewayTimeoutError extends ApiError {
  constructor(message = "Gateway timeout") {
    super(message, 504, undefined, "GATEWAY_TIMEOUT");
    this.name = "GatewayTimeoutError";
  }
}

/**
 * =====================================================
 * Auth / Domain-Specific Errors
 * =====================================================
 */

/**
 * Specialized error for expired authentication tokens (HTTP 401).
 * Can be used to trigger automatic token refresh flows.
 */
export class TokenExpiredError extends ApiError {
  constructor(message = "Token expired") {
    super(message, 401, undefined, "TOKEN_EXPIRED");
    this.name = "TokenExpiredError";
  }
}

/**
 * Specialized error for invalid or malformed tokens (HTTP 401).
 */
export class InvalidTokenError extends ApiError {
  constructor(message = "Invalid token") {
    super(message, 401, undefined, "INVALID_TOKEN");
    this.name = "InvalidTokenError";
  }
}

/**
 * Specialized error for permission denial (HTTP 403).
 * Distinct from generic Forbidden errors to indicate specific ACL failures.
 */
export class PermissionDeniedError extends ApiError {
  constructor(message = "Permission denied") {
    super(message, 403, undefined, "PERMISSION_DENIED");
    this.name = "PermissionDeniedError";
  }
}

/**
 * Specialized error for rate limit violations (HTTP 429).
 * Often accompanied by Retry-After headers in the response.
 */
export class RateLimitExceededError extends ApiError {
  constructor(message = "Rate limit exceeded") {
    super(message, 429, undefined, "RATE_LIMIT_EXCEEDED");
    this.name = "RateLimitExceededError";
  }
}