"use client";

import { useApiClient } from "@/lib/api/api-client-client";
import { useQuery } from "@tanstack/react-query";
import type { Currency, CurrencyListParams, CurrencyOption } from "./types";

export const currencyKeys = {
  all: ["currencies"] as const,
  lists: () => [...currencyKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) => [...currencyKeys.lists(), filters] as const,
  details: () => [...currencyKeys.all, "detail"] as const,
  detail: (id: number) => [...currencyKeys.details(), id] as const,
  options: () => [...currencyKeys.all, "options"] as const,
};

const BASE_PATH = '/currencies'

export function useCurrencies(params?: CurrencyListParams) {
  const { api, sessionStatus } = useApiClient();
  const query = useQuery({
    queryKey: currencyKeys.list(params),
    queryFn: async () => {
      const response = await api.get<Currency[]>(BASE_PATH, { params });
      return response;
    },
    enabled: sessionStatus !== "loading",
  });
  return {
    ...query,
    isSessionLoading: sessionStatus === "loading",
  };
}

export function useOptionCurrencies() {
  const { api, sessionStatus } = useApiClient();
  return useQuery({
    queryKey: currencyKeys.options(),
    queryFn: async () => {
      const response = await api.get<CurrencyOption[]>(`${BASE_PATH}/options`);
      return response.data ?? [];
    },
    enabled: sessionStatus !== "loading",
  });
}

export function useCurrency(id: number) {
  const { api, sessionStatus } = useApiClient();
  const query = useQuery({
    queryKey: currencyKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<Currency>(`${BASE_PATH}/${id}`);
      return response.data ?? null;
    },
    enabled: !!id && sessionStatus !== "loading",
  });
  return {
    ...query,
    isSessionLoading: sessionStatus === "loading",
  };
}
