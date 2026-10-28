"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import type { ApiEnvelope } from "@/lib/api/types";
import { tokenStorage } from "@/lib/api/token-storage";

export type AuthUser = {
  id: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
};

export const adminRoles = ["SUPER_ADMIN", "PLATFORM_ADMIN"];

type OtpIdentity = { email: string; phone: string };
type LoginResult = { accessToken: string; refreshToken: string; user: AuthUser };

export const authKeys = { me: ["auth", "me"] as const };

/** Step 1: texts a one-time code to the phone number on the account. */
export function useRequestOtp() {
  return useMutation({
    mutationFn: async (payload: OtpIdentity) => {
      await api.post("/auth/request-otp", payload);
    },
  });
}

/** Step 2: exchanges the texted code for a session. */
export function useVerifyOtp() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: OtpIdentity & { code: string }) => {
      const { data } = await api.post<ApiEnvelope<LoginResult>>("/auth/verify-otp", payload);
      return data.data;
    },
    onSuccess: (result) => {
      tokenStorage.set(result.accessToken, result.refreshToken);
      queryClient.setQueryData(authKeys.me, result.user);
    },
  });
}

export function useMe() {
  return useQuery({
    queryKey: authKeys.me,
    queryFn: async () => {
      const { data } = await api.get<ApiEnvelope<AuthUser>>("/auth/profile");
      return data.data;
    },
    staleTime: 5 * 60_000,
  });
}

/** Where a signed-in user belongs, read from the stored token (no network call). */
export function dashboardForStoredToken(): "/admin" | "/host" | null {
  const token = tokenStorage.getAccess();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return adminRoles.includes(payload.role) ? "/admin" : "/host";
  } catch {
    return null;
  }
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      try {
        await api.post("/auth/logout", { refreshToken: tokenStorage.getRefresh() });
      } catch {
        // Local sign-out must succeed even if the server call fails.
      }
    },
    onSettled: () => {
      tokenStorage.clear();
      queryClient.clear();
    },
  });
}
