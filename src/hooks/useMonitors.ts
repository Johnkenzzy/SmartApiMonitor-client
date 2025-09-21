import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listMonitors,
  getMonitor,
  createMonitor,
  updateMonitor,
  deleteMonitor,
} from "../services/api";
import type { Monitor } from "../services/api";

export const useMonitors = () =>
  useQuery<Monitor[]>({
    queryKey: ["monitors"],
    queryFn: listMonitors,
  });

export const useMonitor = (id: string) =>
  useQuery<Monitor>({
    queryKey: ["monitors", id],
    queryFn: () => getMonitor(id),
    enabled: !!id,
  });

export const useCreateMonitor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMonitor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["monitors"] });
    },
  });
};

export const useUpdateMonitor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Monitor> }) =>
      updateMonitor(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["monitors"] });
      queryClient.setQueryData(["monitors", data.id], data);
    },
  });
};

export const useDeleteMonitor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMonitor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["monitors"] });
    },
  });
};
