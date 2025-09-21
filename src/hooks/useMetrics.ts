import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listMetrics, getMetric, deleteMetrics } from "../services/api";
import type { Metric } from "../services/api";

export const useMetrics = (params?: {
  monitor_id?: string;
  is_up?: boolean;
  since?: string;
  limit?: number;
}) =>
  useQuery<Metric[]>({
    queryKey: ["metrics", params],
    queryFn: () => listMetrics(params),
  });

export const useMetric = (id: string) =>
  useQuery<Metric>({
    queryKey: ["metrics", id],
    queryFn: () => getMetric(id),
    enabled: !!id,
  });

export const useDeleteMetrics = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMetrics,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["metrics"] });
    },
  });
};
