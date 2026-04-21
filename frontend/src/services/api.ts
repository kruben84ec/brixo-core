import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { TokenResponse, ApiError } from '@/types/api';

// Instancia de axios configurada
const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true, // ← CRÍTICO: envía cookies con cada request
  headers: {
    'Content-Type': 'application/json',
  },
});

// Estado local del token de acceso (en memoria, NO en localStorage)
let accessToken: string | null = null;

// Variable para evitar multiple refresh calls simultáneos
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

/**
 * Getter del token actual (para uso interno)
 */
export function getAccessToken(): string | null {
  return accessToken;
}

/**
 * Setter del token (llamado después de login/register/refresh)
 */
export function setAccessToken(token: string | null): void {
  accessToken = token;
  
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}

/**
 * Refresca el token usando el refresh token en cookie HttpOnly
 */
async function refreshAccessToken(): Promise<string | null> {
  // Si ya está refrescando, espera el resultado
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const response = await axios.post(
        'http://localhost:8000/api/auth/refresh',
        {},
        {
          withCredentials: true, // Envía refresh token en cookie
        }
      );
      
      const newToken = response.data.access_token;
      setAccessToken(newToken);
      return newToken;
    } catch (error) {
      // Refresh falló → sesión expirada
      setAccessToken(null);
      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/**
 * Interceptor de request: inyecta token en Authorization header
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor de response: maneja 401 con refresh automático
 */
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Si es 401 y no hemos intentado ya: refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const newToken = await refreshAccessToken();
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api.request(originalRequest);
      } else {
        // Refresh falló: dispatch logout
        // Será capturado por el componente/hook que consume la API
        return Promise.reject(new Error('Session expired'));
      }
    }

    return Promise.reject(error);
  }
);

export default api;
