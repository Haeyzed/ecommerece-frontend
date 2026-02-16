"use client";

import { useApiClient } from "@/lib/api/api-client-client";
import { useQuery } from "@tanstack/react-query";
import type { Country, CountryListParams, CountryOption } from "./types";

export const countryKeys = {
  all: ["countries"] as const,
  lists: () => [...countryKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) => [...countryKeys.lists(), filters] as const,
  details: () => [...countryKeys.all, "detail"] as const,
  detail: (id: number) => [...countryKeys.details(), id] as const,
  options: () => [...countryKeys.all, "options"] as const,
  states: (countryId: number) => [...countryKeys.all, "states", countryId] as const,
};

const BASE_PATH = '/countries'

export function useCountries(params?: CountryListParams) {
  const { api, sessionStatus } = useApiClient();
  const query = useQuery({
    queryKey: countryKeys.list(params),
    queryFn: async () => {
      const response = await api.get<Country[]>(BASE_PATH, { params });
      return response;
    },
    enabled: sessionStatus !== "loading",
  });
  return {
    ...query,
    isSessionLoading: sessionStatus === "loading",
  };
}

export function useOptionCountries() {
  const { api, sessionStatus } = useApiClient();
  return useQuery({
    queryKey: countryKeys.options(),
    queryFn: async () => {
      const response = await api.get<CountryOption[]>(`${BASE_PATH}/options`);
      return response.data ?? [];
    },
    enabled: sessionStatus !== "loading",
  });
}

export function useCountry(id: number) {
  const { api, sessionStatus } = useApiClient();
  const query = useQuery({
    queryKey: countryKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<Country>(`${BASE_PATH}/${id}`);
      return response.data ?? null;
    },
    enabled: !!id && sessionStatus !== "loading",
  });
  return {
    ...query,
    isSessionLoading: sessionStatus === "loading",
  };
}

export function useStatesByCountry(countryId: number | null) {
  const { api, sessionStatus } = useApiClient();
  return useQuery({
    queryKey: countryKeys.states(countryId ?? 0),
    queryFn: async () => {
      const response = await api.get<{ id: number; name: string }[]>(
        `${BASE_PATH}/${countryId}/states`
      );
      return response.data ?? [];
    },
    enabled: !!countryId && sessionStatus !== "loading",
  });
}
