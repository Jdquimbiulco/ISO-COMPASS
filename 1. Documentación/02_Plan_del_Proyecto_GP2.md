# PLAN DEL PROYECTO (PROJECT PLAN)
**Código de Producto de Trabajo:** `GP-PLAN-002` (Actividades GP.1 y GP.2 — ISO/IEC 29110-5-1-2)  
**Estado:** `[APROBADO Y REVISADO POR EL EQUIPO EN IS.1]`  
**Versión:** 2.0 (Noviembre 2026)  
**Responsable:** Juan Quimbiulco (Gestor de Proyecto - GP)

---

## 1. Estructura Organizacional y Asignación de Roles (ISO/IEC 29110)

| Integrante | Rol ISO/IEC 29110 | Sigla | Responsabilidades Técnicas y de Calidad |
| :--- | :--- | :---: | :--- |
| **Juan Quimbiulco** | Gestor de Proyecto / Programador Backend | **GP / PR** | Configuración de Supabase y `.env`, esquema Prisma y seed, autenticación cifrada, roles RBAC, Módulo M7 (Usuarios y Familias extensibles), paráfrasis normas 1-1, 3-1 y 3-2, artefactos GP. |
| **Martín Cordero** | Líder Técnico | **LT** | Arquitectura en 3 capas, buscador y mapa interactivo de la familia (M1), fichas técnicas y avisos de copyright (M2, M3), paráfrasis normas 1-2, 2-1 y 5-1-4, manual técnico. |
| **Stiven Díaz** | Programador Frontend | **PR** | Listas de verificación interactivas y evidencias (M4), gráficos interactivos de cumplimiento en tablero (M5), paráfrasis normas 5-1-1, 5-1-2 y 5-4, manual de usuario. |
| **Alex Cuzco** | Analista y Diseñador / QA | **AN / DIS** | Exportación de reportes PDF con membrete ESPE y CSV/Excel (M6), evaluación piloto *AndesTech Solutions*, pruebas automatizadas, paráfrasis normas 4-1, 5-1-3, 5-3 y 5-6-1/2. |

---

## 2. Estimación de Esfuerzo y Calendario del Proyecto (Cronograma)

El proyecto se ejecuta en un horizonte de **2 semanas (14 días efectivos)** dividido en 3 iteraciones alineadas con la Tabla 8 de la guía:

| Fase / Semana | Tareas del Perfil Básico | Productos Esperados | Esfuerzo Estimado | Estado |
| :--- | :--- | :--- | :---: | :---: |
| **Semana 1 (Días 1-5)**<br>*Planificación y Análisis* | **GP.1, IS.1, IS.2:** Conformar equipo, revisar Enunciado del Trabajo, elaborar Plan del Proyecto, investigar las 13 normas y validar SRS. | • Enunciado del Trabajo `[Revisado]`<br>• Plan del Proyecto `[Aprobado]`<br>• SRS `[Validado]` | 24 horas-persona | **100% Completado** |
| **Semana 2 (Días 6-10)**<br>*Diseño y Construcción* | **IS.3, IS.4, GP.2:** Diseñar arquitectura en 3 capas y modelo Prisma en Supabase; construir módulos M1 a M5; cargar seed de las 13 normas con paráfrasis. | • Diseño y Modelo de Datos<br>• Módulos M1, M2, M3, M4, M5<br>• Base de datos en Supabase | 40 horas-persona | **100% Completado** |
| **Semana 2-3 (Días 11-14)**<br>*Integración, M6/M7, QA y Cierre* | **IS.5, IS.6, GP.3, GP.4:** Completar M6 (Reportes) y M7 (Admin RBAC y extensibilidad); ejecutar pruebas unitarias; evaluar *AndesTech Solutions* y firmar Acta de Aceptación. | • Módulos M6 y M7 operativos<br>• Informe de Pruebas Automatizadas<br>• Acta de Aceptación `[Firmada]` | 28 horas-persona | **100% Completado** |

---

## 3. Recursos Tecnológicos y Entorno de Ingeniería
* **Frontend y Presentación:** Next.js 14 (App Router), React 18, TypeScript 5, Tailwind CSS, Lucide Icons, Recharts.
* **Lógica de Dominio (`src/core/`):** TypeScript puro desacoplado de UI y ORM (`compliance-calculator.ts`, `status-evaluator.ts`, `gap-analyzer.ts`, `rbac.ts`).
* **Persistencia y Base de Datos:** PostgreSQL hospedado en **Supabase** (Pooler transaccional puerto 6543 y conexión directa puerto 5432) gestionado mediante **Prisma ORM v5.22**.
* **Seguridad (RNF-03):** Contraseñas cifradas con `bcryptjs` (factor de costo 10) y tokens de sesión firmados con `HMAC-SHA256`.
* **Pruebas Automatizadas y CI/CD:** `node:test` nativo y pipeline automatizado en `.github/workflows/ci.yml`.

---

## 4. Matriz de Gestión de Riesgos (GP.1 / GP.2)

| ID | Descripción del Riesgo | Probabilidad | Impacto | Estrategia de Mitigación y Contingencia | Responsable |
| :--- | :--- | :---: | :---: | :--- | :---: |
| **R-01** | Penalización académica por copia textual de normas ISO con copyright (Sección 10). | Baja | Crítico | Asignar 3 a 4 normas por integrante para redacción con paráfrasis propia verificada y citas APA 7 en `iso-29110-standards.json`. | GP / Todo el equipo |
| **R-02** | Error de división por cero en la fórmula matemática cuando todos los ítems se marcan como `NA` ($T - NA = 0$). | Media | Alto | Implementar cláusula de guarda en `calculateCompliance` que retorne `0.00%` y estado `NOT_STARTED`, verificada con test unitario. | PR / AN |
| **R-03** | Intermitencia o bloqueo de red hacia el pooler de Supabase durante la demostración en laboratorio (RNF-04). | Media | Alto | Implementar arquitectura híbrida en `StandardsService`, `AuthService` y `AdminService` que sincroniza con Supabase y mantiene caché local instantánea (<50ms). | Juan Quimbiulco (GP) |
| **R-04** | Redistribución accidental de PDFs de pago protegidos por derechos de autor de ISO. | Baja | Crítico | Prohibir archivos PDF de normas en el repositorio; configurar `accessType` (`FREE` vs `ISO_PAID`) para enlazar siempre al portal oficial `iso.org`. | Martín Cordero (LT) |

---

## 5. Estrategia de Control de Versiones y Respaldos (GP.2)
1. **Repositorio Central:** GitHub con rama principal protegida `main` y flujo de ramas por módulo (`feature/m1-biblioteca`, `feature/m7-admin-rbac`).
2. **Integración Continua:** Ejecución obligatoria del workflow `.github/workflows/ci.yml` (`prisma generate`, `npm test`, `npm run build`) en cada commit.
3. **Política de Respaldos:** Respaldo automático diario en Supabase Cloud PostgreSQL más instantánea versionada del catálogo completo en `prisma/seed-data/iso-29110-standards.json`.
