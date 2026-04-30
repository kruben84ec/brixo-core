import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/theme/ThemeProvider";
import { ToastProvider } from "@/components/feedback/Toast";
import { PrivateRoute } from "@/components/layout/PrivateRoute";
import { PublicOnlyRoute } from "@/components/layout/PublicOnlyRoute";
import { AppShell } from "@/components/layout/AppShell";
import { Sidebar } from "@/components/layout/Sidebar";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { InventoryPage } from "@/pages/InventoryPage";
import { LandingPage } from "@/pages/LandingPage";
import { useAuthStore } from "@/stores/authStore";
import { useEffect } from "react";

/**
 * Placeholders para rutas post-MVP
 */

function MovementsPagePlaceholder() {
  return <div style={{ padding: "2rem", color: "var(--text-secondary)" }}>Movimientos — próximamente</div>;
}

function TeamPagePlaceholder() {
  return <div style={{ padding: "2rem", color: "var(--text-secondary)" }}>Equipo — próximamente</div>;
}

function AuditPagePlaceholder() {
  return <div style={{ padding: "2rem", color: "var(--text-secondary)" }}>Auditoría — próximamente</div>;
}

function App() {
  const hydrate = useAuthStore((s) => s.hydrate);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // Hidratar estado de autenticación desde localStorage al montar
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <Router>
      <ThemeProvider>
        <ToastProvider>
          <Routes>
            {/* Landing page — pública para todos */}
            <Route path="/" element={<LandingPage />} />

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

            {/* Rutas privadas con AppShell */}
            {isAuthenticated && (
              <>
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute>
                      <AppShell sidebarContent={<Sidebar activeItem="dashboard" />}>
                        <DashboardPage />
                      </AppShell>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/inventory"
                  element={
                    <PrivateRoute>
                      <AppShell sidebarContent={<Sidebar activeItem="inventory" />}>
                        <InventoryPage />
                      </AppShell>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/movements"
                  element={
                    <PrivateRoute>
                      <AppShell sidebarContent={<Sidebar activeItem="movements" />}>
                        <MovementsPagePlaceholder />
                      </AppShell>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/team"
                  element={
                    <PrivateRoute>
                      <AppShell sidebarContent={<Sidebar activeItem="team" />}>
                        <TeamPagePlaceholder />
                      </AppShell>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/audit"
                  element={
                    <PrivateRoute>
                      <AppShell sidebarContent={<Sidebar activeItem="audit" />}>
                        <AuditPagePlaceholder />
                      </AppShell>
                    </PrivateRoute>
                  }
                />
              </>
            )}

            {/* 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
