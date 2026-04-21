/**
 * Página de Login
 * - Email + contraseña
 * - Toggle para mostrar/ocultar contraseña
 * - Error 401 en línea
 * - Dark mode nativo
 * - Botón CTA: "Iniciar sesión"
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BrixoLogo } from "@/components/BrixoLogo";
import { Button } from "@/components/primitives/Button";
import { Input } from "@/components/primitives/Input";
import { api, LoginRequest } from "@/services/api";
import { useAuthStore } from "@/stores/authStore";
import styles from "./AuthPage.module.css";

export function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpiar error cuando empieza a escribir
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.login(formData as LoginRequest);
      const user = {
        id: "temp",
        tenant_id: "temp",
        email: formData.email,
        name: "Usuario",
        authority_level: "OWNER" as const,
        created_at: new Date().toISOString(),
      };
      setAuth(response.access_token, user);
      navigate("/dashboard");
    } catch (err: any) {
      const message = err.response?.data?.message || "Email o contraseña inválidos";
      if (err.response?.status === 401) {
        setError("Email o contraseña inválidos");
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.container}>
        {/* Logo y título */}
        <div className={styles.header}>
          <BrixoLogo size="md" />
          <h1 className={styles.title}>Iniciar sesión</h1>
          <p className={styles.subtitle}>
            Accede a tu inventario desde cualquier lugar
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="tu@email.com"
            required
          />

          {/* Contraseña con toggle */}
          <div className={styles.passwordField}>
            <Input
              label="Contraseña"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              placeholder="Tu contraseña"
              required
            />
            <button
              type="button"
              className={styles.togglePassword}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Ocultar" : "Mostrar"}
            </button>
          </div>

          {/* Error inline */}
          {error && <div className={styles.errorInline}>{error}</div>}

          {/* Botón primario */}
          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={loading}
            className={styles.submitButton}
          >
            Iniciar sesión
          </Button>

          {/* Link a registro */}
          <p className={styles.switch}>
            ¿No tienes cuenta?{" "}
            <a href="/register" className={styles.link}>
              Registrate gratis
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
