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

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.login(formData as LoginRequest);
      // Store token first so the interceptor includes it in the next request
      localStorage.setItem("access_token", response.access_token);
      const me = await api.getMe();
      const user = {
        id: me.id,
        tenant_id: me.tenant_id,
        email: me.email,
        username: me.username,
        authority_level: me.authority_level,
        created_at: me.created_at,
      };
      setAuth(response.access_token, user);
      navigate("/dashboard");
    } catch (err: any) {
      setError(
        err.response?.status === 401
          ? "Email o contraseña inválidos"
          : err.response?.data?.message || "Error al iniciar sesión"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.card}>
        <div className={styles.header}>
          <BrixoLogo size="lg" />
          <h1 className={styles.title}>Entrar a Brixo</h1>
          <p className={styles.subtitle}>Control simple de tu inventario.</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="Correo"
            name="email"
            type="email"
            icon="mail"
            value={formData.email}
            onChange={handleChange}
            placeholder="tu@empresa.com"
            required
          />

          <div className={styles.passwordField}>
            <Input
              label="Contraseña"
              name="password"
              type={showPassword ? "text" : "password"}
              icon="lock"
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

          <div className={styles.forgotRow}>
            <a href="#" className={styles.forgotLink}>
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          {error && <div className={styles.errorInline}>{error}</div>}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className={styles.submitButton}
          >
            Iniciar sesión
          </Button>

          <p className={styles.switch}>
            ¿No tienes cuenta?{" "}
            <a href="/register" className={styles.link}>
              Crea una empresa
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
