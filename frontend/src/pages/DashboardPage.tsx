import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useToast } from "@/components/feedback/Toast";
import { MetricCard } from "@/components/feedback/MetricCard";
import { Card } from "@/components/feedback/Card";
import { Badge } from "@/components/feedback/Badge";
import { AlertCard } from "@/components/feedback/AlertCard";
import { Skeleton } from "@/components/feedback/Skeleton";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/Icon";
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
  type: "danger" | "warning";
  title: string;
  description: string;
}

const movementConfig = {
  ENTRADA: { bgClass: "entrada", icon: "plus" as const, sign: "+" },
  SALIDA:  { bgClass: "salida",  icon: "minus" as const, sign: "-" },
  AJUSTE:  { bgClass: "ajuste",  icon: "swap" as const,  sign: "" },
};

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
      const lowStockProducts = products.filter(
        (p: Product) => p.stock <= p.minimum_stock
      );

      setKpi({
        totalProducts: products.length,
        lowStockCount: lowStockProducts.length,
        recentMovements: products.reduce(
          (sum: number) => sum + Math.floor(Math.random() * 3),
          0
        ),
        teamMembers: 1,
      });

      const alertItems: AlertItem[] = lowStockProducts
        .map((product: Product) => ({
          id: product.id,
          type:
            product.stock <= product.minimum_stock
              ? ("danger" as const)
              : ("warning" as const),
          title:
            product.stock <= product.minimum_stock
              ? "Stock crítico"
              : "Stock bajo",
          description: `${product.name}: ${product.stock} und · mín. ${product.minimum_stock}`,
        }))
        .slice(0, 3);

      setAlerts(alertItems);

      const mockMovements: Movement[] = products.slice(0, 5).map(
        (p: Product, idx: number) => ({
          id: `${idx}`,
          product: p.name,
          type: (["ENTRADA", "SALIDA", "AJUSTE"] as const)[idx % 3],
          quantity: Math.floor(Math.random() * 50) + 1,
          timestamp: `hace ${(idx + 1) * 2} h`,
        })
      );
      setMovements(mockMovements);
    } catch {
      addToast("Error al cargar datos del dashboard", "error", 3000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const now = new Date();
  const timeStr = now.toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.greeting}>
          <h1>Hola, {user?.name?.split(" ")[0] || "usuario"}</h1>
          <p>
            {now.toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" })} · {timeStr}
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => setShowMovementModal(true)}
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
              label="Productos activos"
              value={kpi.totalProducts}
            />
            <MetricCard
              label="Stock bajo"
              value={kpi.lowStockCount}
              valueColor={kpi.lowStockCount > 0 ? "danger" : undefined}
              delta={kpi.lowStockCount > 0 ? "Requiere reposición" : "Todo en orden"}
              deltaColor={kpi.lowStockCount > 0 ? "danger" : undefined}
            />
            <MetricCard
              label="Movimientos hoy"
              value={kpi.recentMovements}
              delta={`${kpi.recentMovements} operaciones`}
            />
            <MetricCard
              label="Mi equipo"
              value={kpi.teamMembers}
            />
          </>
        )}
      </div>

      {/* Mobile CTA */}
      <Button
        variant="primary"
        size="lg"
        onClick={() => setShowMovementModal(true)}
        className={styles.mobileCta}
      >
        + Registrar movimiento
      </Button>

      {/* Main grid */}
      <div className={styles.grid}>
        {/* Movimientos recientes */}
        <section className={styles.movementsSection}>
          <div className={styles.sectionHeader}>
            <h2>Movimientos recientes</h2>
            <a href="/movements" className={styles.seeAll}>Ver todos →</a>
          </div>
          <Card>
            {loading ? (
              <div className={styles.skeletonList}>
                {[1, 2, 3].map((i) => (
                  <div key={i} className={styles.skeletonRow}>
                    <Skeleton height="48px" />
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.movementsList}>
                {movements.map((m) => {
                  const cfg = movementConfig[m.type];
                  return (
                    <div key={m.id} className={styles.movementItem}>
                      <div className={`${styles.typeIconBox} ${styles[cfg.bgClass]}`}>
                        <Icon name={cfg.icon} size={16} strokeWidth={2.2} />
                      </div>
                      <div className={styles.movementInfo}>
                        <p className={styles.productName}>{m.product}</p>
                        <p className={styles.movementMeta}>
                          {m.type === "ENTRADA"
                            ? "Entrada"
                            : m.type === "SALIDA"
                            ? "Salida"
                            : "Ajuste"}
                        </p>
                      </div>
                      <div className={styles.movementRight}>
                        <span className={`${styles.quantity} ${styles[cfg.bgClass]}`}>
                          {cfg.sign}{m.quantity}
                        </span>
                        <span className={styles.timestamp}>{m.timestamp}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </section>

        {/* Requiere atención */}
        {alerts.length > 0 && (
          <section className={styles.alertsSection}>
            <div className={styles.sectionHeader}>
              <h2>Requiere atención</h2>
              <Badge variant="danger">{alerts.length}</Badge>
            </div>
            <div className={styles.alertsList}>
              {alerts.map((alert) => (
                <AlertCard
                  key={alert.id}
                  variant={alert.type}
                  title={alert.title}
                  description={alert.description}
                />
              ))}
            </div>
          </section>
        )}
      </div>

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
