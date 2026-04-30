import { useNavigate } from "react-router-dom";
import { BrixoLogo } from "@/components/BrixoLogo";
import { Icon } from "@/components/Icon";
import { useAuthStore } from "@/stores/authStore";
import styles from "./LandingPage.module.css";

const stats = [
  { value: "< 10 seg", label: "por movimiento" },
  { value: "0", label: "hojas de cálculo" },
  { value: "3 pasos", label: "para empezar" },
  { value: "100%", label: "en la nube" },
];

const painPoints = [
  {
    icon: "box",
    problem: "Te quedas sin stock sin aviso",
    solution:
      "Semáforo en tiempo real: sabes cuándo actuar antes de que sea tarde.",
  },
  {
    icon: "swap",
    problem: "Nadie sabe quién movió qué",
    solution:
      "Historial inmutable por usuario. Cada entrada y salida queda registrada con nombre y hora.",
  },
  {
    icon: "users",
    problem: "Demasiado acceso para todos",
    solution:
      "Roles precisos: el operador registra, el manager revisa, el dueño controla todo.",
  },
];

const features = [
  {
    icon: "home",
    title: "Panel de control",
    description:
      "KPIs en tiempo real: productos totales, stock bajo, movimientos del día y tamaño del equipo. Todo en una pantalla.",
    tag: "Dashboard",
    highlight: "Sin buscar nada",
  },
  {
    icon: "box",
    title: "Inventario inteligente",
    description:
      "Semáforo de tres estados: en stock, al límite y stock bajo. Anticipa antes de quedarte sin producto, no después.",
    tag: "Inventario",
    highlight: "Anticipa la crisis",
  },
  {
    icon: "swap",
    title: "Movimientos en 10 segundos",
    description:
      "Entrada, salida o ajuste en tres pasos: elige tipo → selecciona producto → ingresa cantidad. Sin formularios largos.",
    tag: "Movimientos",
    highlight: "Más rápido que Excel",
  },
  {
    icon: "users",
    title: "Equipo con roles",
    description:
      "Asigna accesos por rol. El OWNER gestiona todo; el OPERATOR solo registra movimientos. Nadie ve lo que no necesita.",
    tag: "Equipo",
    highlight: "Control total",
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

const testimonials = [
  {
    quote:
      "Antes usábamos Excel y siempre había discrepancias al cierre del mes. Con Brixo el historial es en tiempo real y no hay excusas.",
    author: "Laura M.",
    role: "Dueña · Ferretería El Tornillo",
    avatar: "LM",
  },
  {
    quote:
      "Lo que más me gustó fue que mi equipo lo entendió el primer día. Sin capacitación, sin manuales. Solo entrar y usar.",
    author: "Carlos R.",
    role: "Gerente · Distribuidora Norte",
    avatar: "CR",
  },
  {
    quote:
      "Las alertas de stock bajo me salvaron de quedarme sin producto en temporada alta. No tiene precio eso.",
    author: "Sofía T.",
    role: "Propietaria · Tienda de ropa Sofía",
    avatar: "ST",
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
                  Crear empresa gratis
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroGlow} aria-hidden="true" />

        <div className={styles.heroBadge}>
          <Icon name="box" size={13} strokeWidth={2} />
          Diseñado para pymes latinoamericanas
        </div>

        <h1 className={styles.heroTitle}>
          Deja de perder dinero por
          <br />
          <span className={styles.heroAccent}>inventario mal gestionado.</span>
        </h1>

        <p className={styles.heroSubtitle}>
          Brixo es el sistema de control de stock que tu equipo entiende el
          primer día. Sin ERP. Sin hojas de cálculo. Sin capacitación.
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
          Sin tarjeta de crédito · Sin contrato · Cancela cuando quieras
        </p>

        {/* Stats bar */}
        <div className={styles.statsBar}>
          {stats.map((s) => (
            <div key={s.label} className={styles.statItem}>
              <span className={styles.statValue}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pain Points ────────────────────────── */}
      <section className={styles.pain}>
        <div className={styles.painInner}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionBadge}>¿Te suena familiar?</div>
            <h2 className={styles.sectionTitle}>
              El caos del inventario te está costando dinero
            </h2>
            <p className={styles.sectionSubtitle}>
              Cada día sin control de stock es un día regalándole dinero a
              errores que se pueden evitar.
            </p>
          </div>

          <div className={styles.painGrid}>
            {painPoints.map((p) => (
              <div key={p.problem} className={styles.painCard}>
                <div className={styles.painProblem}>
                  <span className={styles.painX}>✕</span>
                  <span>{p.problem}</span>
                </div>
                <div className={styles.painDivider} />
                <div className={styles.painSolution}>
                  <span className={styles.painCheck}>✓</span>
                  <span>{p.solution}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────── */}
      <section className={styles.features}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionBadge}>Módulos</div>
          <h2 className={styles.sectionTitle}>
            Todo lo que necesitas, nada de lo que no
          </h2>
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
              <div className={styles.featureHighlight}>
                <Icon name="box" size={12} strokeWidth={2} />
                {f.highlight}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ───────────────────────── */}
      <section className={styles.howItWorks}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionBadge}>Inicio rápido</div>
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

      {/* ── Semáforo visual ────────────────────── */}
      <section className={styles.semaphore}>
        <div className={styles.semaphoreInner}>
          <div className={styles.sectionBadge} style={{ marginBottom: 16 }}>
            Sistema de alertas
          </div>
          <h2 className={styles.semaphoreTitle}>Anticipa. No solo reportes.</h2>
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

      {/* ── Testimonials ───────────────────────── */}
      <section className={styles.testimonials}>
        <div className={styles.testimonialsInner}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionBadge}>Lo que dicen</div>
            <h2 className={styles.sectionTitle}>
              Negocios reales, resultados reales
            </h2>
          </div>

          <div className={styles.testimonialGrid}>
            {testimonials.map((t) => (
              <div key={t.author} className={styles.testimonialCard}>
                <p className={styles.testimonialQuote}>"{t.quote}"</p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.testimonialAvatar}>{t.avatar}</div>
                  <div>
                    <div className={styles.testimonialName}>{t.author}</div>
                    <div className={styles.testimonialRole}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing CTA ────────────────────────── */}
      <section className={styles.closing}>
        <div className={styles.closingGlow} aria-hidden="true" />
        <div className={styles.closingBadge}>Empieza hoy</div>
        <h2 className={styles.closingTitle}>
          Tu inventario, bajo control
          <br />
          <span className={styles.closingAccent}>desde hoy.</span>
        </h2>
        <p className={styles.closingSubtitle}>
          Cada día sin control de stock es dinero que se va. Empieza gratis, sin
          compromisos.
        </p>
        {!isAuthenticated && (
          <div className={styles.closingCtas}>
            <button
              className={styles.primaryBtn}
              onClick={() => navigate("/register")}
            >
              Crear empresa gratis
              <Icon name="arrowRight" size={18} />
            </button>
            <button
              className={styles.ghostBtn}
              onClick={() => navigate("/login")}
            >
              Ya tengo cuenta
            </button>
          </div>
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
        <p className={styles.heroNote}>
          Sin tarjeta de crédito · Sin contrato · Cancela cuando quieras
        </p>
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
