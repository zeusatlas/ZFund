import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { tokenStorage } from "./token-storage";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:2077/api/v1";
const REFRESH_PATH = "/auth/refresh-token";
const LOGIN_PATH = "/login";

export type ApiError = {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
};

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20_000,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});

// Separate instance so the refresh call skips our interceptors (no loops).
const refreshClient = axios.create({ baseURL: API_BASE_URL, timeout: 20_000 });

let refreshing: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refreshToken = tokenStorage.getRefresh();
  if (!refreshToken) throw new Error("No refresh token");
  const { data } = await refreshClient.post(REFRESH_PATH, { refreshToken });
  const access: string = data.data?.accessToken ?? data.accessToken;
  const refresh: string = data.data?.refreshToken ?? data.refreshToken;
  tokenStorage.set(access, refresh);
  return access;
}

type ErrorBody = { message?: string; errors?: { field: string; message: string }[] };

function toApiError(error: AxiosError<ErrorBody>): ApiError {
  if (!error.response) {
    return { status: 0, message: error.code === "ECONNABORTED" ? "The request timed out." : "Network error. Check your connection." };
  }
  const { status, data } = error.response;
  // Backend sends validation errors as [{ field, message }]; group them by field.
  const errors = data?.errors?.reduce<Record<string, string[]>>((acc, { field, message }) => {
    (acc[field] ??= []).push(message);
    return acc;
  }, {});
  return { status, message: data?.message ?? error.message, errors };
}

api.interceptors.request.use(async (config) => {
  const token = tokenStorage.getAccess();
  if (token) config.headers.set("Authorization", `Bearer ${token}`);
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ErrorBody>) => {
    const original = error.config as RetriableConfig | undefined;
    const isRefreshCall = original?.url?.includes(REFRESH_PATH);

    if (error.response?.status === 401 && original && !original._retry && !isRefreshCall) {
      original._retry = true;
      try {
        refreshing ??= refreshAccessToken().finally(() => {
          refreshing = null;
        });
        const token = await refreshing;
        original.headers.set("Authorization", `Bearer ${token}`);
        return api(original);
      } catch {
        tokenStorage.clear();
        if (typeof window !== "undefined") window.location.replace(LOGIN_PATH);
      }
    }

    return Promise.reject(toApiError(error));
  },
);
