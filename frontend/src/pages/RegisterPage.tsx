import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BrixoLogo } from "@/components/BrixoLogo";
import { Button } from "@/components/primitives/Button";
import { Input } from "@/components/primitives/Input";
import { Icon } from "@/components/Icon";
import { api, RegisterRequest } from "@/services/api";
import { useAuthStore } from "@/stores/authStore";
import styles from "./AuthPage.module.css";

export function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [formData, setFormData] = useState({
    tenant_name: "",
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.register({
        company_name: formData.tenant_name,
        username: formData.username,
        email: formData.email,
        password: formData.password,
      } as RegisterRequest);
      const user = {
        id: response.user_id,
        tenant_id: response.tenant_id,
        email: response.email,
        username: response.username,
        authority_level: response.authority_level,
        created_at: new Date().toISOString(),
      };
      setAuth(response.access_token, user);
      navigate("/dashboard");
    } catch (error: any) {
      if (error.response?.status === 409) {
        setErrors({ tenant_name: "Esta empresa ya existe" });
      } else {
        setErrors({
          general: error.response?.data?.message || "Error al crear la cuenta",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.card}>
        <div className={styles.header}>
          <BrixoLogo size="lg" />
          <h1 className={styles.title}>Crea tu empresa</h1>
          <p className={styles.subtitle}>
            Sin capacitación. Sin complejidad. Listo en un minuto.
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="Nombre de la empresa"
            name="tenant_name"
            icon="building"
            value={formData.tenant_name}
            onChange={handleChange}
            placeholder="Ej: Café de la Esquina"
            error={errors.tenant_name}
            required
          />
          <Input
            label="Tu nombre"
            name="username"
            icon="user"
            value={formData.username}
            onChange={handleChange}
            placeholder="Ej: Laura Jaramillo"
            required
          />
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
              placeholder="Mín. 8 caracteres"
              helperText="Incluye una mayúscula y un número."
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

          <div className={styles.callout}>
            <span className={styles.calloutIcon}>
              <Icon name="arrowRight" size={16} strokeWidth={2.5} />
            </span>
            <p>
              Serás el <strong>propietario</strong> de la empresa. Después
              podrás invitar a tu equipo.
            </p>
          </div>

          {errors.general && (
            <div className={styles.errorInline}>{errors.general}</div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className={styles.submitButton}
          >
            Crear empresa y empezar
          </Button>

          <p className={styles.switch}>
            ¿Ya tienes cuenta?{" "}
            <a href="/login" className={styles.link}>
              Inicia sesión
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
