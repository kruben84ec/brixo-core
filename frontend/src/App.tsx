import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { authStore } from '@/stores/authStore';

function App() {
  // Hidratar al cargar la app
  useEffect(() => {
    authStore.hydrate();
  }, []);

  const { user } = authStore();
  const isAuthenticated = !!user;

  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <div>Login Page (TODO)</div>}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <div>Register Page (TODO)</div>}
        />

        {/* Rutas privadas */}
        <Route
          path="/dashboard"
          element={isAuthenticated ? <div>Dashboard (TODO)</div> : <Navigate to="/login" />}
        />
        <Route
          path="/inventory"
          element={isAuthenticated ? <div>Inventory (TODO)</div> : <Navigate to="/login" />}
        />

        {/* Redirect raíz */}
        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
