import { useNavigate } from "react-router-dom";
import { BrixoLogo } from "@/components/BrixoLogo";
import { Icon } from "@/components/Icon";
import { useAuthStore } from "@/stores/authStore";
import styles from "./LandingPage.module.css";

const features = [
  {
    icon: "home",
    title: "Panel de control",
    description:
      "KPIs en tiempo real: productos totales, stock bajo, movimientos del día y tamaño del equipo. Todo en una pantalla sin tener que buscar.",
    tag: "Dashboard",
  },
  {
    icon: "box",
    title: "Inventario inteligente",
    description:
      "Semáforo de tres estados: en stock, al límite y stock bajo. Anticipa antes de quedarte sin producto, no después.",
    tag: "Inventario",
  },
  {
    icon: "swap",
    title: "Movimientos en 10 segundos",
    description:
      "Entrada, salida o ajuste en tres pasos: elige tipo → selecciona producto → ingresa cantidad. Sin formularios largos.",
    tag: "Movimientos",
  },
  {
    icon: "users",
    title: "Equipo con roles",
    description:
      "Asigna accesos por rol. El OWNER gestiona todo; el OPERATOR solo registra movimientos. Nadie ve lo que no necesita.",
    tag: "Equipo",
  },
];

const steps = [
  {
    number: "01",
    title: "Crea tu empresa",
    description:
      "Registra tu negocio en un minuto. Serás el propietario y podrás invitar a tu equipo después.",
  },
  {
    number: "02",
    title: "Agrega tus productos",
    description:
      "Nombre, SKU y stock mínimo. El sistema te avisará cuando un producto se acerque al límite.",
  },
  {
    number: "03",
    title: "Registra movimientos",
    description:
      "Entradas, salidas y ajustes en segundos. El historial se guarda solo, sin hojas de cálculo.",
  },
];

