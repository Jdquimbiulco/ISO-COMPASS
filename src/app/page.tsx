import Link from 'next/link';
import { ArrowDown, ArrowRight, ArrowUpRight, BarChart3, BookOpen, CheckSquare, Compass, Layers3, Workflow } from 'lucide-react';
import styles from './home.module.css';

const modules = [
  {
    href: '/biblioteca',
    name: 'Biblioteca digital',
    description: 'Consulta las 13 partes de la serie, sus fichas técnicas y los enlaces oficiales.',
    icon: BookOpen,
  },
  {
    href: '/evaluaciones',
    name: 'Listas de verificación',
    description: 'Revisa los criterios de cada norma y registra los resultados por organización.',
    icon: CheckSquare,
  },
  {
    href: '/tablero',
    name: 'Tablero de cumplimiento',
    description: 'Consulta los porcentajes de avance y las brechas que quedan por atender.',
    icon: BarChart3,
  },
];

export default function HomePage() {
  return (
    <div className={styles.site}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.wordmark}>
            <span className={styles.wordmarkIcon}><Compass size={23} aria-hidden="true" /></span>
            ISO-COMPASS
          </Link>
          <nav aria-label="Navegación principal" className={styles.navigation}>
            <Link href="/biblioteca">Biblioteca</Link>
            <Link href="/evaluaciones">Evaluaciones</Link>
            <Link href="/tablero">Tablero</Link>
          </nav>
          <Link href="/login" className={styles.access}>
            Iniciar sesión <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.hero} aria-labelledby="home-title">
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Guía para equipos pequeños</p>
            <h1 id="home-title">Evalúa con <span>ISO/IEC 29110.</span></h1>
            <p className={styles.introduction}>
              Encuentra la norma que necesitas, registra las evidencias de tu equipo y consulta
              el avance de cada evaluación.
            </p>
            <div className={styles.actions}>
              <Link href="/biblioteca" className={styles.primary}>
                Explorar biblioteca <ArrowRight size={19} aria-hidden="true" />
              </Link>
              <Link href="#modulos" className={styles.secondary}>
                Ver módulos <ArrowDown size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className={styles.heroPanel}>
            <div className={styles.panelContent}>
              <p className={styles.panelLabel}><Layers3 size={17} aria-hidden="true" /> Normas y procesos</p>
              <div className={styles.preview}>
                <div className={styles.previewHeading}>
                  <span className={styles.previewIcon}><BookOpen size={22} aria-hidden="true" /></span>
                  <div>
                    <p className={styles.standardCode}>ISO/IEC TR 29110-5-1-2</p>
                    <h2>Perfil Básico</h2>
                  </div>
                </div>
                <ul className={styles.processes}>
                  <li><span>GP</span> Gestión del Proyecto</li>
                  <li><span>IS</span> Implementación de Software</li>
                </ul>
                <Link href="/normas/29110-5-1-2" className={styles.previewLink}>
                  Ver ficha del Perfil Básico <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="modulos" className={styles.modules} aria-labelledby="modules-title">
          <div className={styles.modulesHeading}>
            <Workflow size={20} aria-hidden="true" />
            <h2 id="modules-title">Módulos de trabajo</h2>
          </div>
          <ul className={styles.moduleGrid}>
            {modules.map(({ href, name, description, icon: Icon }) => (
              <li key={href}>
                <Link href={href} className={styles.module}>
                  <span className={styles.moduleIcon}><Icon size={21} aria-hidden="true" /></span>
                  <span className={styles.moduleName}>{name}</span>
                  <span className={styles.moduleDescription}>{description}</span>
                  <ArrowUpRight className={styles.moduleArrow} size={19} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className={styles.footer}>
        <div>
          <p><strong>ISO-COMPASS</strong> <span>·</span> Universidad de las Fuerzas Armadas ESPE</p>
          <Link href="/reportes">Reportes <ArrowUpRight size={14} aria-hidden="true" /></Link>
          <Link href="/admin">Administración <ArrowUpRight size={14} aria-hidden="true" /></Link>
        </div>
      </footer>
    </div>
  );
}
