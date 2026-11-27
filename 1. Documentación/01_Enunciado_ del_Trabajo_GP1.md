# ENUNCIADO DEL TRABAJO (STATEMENT OF WORK - SOW)
**Código de Producto de Trabajo:** `GP-SOW-001` (Actividad GP.1 — ISO/IEC 29110-5-1-2)  
**Estado:** `[REVISADO Y ACORDADO CON EL CLIENTE]`  
**Fecha de Aprobación:** 13 de noviembre de 2026  
**Responsables:** Juan Quimbiulco (Gestor de Proyecto - GP), Martín Cordero (Líder Técnico - LT), Ing. Diego Gamboa Mgtr. (Cliente / Docente - CL)

---

## 1. Identificación del Proyecto
* **Nombre del Sistema:** **ISO-COMPASS** — Sistema «ISO-Guía 29110»: Biblioteca digital, lista de verificación y tablero de estado de aplicación de la familia ISO/IEC 29110.
* **Institución:** Universidad de las Fuerzas Armadas ESPE — Carrera de Ingeniería de Software.
* **Asignatura:** Aseguramiento de la Calidad del Software (NRC 36844 / Paralelo 5).
* **Entidad Muy Pequeña (VSE) Ejecutora:** Equipo ISO-COMPASS (4 integrantes, dentro del rango VSE $\le 25$ personas).
* **Perfil de Ciclo de Vida Aplicado:** **Perfil Básico** de ISO/IEC 29110-5-1-2:2011 (Procesos de Gestión del Proyecto `GP` e Implementación de Software `IS`).

---

## 2. Propósito y Alcance del Trabajo
Desarrollar una aplicación web con arquitectura en 3 capas limpias (Presentación, Lógica de Negocio y Datos) conectada a PostgreSQL en Supabase que permita:
1. **M1 & M2 (Biblioteca y Fichas Técnicas):** Consultar las 13 partes de la familia ISO/IEC 29110 (Tabla 6) con paráfrasis propia verificada, propósito, audiencia, edición vigente y mapa interactivo de la serie.
2. **M3 (Acceso Oficial y Derechos de Autor):** Acceder o descargar cada documento respetando la propiedad intelectual de ISO/IEC (enlaces directos a *ISO Publicly Available Standards* para normas gratuitas y al catálogo oficial ISO para normas de pago).
3. **M4 (Listas de Verificación Interactivas):** Evaluar apartado por apartado los procesos (incluyendo todas las tareas GP y IS del Perfil Básico de la Tabla 7) con los 4 valores (`C`, `P`, `NC`, `NA`), observaciones, rol responsable y evidencias adjuntas.
4. **M5 (Tablero de Estado y Madurez):** Calcular automáticamente el porcentaje de cumplimiento mediante la fórmula oficial:
   $$\text{Cumplimiento (\%)} = \left[ \frac{C + 0.5 \times P}{T - NA} \right] \times 100$$
   asignando el estado de la Tabla 4 (*No iniciado*, *En inicio*, *En progreso*, *Casi conforme*, *Conforme*) y listando la matriz de brechas (*gaps*).
5. **M6 (Reportes Ejecutivos):** Exportar dictámenes formales en PDF con membrete institucional ESPE y matrices de brechas en CSV/Excel.
6. **M7 (Administración y Extensibilidad RBAC):** Gestionar usuarios con contraseñas cifradas (`bcryptjs`), control de acceso por rol (`ADMIN`, `EVALUATOR`, `CONSULTANT`) y registro extensible de nuevas familias de normas (ej. `ISO 9001`, `ISO/IEC 25010`) sin modificar el código fuente.

---

## 3. Entregables Comprometidos e Instrucciones de Entrega (GP.1)

| ID | Producto de Trabajo / Entregable | Formato de Entrega | Responsable Principal |
| :--- | :--- | :--- | :--- |
| **E-01** | Repositorio Git con código fuente en 3 capas y commits del equipo | GitHub (`main`) | Todo el equipo (ET) |
| **E-02** | Sistema web desplegado y base de datos Supabase sincronizada | URL Pública / Local | Juan Quimbiulco (GP/PR) |
| **E-03** | Informe Técnico (Arquitectura, Modelo E-R, Trazabilidad y Pruebas) | PDF (Formato APA 7) | Martín Cordero (LT) & Alex Cuzco (AN/DIS) |
| **E-04** | Carpeta de Evidencias GP e IS del Perfil Básico ISO/IEC 29110 | Markdown / DOCX / PDF | Juan Quimbiulco (GP) |
| **E-05** | Manual de Usuario y Manual Técnico de Instalación | Markdown / PDF | Stiven Díaz (PR) & Martín Cordero (LT) |
| **E-06** | Evaluación demostrativa completa de la VSE *AndesTech Solutions* | PDF / CSV del sistema | Alex Cuzco (AN/DIS) |

---

## 4. Criterios de Aceptación Acordados con el Cliente
1. Las 13 partes de la Tabla 6 están cargadas con paráfrasis propia y citas APA 7 (cero copia textual).
2. Ningún PDF con copyright de pago de ISO se redistribuye ilegalmente en el repositorio.
3. El motor matemático supera el 100% de las pruebas unitarias automatizadas (`npm test`), incluyendo el caso borde $T - NA = 0$.
4. La autenticación cifra las contraseñas y restringe la edición en M7 exclusivamente al rol `ADMIN`.

---

## 5. Firmas de Revisión y Acuerdo (Actividad GP.1)
* **Gestor de Proyecto (GP):** Juan Quimbiulco — *Aprobado*
* **Líder Técnico (LT):** Martín Cordero — *Aprobado*
* **Cliente / Docente (CL):** Ing. Diego Gamboa Mgtr. — *Acordado según Guía de Actividad Parcial 2*
