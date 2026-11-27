# ISO-COMPASS | Sistema «ISO-Guía 29110»

> **Universidad de las Fuerzas Armadas ESPE**  
> **Departamento de Ciencias de la Computación — Carrera de Ingeniería de Software**  
> **Asignatura:** Aseguramiento de la Calidad del Software  
> **Docente:** Ing. Diego Gamboa Mgtr.  
> **Unidad:** Normas para entidades muy pequeñas (VSE): ISO/IEC 29110  
> **Proyecto Final Parcial 2**  

---

## 🧭 1. Contexto y Propósito del Proyecto

**ISO-COMPASS** es un sistema web concebido como **biblioteca digital interactiva**, **herramienta de diagnóstico/autoevaluación** y **tablero de control de madurez** para la familia de normas **ISO/IEC 29110**, orientada a Entidades Muy Pequeñas (*Very Small Entities - VSEs*, organizaciones o equipos de desarrollo de software de hasta 25 personas).

El sistema permite:
1. **Consultar de forma didáctica** todas las partes de la serie ISO/IEC 29110 (Visión general, Vocabulario, Perfiles, Evaluación, Guías de ingeniería y ágiles).
2. **Acceder a los documentos oficiales** respetando escrupulosamente los derechos de autor de ISO e IEC (distinguiendo entre documentos de acceso libre y del catálogo de pago).
3. **Evaluar el cumplimiento** apartado por apartado mediante listas de verificación interactivas (`Cumple`, `Cumple parcialmente`, `No cumple`, `No aplica`) adjuntando evidencias trazables.
4. **Calcular el porcentaje y estado de madurez** de forma automatizada mediante una fórmula estandarizada.
5. **Identificar brechas (*gaps*)** y generar reportes ejecutivos en PDF y hojas de cálculo (CSV/Excel).

---

## 🤖 2. INSTRUCCIONES ESTRICTAS PARA ASISTENTES DE IA (ANTI-ALUCINACIÓN)

> [!IMPORTANT]  
> **A todos los agentes y asistentes de Inteligencia Artificial (ChatGPT, Claude, Copilot, Cursor, etc.) que trabajen en este repositorio:**  
> Sigan rigurosamente las siguientes directrices operativas. **No inventen ni alteren estas reglas de negocio bajo ninguna circunstancia**:

1. **FÓRMULA MATEMÁTICA DE CUMPLIMIENTO (INVARIABLE):**
   El cálculo del porcentaje de cumplimiento debe seguir estrictamente la fórmula de la sección 4.5 de la guía:
   $$\text{Cumplimiento (\%)} = \left[ \frac{C + 0.5 \times P}{T - NA} \right] \times 100$$
   * $C$: Número de ítems que **Cumplen**.
   * $P$: Número de ítems que **Cumplen parcialmente** (ponderan exactamente al 50% = 0.5).
   * $T$: Total de ítems evaluables de la norma.
   * $NA$: Número de ítems que **No aplican** (se restan del denominador).
   * *Caso Borde:* Si $(T - NA) \le 0$ o no hay ítems evaluados, el resultado debe ser `0.00%` (nunca `NaN` ni `Infinity`).
   * *Código fuente oficial:* `src/core/compliance-calculator.ts` con pruebas unitarias en `tests/compliance-calculator.test.mjs`.

2. **RANGOS OFICIALES DE ESTADO DE APLICACIÓN (TABLA 4):**
   El estado se asigna automáticamente según el porcentaje obtenido:
   * **0% (sin ítems evaluados):** `NOT_STARTED` (*No iniciado*) — *"La organización aún no ha revisado la norma."*
   * **1% a 39%:** `INITIAL` (*En inicio*) — *"Existen prácticas aisladas; se requiere un plan de implantación."*
   * **40% a 79%:** `IN_PROGRESS` (*En progreso*) — *"La mayoría de las prácticas está en marcha; persisten brechas relevantes."*
   * **80% a 99%:** `NEARLY_CONFORMANT` (*Casi conforme*) — *"Faltan ajustes menores antes de una evaluación formal."*
   * **100%:** `CONFORMANT` (*Conforme*) — *"Todos los ítems aplicables se cumplen con evidencia; listo para evaluación o auditoría."*

