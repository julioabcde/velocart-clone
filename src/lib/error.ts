export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }

  static isApiError(error: unknown): error is ApiError {
    return error instanceof ApiError;
  }

  isUnauthorized(): boolean {
    return this.statusCode === 401;
  }

  isForbidden(): boolean {
    return this.statusCode === 403;
  }

  isNotFound(): boolean {
    return this.statusCode === 404;
  }

  isServerError(): boolean {
    return this.statusCode >= 500;
  }

  isClientError(): boolean {
    return this.statusCode >= 400 && this.statusCode < 500;
  }
}

export class NetworkError extends Error {
  constructor(message = 'Network connection failed') {
    super(message);
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends Error {
  constructor(message = 'Request timeout') {
    super(message);
    this.name = 'TimeoutError';
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public fields?: Record<string, string>
  ) {
    super(message);
    this.name = 'ValidationError';
  }

  hasFieldErrors(): boolean {
    return !!this.fields && Object.keys(this.fields).length > 0;
  }

  getFieldError(fieldName: string): string | undefined {
    return this.fields?.[fieldName];
  }
}

// ✅ Add new error types
export class AuthenticationError extends Error {
  constructor(message = 'Authentication failed') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends Error {
  constructor(message = 'Access denied') {
    super(message);
    this.name = 'AuthorizationError';
  }
}

export class ParseError extends Error {
  constructor(message = 'Failed to parse response') {
    super(message);
    this.name = 'ParseError';
  }
}

// ✅ Error factory for consistent error creation
export class ErrorFactory {
  static fromResponse(status: number, responseData: any): Error {
    const message = responseData?.message || `HTTP ${status} Error`;
    const code = responseData?.responseCode || 'HTTP_ERROR';

    switch (status) {
      case 401:
        return new AuthenticationError(message);
      case 403:
        return new AuthorizationError(message);
      case 404:
        return new ApiError(status, code, message, responseData);
      case 422:
        return new ValidationError(message, responseData?.fields);
      default:
        if (status >= 500) {
          return new ApiError(status, code, `Server error: ${message}`, responseData);
        }
        return new ApiError(status, code, message, responseData);
    }
  }

  static fromNetworkError(error: any): Error {
    if (error.name === 'AbortError') {
      return new TimeoutError('Request timeout');
    }

    if (error instanceof TypeError && error.message.includes('fetch')) {
      return new NetworkError('Unable to connect to server');
    }

    if (error instanceof SyntaxError && error.message.includes('JSON')) {
      return new ParseError('Invalid response format from server');
    }

    return new ApiError(0, 'UNKNOWN_ERROR', error.message || 'An unexpected error occurred', error);
  }
}
