export interface ApiSuccess<T> {
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiErrorDetail {
  code: string;
  message: string;
  requestId: string;
}

export interface ApiErrorResponse {
  error: ApiErrorDetail;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiErrorResponse;
