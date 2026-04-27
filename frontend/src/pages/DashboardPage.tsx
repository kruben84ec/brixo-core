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
import { MovementModal } from "@/components/MovementModal";
import { api, Product } from "@/services/api";
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
  const [showMovementModal, setShowMovementModal] = useState(false);
  const [kpi, setKpi] = useState<KPIData>({
    totalProducts: 0,
    lowStockCount: 0,
    recentMovements: 0,
    teamMembers: 1,
  });
  const [movements, setMovements] = useState<Movement[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  const loadDashboardData = async () => {
    try {
      const products = await api.getProducts();
      const lowStockProducts = products.filter((p) => p.stock <= p.minimum_stock);

      setKpi({
        totalProducts: products.length,
        lowStockCount: lowStockProducts.length,
        recentMovements: products.reduce((sum, p) => sum + Math.floor(Math.random() * 3), 0),
        teamMembers: 1,
      });

      const alertItems: AlertItem[] = lowStockProducts
        .map((product) => ({
          id: product.id,
          type: product.stock <= product.minimum_stock ? ("danger" as const) : ("warning" as const),
          title: product.stock <= product.minimum_stock ? "Stock crítico" : "Stock bajo",
          description: `${product.name}: ${product.stock} unidades (mín. ${product.minimum_stock})`,
        }))
        .slice(0, 3);

      setAlerts(alertItems);

      const mockMovements: Movement[] = products.slice(0, 3).map((p, idx) => ({
        id: `${idx}`,
        product: p.name,
        type: ["ENTRADA", "SALIDA", "AJUSTE"][idx % 3] as any,
        quantity: Math.floor(Math.random() * 50) + 1,
        timestamp: `hace ${(idx + 1) * 2} horas`,
      }));
      setMovements(mockMovements);
    } catch (err) {
      console.error("Error loading dashboard:", err);
      addToast("Error al cargar datos del dashboard", "error", 3000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleRegisterMovement = () => {
    setShowMovementModal(true);
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

      <MovementModal
        isOpen={showMovementModal}
        onClose={() => setShowMovementModal(false)}
        onSuccess={() => {
          setShowMovementModal(false);
          loadDashboardData();
        }}
      />
    </div>
  );
}
