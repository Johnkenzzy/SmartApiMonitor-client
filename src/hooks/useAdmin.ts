import { useQuery, useMutation } from "@tanstack/react-query";
import { triggerChecks, celeryHealth } from "../services/api";

export const useTriggerChecks = () =>
  useMutation({
    mutationFn: triggerChecks,
  });

export const useCeleryHealth = () =>
  useQuery<{ status: string }>({
    queryKey: ["celery-health"],
    queryFn: celeryHealth,
    refetchInterval: 10_000, // auto refresh every 10s
  });
