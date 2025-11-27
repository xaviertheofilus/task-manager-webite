export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  total: number;
  page: number;
  limit: number;
}

export interface ErrorResponse {
  success: false;
  message: string;
  error?: string;
  code?: string;
  details?: any;
}