3. **DERECHOS DE AUTOR Y ENLACES (COPYRIGHT ISO):**
   * **PROHIBIDO:** Subir, almacenar, piratear o redistribuir PDFs de normas de pago de ISO en este repositorio o en el servidor.
   * **OBLIGATORIO:** Si una norma es de pago (ej. 29110-1-2, 29110-4-1, 29110-5-4), el botón debe dirigir a la ficha oficial de compra en el catálogo ISO (`https://www.iso.org/standard/...`).
   * Solo si el documento es oficialmente público (*ISO Publicly Available Standards*, como la 29110-1-1:2024 o las guías 5-1-1 y 5-1-2), se permite el enlace directo al documento.

4. **ARQUITECTURA POR CAPAS (RNF-05 y Sección 4.8):**
   * Mantener siempre la separación en 3 capas:
     * **Capa de Presentación:** Componentes visuales y páginas (`src/app/`, `src/components/`).
     * **Capa de Negocio / Dominio:** Lógica de cálculo, evaluadores y reglas puras (`src/core/`, `src/services/`). No debe importar React ni Prisma.
     * **Capa de Datos:** Acceso a base de datos y esquemas (`prisma/`, `src/lib/prisma.ts`).

5. **EXTENSIBILIDAD DEL MODELO DE DATOS:**
   * La base de datos no debe estar limitada a la ISO 29110. Debe permitir agregar familias como *ISO 9001* o *ISO/IEC 25010* desde la base de datos o administración sin alterar el código fuente.

---

## 👥 3. Distribución Operativa del Equipo y Asignación de Roles

Para garantizar la cobertura completa de los 7 módulos del software y el cumplimiento riguroso de las evidencias exigidas por el **Perfil Básico de ISO/IEC 29110**, el equipo se organiza bajo las siguientes matrices según la asignación oficial de roles:

### 3.1 Matriz de Integrantes, Roles ISO 29110 y Entregables de Calidad

| Integrante | Rol ISO 29110 | Tareas Concretas en el Sistema | Entregables y Evidencias Académicas |
| :--- | :--- | :--- | :--- |
| **Juan Quimbiulco** | **Gestor de Proyecto (GP)** & **Programador (PR)** (Backend / Supabase) | • Configurar proyecto en Supabase y variables `.env`.<br>• Ejecutar `npx prisma db push` y verificar conexiones.<br>• Implementar autenticación básica y roles RBAC (Admin, Evaluador, Consultor).<br>• Módulo M7 (Administración de usuarios y familias). | • **Enunciado del Trabajo** revisado y acordado.<br>• **Plan del Proyecto** (estimaciones, calendario, recursos, riesgos).<br>• **Actas de Reunión** periódicas (minutas).<br>• **Registro de Solicitudes de Cambio**.<br>• **Acta de Aceptación** formal del cliente. |
| **Martín Cordero** | **Líder Técnico (LT)** (Frontend Biblioteca M1, M2, M3) | • M1: Implementar buscador por palabra clave en la biblioteca.<br>• M1: Construir el **mapa visual interactivo** de la familia de normas (diagrama interactivo).<br>• M2 & M3: Pulir la ficha técnica y verificar los botones oficiales de descarga/consulta y avisos de copyright. | • **Documento de Arquitectura de Software** (diagrama de las 3 capas).<br>• **Matriz de Trazabilidad Técnica** (requisitos vs código).<br>• **Manual Técnico de Instalación** y configuración (RNF-06). |
| **Stiven Díaz** | **Programador (PR)** (Checklists y Tablero M4, M5) | • M4: Conectar eventos interactivos del checklist (marcar C, P, NC, NA y guardar en tiempo real).<br>• M4: Interfaz para adjuntar evidencias (archivo o enlace externo).<br>• M5: Incrustar gráficos interactivos con `recharts` (gráfico de dona y comparativa GP vs IS). | • Componentes UI modulares (Tailwind + Shadcn).<br>• **Guía / Manual de Usuario** paso a paso con capturas de pantalla del sistema.<br>• Verificación de usabilidad (< 3 clics desde ficha RNF-01). |
| **Alex Cuzco** | **Analista y Diseñador (AN / DIS)** (QA, Cálculo, Datos y Reportes M6) | • M6: Implementar descarga de reporte formal en **PDF** con membrete ESPE.<br>• M6: Exportación de matriz de brechas a Excel/CSV.<br>• Realizar la evaluación completa demostrativa de la VSE ejemplo (*AndesTech Solutions*).<br>• Ejecución y mantenimiento de pruebas automatizadas. | • **Especificación de Requisitos de Software (SRS)** validada.<br>• **Informe Formal de Pruebas Automatizadas** (resultados de tests unitarios y de integración).<br>• Diapositivas para la presentación y demostración en vivo (10 min). |

