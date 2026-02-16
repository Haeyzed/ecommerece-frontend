"use client";

import { useApiClient } from "@/lib/api/api-client-client";
import { useQuery } from "@tanstack/react-query";
import type { City, CityListParams, CityOption } from "./types";

export const cityKeys = {
  all: ["cities"] as const,
  lists: () => [...cityKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) => [...cityKeys.lists(), filters] as const,
  details: () => [...cityKeys.all, "detail"] as const,
  detail: (id: number) => [...cityKeys.details(), id] as const,
  options: () => [...cityKeys.all, "options"] as const,
};

const BASE_PATH = '/cities'

export function useCities(params?: CityListParams) {
  const { api, sessionStatus } = useApiClient();
  const query = useQuery({
    queryKey: cityKeys.list(params),
    queryFn: async () => {
      const response = await api.get<City[]>(BASE_PATH, { params });
      return response;
    },
    enabled: sessionStatus !== "loading",
  });
  return {
    ...query,
    isSessionLoading: sessionStatus === "loading",
  };
}

export function useOptionCities() {
  const { api, sessionStatus } = useApiClient();
  return useQuery({
    queryKey: cityKeys.options(),
    queryFn: async () => {
      const response = await api.get<CityOption[]>(`${BASE_PATH}/options`);
      return response.data ?? [];
    },
    enabled: sessionStatus !== "loading",
  });
}

export function useCity(id: number) {
  const { api, sessionStatus } = useApiClient();
  const query = useQuery({
    queryKey: cityKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<City>(`${BASE_PATH}/${id}`);
      return response.data ?? null;
    },
    enabled: !!id && sessionStatus !== "loading",
  });
  return {
    ...query,
    isSessionLoading: sessionStatus === "loading",
  };
}
