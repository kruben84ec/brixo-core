// Tipos para las APIs del backend

export interface User {
  id: string;
  name: string;
  email: string;
  tenant_id: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface RegisterRequest {
  company_name: string;
  username: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface ApiError {
  error: string;
  message: string;
  detail?: string;
}
