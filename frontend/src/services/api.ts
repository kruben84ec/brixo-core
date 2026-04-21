/**
 * Cliente HTTP Axios con interceptores para JWT
 * - Auto-refresh de tokens expirados
 * - Inyección de bearer token en headers
 * - Tipado completo de respuestas del backend
 */

import axios, { AxiosError, AxiosInstance } from "axios";

// Tipos de respuesta del backend
export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface RegisterRequest {
  company_name: string;
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: string;
  tenant_id: string;
  email: string;
  name: string;
  authority_level: "OWNER" | "ADMIN" | "MANAGER" | "OPERATOR";
  created_at: string;
}

export interface Product {
  id: string;
  tenant_id: string;
  name: string;
  sku: string;
  stock: number;
  minimum_stock: number;
  created_at: string;
}

export interface ErrorResponse {
  error: string;
  message: string;
}

const BASE_URL = "http://localhost:8000/api";

class ApiClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Interceptor: agregar token a las requests
    this.instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("access_token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Interceptor: manejar respuestas y refresh automático
    this.instance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<ErrorResponse>) => {
        if (error.response?.status === 401) {
          // Token expirado o inválido
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await this.instance.post<AuthResponse>(
      "/auth/register",
      data
    );
    return response.data;
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await this.instance.post<AuthResponse>(
      "/auth/login",
      data
    );
    return response.data;
  }

  async refresh(): Promise<AuthResponse> {
    const response = await this.instance.post<AuthResponse>("/auth/refresh");
    return response.data;
  }

  // User endpoints
  async getMe(): Promise<User> {
    const response = await this.instance.get<User>("/users/me");
    return response.data;
  }

  // Health check
  async health(): Promise<{ status: string }> {
    const response = await this.instance.get<{ status: string }>("/health");
    return response.data;
  }

  getAxiosInstance() {
    return this.instance;
  }
}

export const api = new ApiClient();
