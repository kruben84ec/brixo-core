/**
 * Página de Dashboard
 * - Saludo personalizado
 * - 4 KPIs: productos, stock bajo, movimientos, usuarios
 * - Sección "Requiere atención" con alertas coloreadas
 * - Últimos movimientos
 * - Botón "+ Registrar movimiento" destacado
 */

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useToast } from "@/components/feedback/Toast";
import { MetricCard } from "@/components/feedback/MetricCard";
import { Card } from "@/components/feedback/Card";
import { Badge } from "@/components/feedback/Badge";
import { AlertCard } from "@/components/feedback/AlertCard";
import { Skeleton } from "@/components/feedback/Skeleton";
import { Button } from "@/components/primitives/Button";
import styles from "./DashboardPage.module.css";

interface KPIData {
  totalProducts: number;
  lowStockCount: number;
  recentMovements: number;
  teamMembers: number;
}

interface Movement {
  id: string;
  product: string;
  type: "ENTRADA" | "SALIDA" | "AJUSTE";
  quantity: number;
  timestamp: string;
}

interface AlertItem {
  id: string;
  type: "danger" | "warning" | "info";
  title: string;
  description: string;
}

export function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [kpi, setKpi] = useState<KPIData>({
    totalProducts: 0,
    lowStockCount: 0,
    recentMovements: 0,
    teamMembers: 1,
  });
  const [movements, setMovements] = useState<Movement[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  // Simular carga de datos
  useEffect(() => {
    const timer = setTimeout(() => {
      setKpi({
        totalProducts: 24,
        lowStockCount: 3,
        recentMovements: 12,
        teamMembers: 1,
      });
      setMovements([
        {
          id: "1",
          product: "Camiseta roja",
          type: "ENTRADA",
          quantity: 50,
          timestamp: "hace 2 horas",
        },
        {
          id: "2",
          product: "Pantalón azul",
          type: "SALIDA",
          quantity: 5,
          timestamp: "hace 4 horas",
        },
        {
          id: "3",
          product: "Gorro blanco",
          type: "AJUSTE",
          quantity: -2,
          timestamp: "hace 6 horas",
        },
      ]);
      setAlerts([
        {
          id: "1",
          type: "danger",
          title: "Stock crítico",
          description: "Camiseta roja: 2 unidades (mín. 5)",
        },
        {
          id: "2",
          type: "warning",
          title: "Stock bajo",
          description: "Pantalón azul: 8 unidades (mín. 10)",
        },
        {
          id: "3",
          type: "warning",
          title: "Stock bajo",
          description: "Gorro blanco: 3 unidades (mín. 5)",
        },
      ]);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleRegisterMovement = () => {
    addToast("Próximamente: Modal de movimientos", "info", 3000);
  };

  const now = new Date();
  const timeStr = now.toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={styles.dashboard}>
      {/* Header con saludo */}
      <div className={styles.header}>
        <div className={styles.greeting}>
          <h1>Hola, {user?.name || "usuario"}</h1>
          <p>
            {user?.name?.split(" ")[0]}'s Tienda • {now.toLocaleDateString("es-CO")} •{" "}
            {timeStr}
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={handleRegisterMovement}
          className={styles.cta}
        >
          + Registrar movimiento
        </Button>
      </div>

      {/* KPIs */}
      <div className={styles.metrics}>
        {loading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <Skeleton height="80px" />
              </Card>
            ))}
          </>
        ) : (
          <>
            <MetricCard
              label="Productos"
              value={kpi.totalProducts}
              icon="📦"
              color="info"
            />
            <MetricCard
              label="Stock bajo"
              value={kpi.lowStockCount}
              icon="⚠️"
              color="danger"
            />
            <MetricCard
              label="Movimientos (hoy)"
              value={kpi.recentMovements}
              icon="↔️"
              color="success"
            />
            <MetricCard
              label="Mi equipo"
              value={kpi.teamMembers}
              icon="👥"
              color="info"
            />
          </>
        )}
      </div>

      {/* Requiere atención */}
      {alerts.length > 0 && (
        <section className={styles.alerts}>
          <h2>Requiere atención</h2>
          <div className={styles.alertsGrid}>
            {alerts.map((alert) => (
              <AlertCard
                key={alert.id}
                variant={alert.type}
                title={alert.title}
                description={alert.description}
                icon={alert.type === "danger" ? "🔴" : "🟡"}
              />
            ))}
          </div>
        </section>
      )}

      {/* Últimos movimientos */}
      <section className={styles.movements}>
        <h2>Últimos movimientos</h2>
        <Card>
          {loading ? (
            <div className={styles.loading}>
              {[1, 2, 3].map((i) => (
                <div key={i} className={styles.skeletonRow}>
                  <Skeleton height="40px" />
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.movementsList}>
              {movements.map((m) => (
                <div key={m.id} className={styles.movementItem}>
                  <div
                    className={`${styles.typeCircle} ${styles[m.type.toLowerCase()]}`}
                  />
                  <div className={styles.movementInfo}>
                    <p className={styles.productName}>{m.product}</p>
                    <p className={styles.timestamp}>{m.timestamp}</p>
                  </div>
                  <div className={styles.movementMeta}>
                    <Badge variant={m.type === "ENTRADA" ? "success" : "danger"}>
                      {m.type}
                    </Badge>
                    <span className={styles.quantity}>
                      {m.type === "ENTRADA" ? "+" : ""}{m.quantity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
        <div className={styles.viewAll}>
          <a href="/movements">Ver todos →</a>
        </div>
      </section>
    </div>
  );
}
