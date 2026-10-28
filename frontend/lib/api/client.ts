import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { tokenStorage } from "./token-storage";

export const PRODUCTION_API_URL = "https://api.raisefundz.com/api/v1";
export const LOCAL_API_URL = "http://localhost:2077/api/v1";

export function resolveApiBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;

  // In the browser: if accessed from raisefundz.com or any non-localhost domain,
  // ensure we use the live API url even if a build artifact retained a localhost fallback
  if (typeof window !== "undefined") {
    const host = window.location.hostname.toLowerCase();
    const isLocalhost = host === "localhost" || host === "127.0.0.1" || host === "::1";
    if (!isLocalhost) {
      if (!envUrl || envUrl.includes("localhost") || envUrl.includes("127.0.0.1")) {
        return PRODUCTION_API_URL;
      }
      return envUrl;
    }
  }

  if (envUrl) {
    return envUrl;
  }

  // Production build / SSR default
  if (process.env.NODE_ENV === "production") {
    return PRODUCTION_API_URL;
  }

  // Local development default
  return LOCAL_API_URL;
}

export const API_BASE_URL = resolveApiBaseUrl();
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

type ErrorBody = { message?: string; errors?: { field: string; message: string }[] | Record<string, string[]> };

function toApiError(error: AxiosError<ErrorBody>): ApiError {
  if (!error.response) {
    return {
      status: 0,
      message: error.code === "ECONNABORTED" ? "The request timed out." : "Network error. Check your connection.",
    };
  }
  const { status, data } = error.response;
  let errors: Record<string, string[]> | undefined;

  if (Array.isArray(data?.errors)) {
    errors = data.errors.reduce<Record<string, string[]>>((acc, item) => {
      if (item && typeof item === "object" && "field" in item && "message" in item) {
        (acc[item.field] ??= []).push(item.message);
      }
      return acc;
    }, {});
  } else if (data?.errors && typeof data.errors === "object") {
    errors = data.errors as Record<string, string[]>;
  }

  let message = data?.message;
  if (!message || message === "Unauthorized") {
    if (status === 401) {
      message = "Invalid or expired verification code. Please try again.";
    } else {
      message = error.message || "An unexpected error occurred.";
    }
  }

  return { status, message, errors };
}

api.interceptors.request.use(async (config) => {
  // Runtime guarantee: on live domains, automatically redirect any localhost request to production
  if (typeof window !== "undefined") {
    const host = window.location.hostname.toLowerCase();
    const isLocalhost = host === "localhost" || host === "127.0.0.1" || host === "::1";
    if (!isLocalhost && (config.baseURL?.includes("localhost") || !config.baseURL)) {
      config.baseURL = PRODUCTION_API_URL;
    }
  }
  const token = tokenStorage.getAccess();
  if (token) config.headers.set("Authorization", `Bearer ${token}`);
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ErrorBody>) => {
    const original = error.config as RetriableConfig | undefined;
    const isRefreshCall = original?.url?.includes(REFRESH_PATH);
    const isAuthEndpoint =
      original?.url?.includes("/auth/verify-otp") ||
      original?.url?.includes("/auth/request-otp") ||
      original?.url?.includes("/auth/login");
    const hasRefreshToken = Boolean(tokenStorage.getRefresh());

    // Only attempt refresh on authenticated requests with an active refresh token
    if (
      error.response?.status === 401 &&
      original &&
      !original._retry &&
      !isRefreshCall &&
      !isAuthEndpoint &&
      hasRefreshToken
    ) {
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
        if (typeof window !== "undefined" && !window.location.pathname.startsWith(LOGIN_PATH)) {
          window.location.replace(LOGIN_PATH);
        }
      }
    }

    return Promise.reject(toApiError(error));
  },
);
