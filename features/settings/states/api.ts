"use client";

import { useApiClient } from "@/lib/api/api-client-client";
import { useQuery } from "@tanstack/react-query";
import type { State, StateListParams, StateOption } from "./types";

export const stateKeys = {
  all: ["states"] as const,
  lists: () => [...stateKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) => [...stateKeys.lists(), filters] as const,
  details: () => [...stateKeys.all, "detail"] as const,
  detail: (id: number) => [...stateKeys.details(), id] as const,
  options: () => [...stateKeys.all, "options"] as const,
  cities: (stateId: number) => [...stateKeys.all, "cities", stateId] as const,
};

const BASE_PATH = '/states'

export function useStates(params?: StateListParams) {
  const { api, sessionStatus } = useApiClient();
  const query = useQuery({
    queryKey: stateKeys.list(params),
    queryFn: async () => {
      const response = await api.get<State[]>(BASE_PATH, { params });
      return response;
    },
    enabled: sessionStatus !== "loading",
  });
  return {
    ...query,
    isSessionLoading: sessionStatus === "loading",
  };
}

export function useOptionStates() {
  const { api, sessionStatus } = useApiClient();
  return useQuery({
    queryKey: stateKeys.options(),
    queryFn: async () => {
      const response = await api.get<StateOption[]>(`${BASE_PATH}/options`);
      return response.data ?? [];
    },
    enabled: sessionStatus !== "loading",
  });
}

export function useStateDetail(id: number) {
  const { api, sessionStatus } = useApiClient();
  const query = useQuery({
    queryKey: stateKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<State>(`${BASE_PATH}/${id}`);
      return response.data ?? null;
    },
    enabled: !!id && sessionStatus !== "loading",
  });
  return {
    ...query,
    isSessionLoading: sessionStatus === "loading",
  };
}

export type CityOptionByState = { value: number; label: string }

export function useCitiesByState(stateId: number | null) {
  const { api, sessionStatus } = useApiClient();
  return useQuery({
    queryKey: stateKeys.cities(stateId ?? 0),
    queryFn: async () => {
      const response = await api.get<CityOptionByState[]>(
        `${BASE_PATH}/${stateId}/cities`
      );
      return response.data ?? [];
    },
    enabled: !!stateId && sessionStatus !== "loading",
  });
}