---

### 3.2 Asignación para Revisión y Paráfrasis de las 13 Normas (Control Anti-Plagio)

> [!CAUTION]  
> **Criterio de Evaluación Crítico (Sección 10 de la Guía):**  
> *"Toda información sobre las normas debe citar su fuente; el plagio o la copia textual de documentos protegidos anula el criterio correspondiente (20% de M1 y M2)."*  
> Cada integrante debe abrir el archivo `prisma/seed-data/iso-29110-standards.json`, revisar exhaustivamente sus normas asignadas, verificar que la introducción sea **paráfrasis original**, confirmar el enlace oficial a ISO y validar los ítems de verificación.

| Integrante | Rol | Normas Asignadas para Revisión y Paráfrasis | Enfoque de la Revisión |
| :--- | :--- | :--- | :--- |
| **Juan Quimbiulco** | GP / PR | **1. 29110-1-1:2024** (Visión general)<br>**2. 29110-3-1:2020** (Guía de evaluación)<br>**3. 29110-3-2:2018 + Amd 1:2025** (Certificación) | • Verificar conceptos de VSE (≤ 25 personas).<br>• Explicar proceso de evaluación ligera para consultores.<br>• **Clave:** Destacar la enmienda 2025 que elimina la recertificación obligatoria cada 3 años. |
| **Martín Cordero** | LT | **4. 29110-1-2:2024** (Vocabulario)<br>**5. 29110-2-1:2015** (Marco y taxonomía)<br>**6. 29110-5-1-4:2018** (Perfil Avanzado) | • Validar glosario común (V&V, producto de trabajo, roles).<br>• Explicar la taxonomía para derivar perfiles desde ISO 12207.<br>• Detallar prácticas de sostenibilidad, innovación y mejora continua del Perfil Avanzado. |
| **Stiven Díaz** | PR | **7. 29110-5-1-1:2012** (Perfil de Entrada)<br>**8. 29110-5-1-2:2011** (Perfil Básico - GP e IS)<br>**9. 29110-5-4:2025** (Desarrollo Ágil) | • Verificar prácticas de inicio para microempresas (1-5 personas).<br>• **El núcleo:** Validar todas las tareas y productos esperados de GP (GP.1 a GP.7) e IS (IS.1 a IS.6).<br>• Describir cómo se integran eventos ágiles (Sprints, Demos) con el Perfil Básico. |
| **Alex Cuzco** | AN / DIS | **10. 29110-4-1:2018** (Especificaciones de perfiles)<br>**11. 29110-5-1-3:2017** (Perfil Intermedio)<br>**12. 29110-5-3:2018** (Servicios de TI)<br>**13. 29110-5-6-1/2** (Ingeniería de Sistemas) | • Verificar requisitos normativos ("qué hacer") de los perfiles.<br>• Detallar gestión multiproyecto y aseguramiento de calidad del Perfil Intermedio.<br>• Revisar gestión de SLAs para soporte y servicios de TI.<br>• Validar interfaces ciberfísicas hardware/software para IoT/sistemas embebidos. |

