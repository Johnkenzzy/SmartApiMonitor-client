import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from "axios";

const API_BASE_URL: string =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

interface RefreshResponse {
  access_token: string;
  refresh_token?: string;
}

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("access_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        try {
          const { data } = await axios.post<RefreshResponse>(
            `${API_BASE_URL}/auth/refresh`,
            { refresh_token: refreshToken }
          );

          localStorage.setItem("access_token", data.access_token);
          if (data.refresh_token) {
            localStorage.setItem("refresh_token", data.refresh_token);
          }

          if (error.config?.headers) {
            error.config.headers.Authorization = `Bearer ${data.access_token}`;
          }

          return api.request(error.config as InternalAxiosRequestConfig);
        } catch {
          localStorage.clear();
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

/* Typed request helper */
export async function request<T>(config: AxiosRequestConfig): Promise<T> {
  const response: AxiosResponse<T> = await api.request<T>(config);
  return response.data;
}

/* Convenience wrappers */
export const get = <T>(url: string, params?: object) =>
  request<T>({ url, method: "GET", params });

export const post = <T, B = unknown>(url: string, data?: B) =>
  request<T>({ url, method: "POST", data });

export const put = <T, B = unknown>(url: string, data?: B) =>
  request<T>({ url, method: "PUT", data });

export const del = <T>(url: string, params?: object) =>
  request<T>({ url, method: "DELETE", params });

export default api;
