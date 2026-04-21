import { create } from 'zustand';
import api, { setAccessToken, getAccessToken } from '@/services/api';
import { User, LoginRequest, RegisterRequest } from '@/types/api';

interface AuthStore {
  // Estado
  token: string | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;

  // Acciones
  login: (email: string, password: string) => Promise<void>;
  register: (company_name: string, username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
  clearError: () => void;
}

export const authStore = create<AuthStore>((set, get) => ({
  token: null,
  user: null,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/login', { email, password });
      const { access_token, user } = response.data;

      // Guardar token en memoria
      setAccessToken(access_token);

      // Guardar user info en localStorage (sin sensibilidad)
      localStorage.setItem('user', JSON.stringify(user));

      set({
        token: access_token,
        user,
        isLoading: false,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message || 'Login failed';
      set({
        error: errorMessage,
        isLoading: false,
        token: null,
        user: null,
      });
      throw error;
    }
  },

  register: async (company_name: string, username: string, email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/register', {
        company_name,
        username,
        email,
        password,
      });
      const { access_token, user } = response.data;

      // Guardar token en memoria
      setAccessToken(access_token);

      // Guardar user info en localStorage
      localStorage.setItem('user', JSON.stringify(user));

      set({
        token: access_token,
        user,
        isLoading: false,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message || 'Registration failed';
      set({
        error: errorMessage,
        isLoading: false,
        token: null,
        user: null,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      // Llama al endpoint logout (borra cookie en servidor)
      await api.post('/auth/logout');
    } catch (error) {
      // Aunque falle, seguimos limpiando el estado local
      console.error('Logout failed:', error);
    } finally {
      // Limpiar estado local
      setAccessToken(null);
      localStorage.removeItem('user');
      set({
        token: null,
        user: null,
        isLoading: false,
        error: null,
      });
    }
  },

  hydrate: async () => {
    /**
     * Hidratación al cargar la app:
     * 1. Lee user info de localStorage
     * 2. Si existe: intenta refrescar el token
     * 3. Si refresh falla: limpia todo (sesión expirada)
     */
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      return; // No hay sesión guardada
    }

    try {
      const user = JSON.parse(userJson);
      
      // Intenta obtener nuevo access token usando refresh token (en cookie)
      const response = await api.post('/auth/refresh');
      const { access_token } = response.data;

      setAccessToken(access_token);
      set({
        token: access_token,
        user,
      });
    } catch (error) {
      // Refresh falló: sesión expirada, limpia todo
      console.warn('Session expired, clearing auth state');
      setAccessToken(null);
      localStorage.removeItem('user');
      set({
        token: null,
        user: null,
        error: 'Session expired',
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
