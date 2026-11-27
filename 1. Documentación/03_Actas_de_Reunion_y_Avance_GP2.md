# ACTAS DE REUNIÓN Y REPORTES DE AVANCE DEL PROYECTO
**Código de Producto de Trabajo:** `GP-ACT-003` (Actividades GP.2 e IS.1 — ISO/IEC 29110-5-1-2)  
**Responsable de Registro:** Juan Quimbiulco (Gestor de Proyecto - GP)

---

## Acta de Reunión N.º 01 — Inicio del Proyecto y Revisión del Plan (GP.1 / IS.1)
* **Fecha y Hora:** 13 de noviembre de 2026 — 18:00 a 19:30
* **Modalidad:** Sincrónica (Sala de trabajo virtual y repositorio GitHub)
* **Asistentes:**
  * Juan Quimbiulco — Gestor de Proyecto (GP) y Programador Backend (PR)
  * Martín Cordero — Líder Técnico (LT)
  * Stiven Díaz — Programador Frontend (PR)
  * Alex Cuzco — Analista, Diseñador y QA (AN / DIS)
* **Agenda:**
  1. Revisión del Enunciado del Trabajo y rúbrica de la Guía de Actividad Parcial 2.
  2. Asignación formal de roles del Perfil Básico ISO/IEC 29110 y distribución de las 13 normas de la Tabla 6.
  3. Revisión y compromiso del equipo con el Plan del Proyecto (Actividad IS.1).
* **Acuerdos y Compromisos:**
  * Se aprueba la arquitectura en 3 capas con Next.js 14, TypeScript, Prisma ORM y PostgreSQL en Supabase.
  * Cada integrante redactará con paráfrasis propia y citas APA 7 sus normas asignadas para evitar cualquier riesgo de plagio.
  * Juan Quimbiulco configurará el proyecto en Supabase (`prisma db push` y `seed.ts`) con los usuarios RBAC iniciales.

---

## Acta de Reunión N.º 02 — Seguimiento Técnico y Verificación de Paráfrasis (GP.2 / GP.3)
* **Fecha y Hora:** 20 de noviembre de 2026 — 19:00 a 20:15
* **Asistentes:** Juan Quimbiulco (GP), Martín Cordero (LT), Stiven Díaz (PR), Alex Cuzco (AN/DIS).
* **Revisiones de Avance (Plan vs Real):**
  * **Avance Planificado:** 65% | **Avance Real:** 68% (Sin desviaciones negativas).
  * **Base de Datos y Catálogo:** Las 13 normas de la Tabla 6 y los 13 ítems obligatorios del Perfil Básico (`GP.1` a `GP.7` e `IS.1` a `IS.6`) están cargados en Supabase.
  * **Revisión Anti-Plagio:** Se verificó que la norma `29110-1-1:2024` define correctamente a las VSEs ($\le 25$ personas), la `29110-3-1:2020` describe el método de evaluación ligera basado en ISO/IEC 330xx, y la `29110-3-2:2018 + Amd 1:2025` destaca explícitamente la eliminación de la recertificación trienal obligatoria.
* **Acciones Correctivas / Preventivas:**
  * Se acordó incorporar una solicitud de cambio (`SC-002`) para incluir plantillas rápidas de extensibilidad (`ISO 9001` e `ISO/IEC 25010`) en el Módulo M7 y un selector rápido de rol RBAC en el encabezado para facilitar la calificación docente.

---

## Acta de Reunión N.º 03 — Pruebas de Integración, Auditoría Piloto y Cierre (GP.3 / IS.5)
* **Fecha y Hora:** 26 de noviembre de 2026 — 20:00 a 21:30
* **Asistentes:** Juan Quimbiulco (GP), Martín Cordero (LT), Stiven Díaz (PR), Alex Cuzco (AN/DIS).
* **Resultados Verificados:**
  * **Avance Real:** 100% de los 7 módulos (M1 a M7) completados.
  * Todas las pruebas unitarias automatizadas de la fórmula matemática y del módulo RBAC pasan satisfactoriamente (`npm test`).
  * Se completó la evaluación piloto de la empresa **AndesTech Solutions (VSE Piloto)** con un cumplimiento del `79.2%` (*En progreso*), identificando sus brechas y exportando los reportes PDF y CSV.
  * Se aprueba la entrega final y la firma del Acta de Aceptación (`GP-ACP-005`).
