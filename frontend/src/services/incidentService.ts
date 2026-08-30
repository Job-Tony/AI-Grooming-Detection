import apiClient from "@/api/client";

import type { Incident } from "@/types/incident";

export async function getIncidents(
  limit: number = 100,
): Promise<Incident[]> {
  const { data } = await apiClient.get<Incident[]>(
    "/incidents",
    {
      params: {
        limit,
      },
    },
  );

  return data;
}

export async function getIncident(
  id: string,
): Promise<Incident> {
  const { data } = await apiClient.get<Incident>(
    `/incidents/${id}`,
  );

  return data;
}

export async function reviewIncident(
  id: string,
  notes?: string,
): Promise<Incident> {
  const { data } = await apiClient.patch<Incident>(
    `/incidents/${id}/review`,
    null,
    {
      params: {
        notes,
      },
    },
  );

  return data;
}