export function LandingPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <div className={styles.page}>
      {/* ── Header ─────────────────────────────── */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <a href="/" className={styles.brand}>
            <BrixoLogo size="sm" variant="solid" />
            <span className={styles.brandName}>Brixo</span>
          </a>

          <nav className={styles.nav}>
            {isAuthenticated ? (
              <button
                className={styles.ctaBtn}
                onClick={() => navigate("/dashboard")}
              >
                Ir al panel
                <Icon name="arrowRight" size={15} />
              </button>
            ) : (
              <>
                <button
                  className={styles.navLink}
                  onClick={() => navigate("/login")}
                >
                  Iniciar sesión
                </button>
                <button
                  className={styles.ctaBtn}
                  onClick={() => navigate("/register")}
                >
                  Crear empresa
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroBadge}>
          <Icon name="box" size={13} strokeWidth={2} />
          Control de inventario para pymes
        </div>

        <h1 className={styles.heroTitle}>
          Control de stock sin
          <br />
          <span className={styles.heroAccent}>complejidad.</span>
        </h1>

        <p className={styles.heroSubtitle}>
          Sin ERP. Sin capacitación. Sin hojas de cálculo. Brixo es el sistema
          de inventario que tu equipo entiende el primer día.
        </p>

        <div className={styles.heroCtas}>
          {isAuthenticated ? (
            <button
              className={styles.primaryBtn}
              onClick={() => navigate("/dashboard")}
            >
              Ir a mi panel
              <Icon name="arrowRight" size={18} />
            </button>
          ) : (
            <>
              <button
                className={styles.primaryBtn}
                onClick={() => navigate("/register")}
              >
                Crea tu empresa gratis
                <Icon name="arrowRight" size={18} />
              </button>
              <button
                className={styles.ghostBtn}
                onClick={() => navigate("/login")}
              >
                Iniciar sesión
              </button>
            </>
          )}
        </div>

        <p className={styles.heroNote}>
          Sin tarjeta de crédito · Listo en menos de un minuto
        </p>
      </section>

      {/* ── Features ───────────────────────────── */}
      <section className={styles.features}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Todo lo que necesitas</h2>
          <p className={styles.sectionSubtitle}>
            Cuatro módulos diseñados para el ciclo real de un negocio con
            inventario.
          </p>
        </div>

        <div className={styles.featureGrid}>
          {features.map((f) => (
            <div key={f.tag} className={styles.featureCard}>
              <div className={styles.featureTop}>
                <div className={styles.featureIcon}>
                  <Icon name={f.icon} size={20} strokeWidth={1.8} />
                </div>
                <span className={styles.featureTag}>{f.tag}</span>
              </div>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureDesc}>{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ───────────────────────── */}
      <section className={styles.howItWorks}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Empezar toma un minuto</h2>
          <p className={styles.sectionSubtitle}>
            Sin instalación. Sin configuración. Sin soporte técnico.
          </p>
        </div>

        <div className={styles.steps}>
          {steps.map((step, i) => (
            <div key={step.number} className={styles.step}>
              <div className={styles.stepNumber}>{step.number}</div>
              {i < steps.length - 1 && (
                <div className={styles.stepConnector} />
              )}
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Semaforo visual ────────────────────── */}
      <section className={styles.semaphore}>
        <div className={styles.semaphoreInner}>
          <h2 className={styles.semaphoreTitle}>
            Anticipa. No solo reportes.
          </h2>
          <p className={styles.semaphoreSubtitle}>
            La mayoría de sistemas te avisan cuando ya es tarde. Brixo usa un
            semáforo de tres estados para que actúes antes de la crisis.
          </p>
          <div className={styles.semaphoreCards}>
            <div className={`${styles.statusCard} ${styles.statusGreen}`}>
              <div className={styles.statusDot} />
              <div>
                <div className={styles.statusLabel}>En stock</div>
                <div className={styles.statusDesc}>
                  Por encima del mínimo con holgura
                </div>
              </div>
            </div>
            <div className={`${styles.statusCard} ${styles.statusAmber}`}>
              <div className={styles.statusDot} />
              <div>
                <div className={styles.statusLabel}>Al límite</div>
                <div className={styles.statusDesc}>
                  Cerca del mínimo — conviene anticipar
                </div>
              </div>
            </div>
            <div className={`${styles.statusCard} ${styles.statusRed}`}>
              <div className={styles.statusDot} />
              <div>
                <div className={styles.statusLabel}>Stock bajo</div>
                <div className={styles.statusDesc}>
                  Bajo el mínimo — requiere acción ahora
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Closing CTA ────────────────────────── */}
      <section className={styles.closing}>
        <h2 className={styles.closingTitle}>
          Tu inventario, bajo control hoy.
        </h2>
        <p className={styles.closingSubtitle}>
          Sin capacitación. Sin complejidad. Listo en un minuto.
        </p>
        {!isAuthenticated && (
          <button
            className={styles.primaryBtn}
            onClick={() => navigate("/register")}
          >
            Crear empresa gratis
            <Icon name="arrowRight" size={18} />
          </button>
        )}
        {isAuthenticated && (
          <button
            className={styles.primaryBtn}
            onClick={() => navigate("/dashboard")}
          >
            Ir a mi panel
            <Icon name="arrowRight" size={18} />
          </button>
        )}
      </section>

      {/* ── Footer ─────────────────────────────── */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <BrixoLogo size="sm" variant="line" />
            <span className={styles.footerBrandName}>Brixo</span>
          </div>
          <p className={styles.footerTagline}>
            Control de inventario simple para pequeños negocios.
          </p>
          <div className={styles.footerLinks}>
            <button
              className={styles.footerLink}
              onClick={() => navigate("/login")}
            >
              Iniciar sesión
            </button>
            <span className={styles.footerDivider}>·</span>
            <button
              className={styles.footerLink}
              onClick={() => navigate("/register")}
            >
              Crear empresa
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
