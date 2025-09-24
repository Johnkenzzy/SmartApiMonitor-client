import { get, post, put, del } from "./client";

/* ========================
   Types
======================== */
export interface User {
  id: string;
  email: string;
  created_at: string;
  is_active: boolean;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface Monitor {
  id: string;
  name: string;
  url: string;
  frequency_sec: number;
  max_latency_ms?: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Metric {
  id: string;
  monitor_id: string;
  is_up: boolean;
  response_ms: number;
  timestamp: string;
}

export interface Alert {
  id: string;
  monitor_id: string;
  channel: string;
  message: string;
  created_at: string;
}

export interface ApiSuccess {
  success: boolean;
}

/* ========================
   Params
======================== */
export interface MetricsQuery {
  monitor_id?: string;
  is_up?: boolean;
  since?: string;
  limit?: number;
}

export interface AlertsQuery {
  monitor_id?: string;
  channel?: string;
  limit?: number;
}

/* ========================
   Auth
======================== */
export const register = (email: string, password: string) =>
  post<AuthResponse>("/auth/register", { email, password });

export const login = (email: string, password: string) =>
  post<AuthResponse>("/auth/login", { email, password });

export const refreshToken = (refresh_token: string) =>
  post<{ access_token: string; refresh_token: string }>("/auth/refresh", {
    refresh_token,
  });

export const getMe = () => get<User>("/auth/me");

/* ========================
   Monitors
======================== */
export const listMonitors = () => get<Monitor[]>("/monitors/");

export const getMonitor = (id: string) => get<Monitor>(`/monitors/${id}`);

export const createMonitor = (payload: {
  name: string;
  url: string;
  frequency_sec: number;
  max_latency_ms?: number | null;
  is_active?: boolean | null;
}) => post<Monitor>("/monitors/", payload);

export const updateMonitor = (
  id: string,
  payload: Partial<{
    name: string;
    url: string;
    frequency_sec: number;
    max_latency_ms?: number | null;
    is_active?: boolean | null;
  }>
) => put<Monitor>(`/monitors/${id}`, payload);

export const deleteMonitor = (id: string) => del<ApiSuccess>(`/monitors/${id}`);

/* ========================
   Metrics
======================== */
export const listMetrics = (params?: MetricsQuery) =>
  get<Metric[]>("/metrics/", params);

export const getMetric = (id: string) => get<Metric>(`/metrics/${id}`);

export const deleteMetrics = (params?: {
  metric_id?: string;
  monitor_id?: string;
}) => del<ApiSuccess>("/metrics/", params);

/* ========================
   Alerts
======================== */
export const listAlerts = (params?: AlertsQuery) =>
  get<Alert[]>("/alerts/", params);

export const deleteAlerts = (params?: {
  alert_id?: string;
  monitor_id?: string;
  channel?: string;
}) => del<ApiSuccess>("/alerts/", params);

/* ========================
   Admin
======================== */
export const triggerChecks = () => post<ApiSuccess>("/admin/trigger-checks");

export const celeryHealth = () =>
  get<{ status: string }>("/admin/celery-health");
