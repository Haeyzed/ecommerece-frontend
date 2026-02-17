"use client";

import { useApiClient } from "@/lib/api/api-client-client";
import { useQuery } from "@tanstack/react-query";
import type { Timezone, TimezoneListParams, TimezoneOptionsGrouped } from "./types";

export const timezoneKeys = {
  all: ["timezones"] as const,
  lists: () => [...timezoneKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) => [...timezoneKeys.lists(), filters] as const,
  details: () => [...timezoneKeys.all, "detail"] as const,
  detail: (id: number) => [...timezoneKeys.details(), id] as const,
  options: () => [...timezoneKeys.all, "options"] as const,
};

const BASE_PATH = '/timezones'

export function useTimezones(params?: TimezoneListParams) {
  const { api, sessionStatus } = useApiClient();
  const query = useQuery({
    queryKey: timezoneKeys.list(params),
    queryFn: async () => {
      const response = await api.get<Timezone[]>(BASE_PATH, { params });
      return response;
    },
    enabled: sessionStatus !== "loading",
  });
  return {
    ...query,
    isSessionLoading: sessionStatus === "loading",
  };
}

export function useOptionTimezones() {
  const { api, sessionStatus } = useApiClient();
  return useQuery({
    queryKey: timezoneKeys.options(),
    queryFn: async () => {
      const response = await api.get<TimezoneOptionsGrouped[]>(`${BASE_PATH}/options`);
      return response.data ?? [];
    },
    enabled: sessionStatus !== "loading",
  });
}

export function useTimezone(id: number) {
  const { api, sessionStatus } = useApiClient();
  const query = useQuery({
    queryKey: timezoneKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<Timezone>(`${BASE_PATH}/${id}`);
      return response.data ?? null;
    },
    enabled: !!id && sessionStatus !== "loading",
  });
  return {
    ...query,
    isSessionLoading: sessionStatus === "loading",
  };
}
