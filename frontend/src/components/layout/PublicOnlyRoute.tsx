import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

interface PublicOnlyRouteProps {
  children: React.ReactNode;
}

/**
 * Guard para rutas públicas (login, register)
 * Redirige a /dashboard si ya hay sesión
 */
export const PublicOnlyRoute: React.FC<PublicOnlyRouteProps> = ({
  children,
}) => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