---

## 🏗️ 4. Arquitectura y Estructura del Proyecto

El sistema está construido con una **Arquitectura en 3 Capas Limpias**:

```
ISO-COMPASS/
├── prisma/
│   ├── schema.prisma                  # Modelos de datos: Family, Standard, Section, Item, Org, Evaluation, Evidence, User
│   ├── seed.ts                        # Script de inicialización de datos
│   └── seed-data/
│       └── iso-29110-standards.json   # 13 partes de la norma + Perfil Básico GP/IS
├── src/
│   ├── app/                           # [CAPA PRESENTACIÓN - Next.js App Router]
│   │   ├── (dashboard)/
│   │   │   ├── biblioteca/            # M1: Libro interactivo y catálogo
│   │   │   ├── normas/[code]/         # M2 & M3: Ficha técnica y botón oficial
│   │   │   ├── evaluaciones/          # M4: Listas de verificación
│   │   │   ├── tablero/               # M5: Tablero de estado, métricas y brechas
│   │   │   ├── reportes/              # M6: Exportación formal PDF / Excel
│   │   │   └── admin/                 # M7: Administración y roles
│   │   ├── globals.css                # Estilos base Tailwind CSS
│   │   ├── layout.tsx                 # Layout principal
│   │   └── page.tsx                   # Página de bienvenida / dashboard
│   ├── components/                    # [CAPA PRESENTACIÓN - Componentes UI]
│   │   ├── ui/                        # Componentes atómicos (Button, Card, Badge)
│   │   └── layout/                    # Sidebar de navegación y Header
│   ├── core/                          # [CAPA LÓGICA DE NEGOCIO - Dominio Puro]
│   │   ├── types.ts                   # Interfaces y tipos del dominio
│   │   ├── compliance-calculator.ts   # Implementación exacta de la fórmula matemática
│   │   ├── status-evaluator.ts        # Asignación de estados según Tabla 4
│   │   └── gap-analyzer.ts            # Detección y priorización de brechas (NC / P)
│   ├── services/                      # [Servicios de Orquestación]
│   │   ├── standards.service.ts
│   │   ├── evaluation.service.ts
│   │   └── reports.service.ts
│   └── lib/                           # [CAPA DATOS Y UTILIDADES]
│       ├── prisma.ts                  # Instancia singleton de Prisma Client
│       └── utils.ts                   # Utilidades de formato
├── tests/                             # [PRUEBAS UNITARIAS AUTOMATIZADAS]
│   └── compliance-calculator.test.mjs # Pruebas del motor de cálculo de la fórmula
├── docker-compose.yml                 # Contenedor opcional PostgreSQL
├── package.json
└── README.md
```

---

## 🚀 5. Guía de Instalación y Ejecución para el Equipo

Esta guía es universal para cualquier sistema operativo (**Windows, macOS o Linux**).

### Prerrequisitos
* **Node.js:** Versión 18 o superior (v20+ recomendada).

### Pasos para levantar el proyecto localmente:

1. **Clonar el repositorio:**
   ```bash
   git clone <url-del-repositorio>
   cd ISO-COMPASS
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar el archivo `.env`:**
   Crea un archivo llamado `.env` en la raíz del proyecto y pega las cadenas de conexión compartidas por el equipo:
   ```env
   DATABASE_URL="postgresql://postgres.oixvmqqugizqwjwmauep:isoroot2026%21@aws-1-us-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
   DIRECT_URL="postgresql://postgres.oixvmqqugizqwjwmauep:isoroot2026%21@aws-1-us-west-2.pooler.supabase.com:5432/postgres"
   AUTH_SECRET="iso-compass-super-secret-key-development-2026"
   NODE_ENV="development"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Generar el cliente de Prisma:**
   ```bash
   npx prisma generate
   ```

