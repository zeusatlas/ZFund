/** Envelope every backend response is wrapped in. */
export type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
  meta?: { page: number; limit: number; total: number; totalPages: number };
};
