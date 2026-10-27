"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import type { ApiEnvelope } from "@/lib/api/types";
import { tokenStorage } from "@/lib/api/token-storage";

export type AuthUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
};

type LoginPayload = { email: string; password: string };
type LoginResult = { accessToken: string; refreshToken: string; user: AuthUser };

export const authKeys = { me: ["auth", "me"] as const };

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const { data } = await api.post<ApiEnvelope<LoginResult>>("/auth/login", payload);
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
