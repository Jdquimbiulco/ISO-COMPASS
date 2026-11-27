# REGISTRO DE SOLICITUDES DE CAMBIO Y ACCIONES CORRECTIVAS
**Código de Producto de Trabajo:** `GP-CHG-004` (Actividad GP.3 / Ítems GP.5 y GP.6 — ISO/IEC 29110-5-1-2)  
**Responsables:** Juan Quimbiulco (Gestor de Proyecto - GP) y Cliente / Equipo Técnico

---

## 1. Bitácora Formal de Solicitudes de Cambio (GP.6)

Según la práctica **GP.6** del Perfil Básico de ISO/IEC 29110-5-1-2, toda solicitud de cambio sobre los requisitos, diseño o alcance se evalúa analizando su impacto técnico y en cronograma antes de registrarse como `Propuesta`, `Evaluada`, `Aceptada` o `Rechazada`.

| ID Cambio | Fecha Solicitud | Solicitante | Descripción del Cambio Solicitado | Análisis de Impacto (Tiempo / Arquitectura) | Estado Oficial | Fecha Resolución |
| :---: | :---: | :--- | :--- | :--- | :---: | :---: |
| **SC-001** | 18/11/2026 | Ing. Diego Gamboa (CL) / Guía Sección 1 | Actualizar el catálogo de normas para reflejar las ediciones recientes **2024** (`29110-1-1` y `29110-1-2`) y **2025** (`29110-5-4` Ágil y `Amd 1:2025` de `29110-3-2` que elimina la recertificación cada 3 años). | Impacto Bajo (+2h). Requiere actualizar `iso-29110-standards.json` y volver a ejecutar `prisma db seed`. | **ACEPTADA E IMPLEMENTADA** | 19/11/2026 |
| **SC-002** | 22/11/2026 | Juan Quimbiulco (GP) | Agregar en el Módulo M7 plantillas de creación en 1 clic para las familias **ISO 9001:2015** e **ISO/IEC 25010:2023**, además de un conmutador rápido de rol RBAC en el Header para demostración en vivo. | Impacto Medio (+3h). Mejora sustancialmente la demostración del criterio de extensibilidad (Sección 4.1) y seguridad RNF-03 en la exposición de 10 minutos. | **ACEPTADA E IMPLEMENTADA** | 26/11/2026 |
| **SC-003** | 24/11/2026 | Equipo Técnico (ET) | Almacenar archivos PDF completos de las normas ISO de pago dentro de la carpeta `public/` para descarga local sin internet. | **Impacto Legal Crítico.** Viola la Sección 4.7 de la guía y los derechos de autor de ISO/IEC. Se mantiene únicamente el enlace oficial a `iso.org`. | **RECHAZADA (Por Copyright ISO)** | 24/11/2026 |

---

## 2. Seguimiento de Desviaciones y Acciones Correctivas (GP.5)

| ID Acción | Desviación Detectada | Causa Raíz | Acción Correctiva Aplicada | Resultado / Verificación |
| :---: | :--- | :--- | :--- | :--- |
| **AC-001** | Latencia variable en la primera consulta al pooler remoto de Supabase cuando la base entra en reposo. | Conexión fría en plan gratuito de nube o entornos sin salida a puerto 5432. | Se implementó sincronización híbrida en `StandardsService`, `AuthService` y `AdminService` con fallback instantáneo al catálogo semilla tipado (<50ms), garantizando el cumplimiento estricto de **RNF-04 (< 2 segundos)**. | Verificado con `npm test` y pruebas de carga en navegador. |
| **AC-002** | Hash bcrypt de ejemplo en el primer borrador de `seed.ts` no coincidía con la cadena `Password123!`. | Hash placeholder copiado durante el diseño inicial del esquema. | Se generó un hash bcrypt real de costo 10 (`$2a$10$rVlPBUtgbHPNnlJscdZWi.3WIRcjLmjfa5KxqhTnKHbRNTAKRQuGG`) verificado con `bcryptjs.compareSync` y pruebas unitarias automatizadas. | Verificado al 100% en `tests/compliance-calculator.test.mjs`. |
