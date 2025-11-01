import { ApiError, NetworkError, TimeoutError, ValidationError } from "@/lib/error";

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }
  
  if (error instanceof NetworkError) {
    return 'Network error. Please check your connection.';
  }
  
  if (error instanceof TimeoutError) {
    return 'Request timeout. Please try again.';
  }
  
  if (error instanceof ValidationError) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
}