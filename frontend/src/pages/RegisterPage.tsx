/**
 * Página de Registro
 * - 4 campos: empresa, nombre, email, contraseña
 * - Callout índigo: "Serás el propietario"
 * - Error 409 en línea si empresa duplicada
 * - Dark mode nativo
 * - Botón CTA: "Crear empresa y empezar"
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BrixoLogo } from "@/components/BrixoLogo";
import { Button } from "@/components/primitives/Button";
import { Input } from "@/components/primitives/Input";
import { api, RegisterRequest } from "@/services/api";
import { useAuthStore } from "@/stores/authStore";
import styles from "./AuthPage.module.css";

export function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [formData, setFormData] = useState({
    tenant_name: "",
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpiar error del campo cuando empieza a escribir
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.register(formData as RegisterRequest);
      const user = {
        id: "temp",
        tenant_id: "temp",
        email: formData.email,
        name: formData.name,
        authority_level: "OWNER" as const,
        created_at: new Date().toISOString(),
      };
      setAuth(response.access_token, user);
      navigate("/dashboard");
    } catch (error: any) {
      const message = error.response?.data?.message || "Error desconocido";
      if (error.response?.status === 409) {
        setErrors({ tenant_name: "Esta empresa ya existe" });
      } else if (error.response?.status === 422) {
        // Validación de Pydantic
        setErrors({ general: message });
      } else {
        setErrors({ general: message });
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
          <h1 className={styles.title}>Registrar empresa</h1>
          <p className={styles.subtitle}>
            Inicia tu gestión de inventario en segundos
          </p>
        </div>

        {/* Callout índigo */}
        <div className={styles.callout}>
          <p>
            Serás el <strong>propietario</strong> de la empresa. Después podrás
            invitar a tu equipo.
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Grid 2 columnas: empresa + nombre */}
          <div className={styles.grid2}>
            <Input
              label="Nombre de la empresa"
              name="tenant_name"
              value={formData.tenant_name}
              onChange={handleChange}
              placeholder="Ej: Mi Tienda"
              error={errors.tenant_name}
              required
            />
            <Input
              label="Tu nombre"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej: Carlos Pérez"
              required
            />
          </div>

          {/* Email en full width */}
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
              placeholder="Mín. 8 caracteres"
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

          {/* Error general */}
          {errors.general && (
            <div className={styles.errorInline}>{errors.general}</div>
          )}

          {/* Botón primario */}
          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={loading}
            className={styles.submitButton}
          >
            Crear empresa y empezar
          </Button>

          {/* Link a login */}
          <p className={styles.switch}>
            ¿Ya tienes una cuenta?{" "}
            <a href="/login" className={styles.link}>
              Inicia sesión
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
