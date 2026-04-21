import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/theme/ThemeProvider";
import { PrivateRoute } from "@/components/layout/PrivateRoute";
import { PublicOnlyRoute } from "@/components/layout/PublicOnlyRoute";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { useAuthStore } from "@/stores/authStore";
import { useEffect } from "react";

/**
 * Placeholder Dashboard para Sprint 2
 */
function DashboardPage() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Dashboard</h1>
      <p>Próximamente...</p>
    </div>
  );
}

function App() {
  const hydrate = useAuthStore((s) => s.hydrate);

  // Hidratar estado de autenticación desde localStorage al montar
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <Router>
      <ThemeProvider>
        <Routes>
          {/* Rutas públicas */}
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <LoginPage />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicOnlyRoute>
                <RegisterPage />
              </PublicOnlyRoute>
            }
          />

          {/* Rutas privadas */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />

          {/* Ruta por defecto */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </ThemeProvider>
    </Router>
  );
}

export default App;