5. **(Solo el responsable inicial de BD) Sincronizar y cargar normas en Supabase:**
   *(Si la base de datos ya fue poblada por el Integrante 1, los demás integrantes pueden saltar este paso).*
   ```bash
   npx prisma db push
   npm run db:seed
   ```

6. **Ejecutar las pruebas unitarias automatizadas:**
   ```bash
   npm test
   ```

7. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🔄 6. Integración Continua (CI/CD) y Despliegue en la Nube

Para garantizar que el equipo trabaje de forma ordenada y que el docente disponga de una URL pública funcional (**Entregable 2 de la guía**):

### Flujo de Trabajo Recomendado:
1. Cada integrante trabaja en su propia rama local (ej. `feature/m1-biblioteca`, `feature/m4-evaluaciones`).
2. Prueba sus cambios localmente con `npm test` y `npm run dev`.
3. Sube sus cambios a GitHub mediante un Pull Request hacia la rama `main`.

### Pipeline de Integración Continua (CI con GitHub Actions):
* El archivo `.github/workflows/ci.yml` se ejecuta automáticamente en cada `push` o `Pull Request` hacia la rama `main`.
* **Acciones del pipeline:**
  1. Instala dependencias en un entorno limpio.
  2. Genera el cliente de Prisma.
  3. **Ejecuta los tests unitarios automatizados (`npm test`):** Si alguien rompe la fórmula matemática o las reglas de cálculo de la ISO 29110, el pipeline falla y bloquea el merge.
  4. **Verifica la compilación (`npm run build`):** Asegura que no existan errores de TypeScript ni de sintaxis en Next.js.

### Despliegue Continuo (CD en Vercel - Recomendado):
**Vercel** es la plataforma oficial y gratuita creada por los desarrolladores de Next.js. Se conecta directamente a tu repositorio de GitHub:

1. Entra a [vercel.com](https://vercel.com) e inicia sesión con tu cuenta de GitHub.
2. Haz clic en **Add New...** $\rightarrow$ **Project** e importa tu repositorio `ISO-COMPASS`.
3. En la sección **Environment Variables**, añade:
   * `DATABASE_URL`: La URL del pooler de Supabase (puerto 6543).
   * `DIRECT_URL`: La URL directa de Supabase (puerto 5432).
   * `AUTH_SECRET`: Tu clave secreta.
4. Haz clic en **Deploy**.
5. **Resultado:** En 1 minuto tendrás una URL pública con HTTPS (ej. `https://iso-compass.vercel.app`) lista para entregar al docente.
6. **Despliegue automático:** Cada vez que el equipo haga `git push` a `main`, Vercel recompilará y actualizará el sitio en vivo sin necesidad de hacer nada manual.

---

## 📊 7. Rúbrica de Evaluación y Metas de Calificación (100%)

| Módulo / Criterio | Peso | Meta para 100% (Excelente) |
| :--- | :---: | :--- |
| **M1 & M2. Biblioteca y Fichas** | **20%** | Las 13 partes de la Tabla 6 cargadas, con redacción propia (paráfrasis), propósito, audiencia y mapa interactivo. |
| **M3. Acceso a Documentos** | **10%** | Botón funcional en cada norma con enlaces oficiales verificados y respeto a derechos de autor. |
| **M4. Listas de Verificación** | **20%** | Todos los apartados con selección de 4 estados (C, P, NC, NA), soporte para evidencias y observaciones. |
| **M5. Tablero de Estado** | **15%** | Cálculo exacto según la fórmula, estados automáticos (Tabla 4) y gráficos claros. |
| **M6 & M7. Reportes y Admin** | **10%** | Exportación a PDF/Excel y administración de normas/usuarios con roles RBAC. |
| **Calidad Técnica** | **10%** | Arquitectura en 3 capas, pruebas unitarias automatizadas passing, repositorio Git ordenado y README claro. |
| **Evidencias ISO/IEC 29110** | **10%** | Productos de trabajo de GP e IS completos y coherentes generados durante el proyecto. |
| **Presentación y Demo** | **5%** | Demostración fluida en vivo de 10 minutos. |
