"use client";

import { useApiClient } from "@/lib/api/api-client-client";
import { useQuery } from "@tanstack/react-query";
import type { Language, LanguageListParams, LanguageOption } from "./types";

export const languageKeys = {
  all: ["languages"] as const,
  lists: () => [...languageKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) => [...languageKeys.lists(), filters] as const,
  details: () => [...languageKeys.all, "detail"] as const,
  detail: (id: number) => [...languageKeys.details(), id] as const,
  options: () => [...languageKeys.all, "options"] as const,
};

const BASE_PATH = '/languages'

export function useLanguages(params?: LanguageListParams) {
  const { api, sessionStatus } = useApiClient();
  const query = useQuery({
    queryKey: languageKeys.list(params),
    queryFn: async () => {
      const response = await api.get<Language[]>(BASE_PATH, { params });
      return response;
    },
    enabled: sessionStatus !== "loading",
  });
  return {
    ...query,
    isSessionLoading: sessionStatus === "loading",
  };
}

export function useOptionLanguages() {
  const { api, sessionStatus } = useApiClient();
  return useQuery({
    queryKey: languageKeys.options(),
    queryFn: async () => {
      const response = await api.get<LanguageOption[]>(`${BASE_PATH}/options`);
      return response.data ?? [];
    },
    enabled: sessionStatus !== "loading",
  });
}

export function useLanguage(id: number) {
  const { api, sessionStatus } = useApiClient();
  const query = useQuery({
    queryKey: languageKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<Language>(`${BASE_PATH}/${id}`);
      return response.data ?? null;
    },
    enabled: !!id && sessionStatus !== "loading",
  });
  return {
    ...query,
    isSessionLoading: sessionStatus === "loading",
  };
}
