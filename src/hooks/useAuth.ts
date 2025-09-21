import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { login, register, getMe } from "../services/api";
import type { AuthResponse, User } from "../services/api";

export const useRegister = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      register(email, password),
    onSuccess: (data: AuthResponse) => {
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      queryClient.setQueryData<User>(["me"], data.user);
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onSuccess: (data: AuthResponse) => {
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      queryClient.setQueryData<User>(["me"], data.user);
    },
  });
};

export const useMe = () =>
  useQuery<User>({
    queryKey: ["me"],
    queryFn: getMe,
    staleTime: 1000 * 60 * 5,
  });
