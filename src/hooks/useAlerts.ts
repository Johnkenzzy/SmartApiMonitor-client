import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listAlerts, deleteAlerts } from "../services/api";
import type { Alert } from "../services/api";

export const useAlerts = (params?: {
  monitor_id?: string;
  channel?: string;
  limit?: number;
}) =>
  useQuery<Alert[]>({
    queryKey: ["alerts", params],
    queryFn: () => listAlerts(params),
  });

export const useDeleteAlerts = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAlerts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
  });
};
