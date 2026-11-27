# UNIVERSIDAD DE LAS FUERZAS ARMADAS ESPE

Departamento de Ciencias de la Computación
Carrera de Ingeniería de Software

## GUÍA DE ACTIVIDAD PROYECTO FINAL PARCIAL 2

**Desarrollo del sistema «ISO-Guía 29110»: biblioteca digital, lista de verificación y tablero de estado de aplicación de la familia ISO/IEC 29110**

| Campo | Información |
| --- | --- |
| Asignatura | Aseguramiento de la Calidad del Software |
| Unidad | Normas para entidades muy pequeñas (VSE): ISO/IEC 29110 |
| Tipo de actividad | Proyecto práctico de desarrollo (aprendizaje basado en proyectos) |
| Modalidad | Grupal, de 3 estudiantes |
| Duración | dos semanas |
| Docente | Ing. Diego Gamboa Mgtr. |
| NRC / Paralelo | 36844/5 |
| Fecha de entrega | Segun Plataforma Moodle |

Sangolquí, noviembre de 2026

---

## Contenido

1. [Introducción](#1-introducción)
2. [Objetivos](#2-objetivos)
   - 2.1 [Objetivo general](#21-objetivo-general)
   - 2.2 [Objetivos específicos](#22-objetivos-específicos)
3. [Resultados de aprendizaje](#3-resultados-de-aprendizaje)
4. [Descripción del sistema a desarrollar](#4-descripción-del-sistema-a-desarrollar)
   - 4.1 [Alcance](#41-alcance)
   - 4.2 [Módulos obligatorios](#42-módulos-obligatorios)
   - 4.3 [Requisitos funcionales](#43-requisitos-funcionales)
   - 4.4 [Requisitos no funcionales](#44-requisitos-no-funcionales)
   - 4.5 [Reglas para calcular el estado de aplicación](#45-reglas-para-calcular-el-estado-de-aplicación)
   - 4.6 [Modelo de datos mínimo](#46-modelo-de-datos-mínimo)
   - 4.7 [Derechos de autor y botón de descarga](#47-derechos-de-autor-y-botón-de-descarga)
   - 4.8 [Tecnología y arquitectura](#48-tecnología-y-arquitectura)
5. [Contenido mínimo que debe cargar el sistema](#5-contenido-mínimo-que-debe-cargar-el-sistema)
6. [Lista de verificación base](#6-lista-de-verificación-base)
7. [Metodología de trabajo](#7-metodología-de-trabajo)
8. [Entregables](#8-entregables)
9. [Rúbrica de evaluación](#9-rúbrica-de-evaluación)
10. [Normas de presentación e integridad académica](#10-normas-de-presentación-e-integridad-académica)
11. [Referencias](#11-referencias)

---

## 1. Introducción

La familia ISO/IEC 29110 reúne normas, informes técnicos y guías concebidos para entidades muy pequeñas (VSE, por sus siglas en inglés), es decir, empresas, departamentos, proyectos u organizaciones que desarrollan software o sistemas con un equipo de hasta 25 personas. Su propósito es ofrecer perfiles de ciclo de vida progresivos, fáciles de adoptar y adaptados a las limitaciones de tiempo, presupuesto y conocimiento que caracterizan a estas organizaciones (Laporte, 2016).

A diferencia de normas extensas como ISO/IEC/IEEE 12207, la serie organiza sus documentos por audiencia: la visión general y el vocabulario para todos los interesados; las especificaciones de perfil, que indican «qué hacer»; las guías de gestión e ingeniería, que explican «cómo hacerlo»; y los documentos de evaluación y certificación, dirigidos a evaluadores y auditores. En 2024 se publicaron las nuevas Partes 1-1 y 1-2, que reemplazaron al informe técnico de 2016 y actualizaron la estructura de la serie (ISO/IEC, 2024a).

La serie sigue evolucionando: en 2025 se publicó la guía de desarrollo ágil de software (Parte 5-4) y una enmienda al esquema de certificación que elimina el requisito de recertificar cada tres años. Estas actualizaciones exigen que los profesionales dispongan de herramientas que les permitan consultar el contenido de cada parte y verificar su grado de aplicación de forma ordenada y trazable (ISO/IEC, 2025b).

En este contexto, la presente actividad propone que cada equipo desarrolle un sistema informático, en el lenguaje y la tecnología de su preferencia, que funcione como guía digital de la familia ISO/IEC 29110 y como herramienta de autoevaluación. El sistema permitirá conocer cada parte de la serie, acceder a su documento oficial y registrar, apartado por apartado, si una organización cumple o no con lo que la norma establece (Laporte, 2016).

## 2. Objetivos

### 2.1 Objetivo general

Desarrollar un sistema informático que presente de forma automatizada la información de cada parte de la familia ISO/IEC 29110, permita acceder a su documento oficial y gestione listas de verificación para determinar el estado de aplicación de cada norma en una organización.

### 2.2 Objetivos específicos

1. Construir una biblioteca digital tipo libro o guía que describa el propósito, la audiencia, el contenido y la relación de cada parte de la familia ISO/IEC 29110.
2. Implementar un mecanismo de descarga o acceso al documento de cada norma que respete los derechos de autor de ISO e IEC.
3. Diseñar listas de verificación interactivas por cada parte, en las que el usuario marque el cumplimiento de cada apartado y adjunte evidencias.
4. Calcular y visualizar el porcentaje de cumplimiento y el estado de aplicación de cada norma mediante un tablero de control.
5. Aplicar las prácticas del Perfil Básico de ISO/IEC 29110 en la gestión y la implementación del propio proyecto del equipo.

## 3. Resultados de aprendizaje

Al finalizar la actividad, el estudiante estará en capacidad de:

- Explicar la estructura de la familia ISO/IEC 29110, sus perfiles y la audiencia a la que se dirige cada documento.
- Traducir los requisitos de una norma en elementos verificables de una lista de comprobación.
- Diseñar e implementar un sistema con persistencia de datos, cálculo de indicadores y generación de reportes.
- Producir evidencias de los procesos de Gestión del Proyecto (GP) e Implementación de Software (IS) del Perfil Básico.

## 4. Descripción del sistema a desarrollar

### 4.1 Alcance

El sistema, denominado provisionalmente «ISO-Guía 29110», debe cubrir todas las partes de la familia ISO/IEC 29110 descritas en la Tabla 6. Debe desarrollarse como aplicación web, en cualquier lenguaje de programación (por ejemplo, Python, Java, C#, JavaScript o TypeScript, PHP, Kotlin o Dart). La elección tecnológica es libre, pero debe justificarse en el informe técnico, se debe subir a GitHub, toda la documentación y un Redme para guía de uso.

El diseño debe ser extensible: la estructura de datos tiene que permitir que, en el futuro, se incorporen otras familias de normas (por ejemplo, ISO 9001 o ISO/IEC 25010) sin modificar el código fuente, solo registrando nuevo contenido desde el módulo de administración.

### 4.2 Módulos obligatorios

**Tabla 1**
*Módulos que debe contener el sistema*

| Módulo | Descripción | Funciones mínimas |
| --- | --- | --- |
| M1. Biblioteca o guía | Presenta la familia ISO/IEC 29110 como un libro navegable, organizado por grupos de documentos. | Índice general, navegación por capítulos, buscador por palabra clave y mapa de la familia. |
| M2. Ficha de cada norma | Muestra el detalle de cada parte de la serie. | Código, título, edición vigente, propósito, introducción, audiencia, perfiles relacionados, contenido principal y normas vinculadas. |
| M3. Acceso al documento | Permite obtener el documento oficial de cada parte. | Botón «Descargar o consultar norma», con enlace a la fuente oficial o a la copia institucional autorizada. |
| M4. Lista de verificación | Guía interactiva para evaluar el cumplimiento por apartado. | Marcar Cumple, Cumple parcialmente, No cumple o No aplica; registrar evidencias, responsables, fechas y observaciones. |
| M5. Tablero de estado | Resume el avance de aplicación por norma y por organización. | Porcentaje de cumplimiento, estado de aplicación, gráficos de avance y lista de brechas pendientes. |
| M6. Reportes | Genera documentos de resultados. | Exportar el estado de cada norma a PDF o a hoja de cálculo con fecha y responsable. |
| M7. Administración | Gestiona el contenido y los usuarios. | Registro, edición y eliminación de normas, apartados e ítems; roles de administrador, evaluador y consultor. |

*Nota.* Los módulos M1 a M5 son indispensables para aprobar la actividad; M6 y M7 completan la calificación máxima.

### 4.3 Requisitos funcionales

**Tabla 2**
*Requisitos funcionales del sistema*

| Código | Requisito | Prioridad |
| --- | --- | --- |
| RF-01 | Listar todas las partes de la familia ISO/IEC 29110 agrupadas por tipo de documento: visión general, perfiles, evaluación y certificación, y guías. | Alta |
| RF-02 | Mostrar, para cada parte, una introducción redactada por el equipo con sus propias palabras y las fuentes consultadas. | Alta |
| RF-03 | Mostrar el mapa gráfico de la familia y permitir navegar desde él hacia la ficha de cada parte. | Media |
| RF-04 | Incluir en cada ficha un botón para descargar o consultar el documento oficial de la norma. | Alta |
| RF-05 | Registrar organizaciones o proyectos a evaluar, con nombre, tamaño del equipo y perfil objetivo. | Alta |
| RF-06 | Presentar la lista de verificación de cada parte, organizada por proceso, actividad y tarea cuando corresponda. | Alta |
| RF-07 | Permitir marcar cada ítem como Cumple, Cumple parcialmente, No cumple o No aplica. | Alta |
| RF-08 | Adjuntar evidencias por ítem (archivo o enlace) y registrar observaciones, responsable y fecha. | Media |
| RF-09 | Calcular automáticamente el porcentaje de cumplimiento por norma, por proceso y por organización. | Alta |
| RF-10 | Asignar el estado de aplicación de cada norma según las reglas de la Tabla 4. | Alta |
| RF-11 | Mostrar un tablero con indicadores y gráficos del avance de cada norma. | Alta |
| RF-12 | Listar las brechas, es decir, los ítems con No cumple o Cumple parcialmente, con su acción de mejora. | Media |
| RF-13 | Exportar reportes de estado a PDF o a hoja de cálculo. | Media |
| RF-14 | Guardar el historial de evaluaciones para comparar el avance en el tiempo. | Media |
| RF-15 | Administrar normas, apartados, ítems y usuarios con control de acceso por rol. | Media |

### 4.4 Requisitos no funcionales

**Tabla 3**
*Requisitos no funcionales del sistema*

| Código | Atributo | Criterio de aceptación |
| --- | --- | --- |
| RNF-01 | Usabilidad | Un usuario nuevo marca un ítem de la lista de verificación en menos de tres clics desde la ficha de la norma. |
| RNF-02 | Persistencia | Las evaluaciones se conservan al cerrar y volver a abrir el sistema (base de datos o archivo estructurado). |
| RNF-03 | Seguridad | Acceso con usuario y contraseña cifrada; los roles limitan quién edita contenido y quién solo consulta. |
| RNF-04 | Rendimiento | La ficha de una norma y su lista de verificación cargan en menos de dos segundos en un equipo de laboratorio. |
| RNF-05 | Mantenibilidad | Código versionado en Git, con README, instrucciones de instalación y comentarios en los módulos principales. |
| RNF-06 | Portabilidad | El sistema se instala y ejecuta siguiendo el manual técnico en un equipo distinto al de desarrollo. |
| RNF-07 | Accesibilidad | Contraste legible, textos alternativos en imágenes y navegación básica con teclado. |

### 4.5 Reglas para calcular el estado de aplicación

El porcentaje de cumplimiento de cada norma se calcula sin considerar los ítems marcados como No aplica. Los ítems que cumplen parcialmente valen la mitad, de modo que el indicador refleje el avance real de la organización y no solo los requisitos completos:

*Cumplimiento (%) = [ (C + 0,5 × P) / (T − NA) ] × 100*

donde C es el número de ítems que cumplen, P los que cumplen parcialmente, T el total de ítems de la norma y NA los que no aplican. Con este valor, el sistema asigna automáticamente el estado de aplicación que se describe en la Tabla 4.

**Tabla 4**
*Estados de aplicación de cada norma*

| Rango de cumplimiento | Estado | Interpretación |
| --- | --- | --- |
| 0 % (sin ítems evaluados) | No iniciado | La organización aún no ha revisado la norma. |
| 1 % a 39 % | En inicio | Existen prácticas aisladas; se requiere un plan de implantación. |
| 40 % a 79 % | En progreso | La mayoría de las prácticas está en marcha; persisten brechas relevantes. |
| 80 % a 99 % | Casi conforme | Faltan ajustes menores antes de una evaluación formal. |
| 100 % | Conforme | Todos los ítems aplicables se cumplen con evidencia; listo para evaluación o auditoría. |

*Nota.* Los rangos son una convención académica para esta actividad; no sustituyen el dictamen de un organismo certificador acreditado.

### 4.6 Modelo de datos mínimo

Para que la información sea coherente y el sistema pueda crecer, se recomienda un modelo relacional o documental con las entidades de la Tabla 5. Los equipos pueden ampliarlo, siempre que justifiquen los cambios en el diagrama entidad-relación del informe técnico.

**Tabla 5**
*Entidades mínimas del modelo de datos*

| Entidad | Atributos principales | Relación |
| --- | --- | --- |
| Familia | id, nombre (ISO/IEC 29110), descripción | Una familia tiene muchas normas. |
| Norma (parte) | id, código, título, edición, tipo, audiencia, introducción, enlace oficial, tipo de acceso | Pertenece a una familia; tiene muchos apartados. |
| Apartado | id, código (p. ej., GP.1), nombre, orden | Pertenece a una norma; tiene muchos ítems. |
| Ítem de verificación | id, código (p. ej., GP.1.1), enunciado, producto esperado, rol responsable | Pertenece a un apartado. |
| Organización o proyecto | id, nombre, número de personas, perfil objetivo | Tiene muchas evaluaciones. |
| Evaluación | id, fecha, evaluador, norma, porcentaje, estado | Une una organización con una norma. |
| Respuesta | id, ítem, valor (C, P, NC, NA), observación, responsable, fecha | Pertenece a una evaluación; puede tener evidencias. |
| Evidencia | id, tipo (archivo o enlace), ruta, descripción | Pertenece a una respuesta. |
| Usuario | id, nombre, correo, rol, contraseña cifrada | Realiza evaluaciones. |

### 4.7 Derechos de autor y botón de descarga

Las normas ISO e IEC están protegidas por derechos de autor. Por ello, el botón de descarga no debe almacenar ni redistribuir copias de documentos de pago. Solo se permite enlazar directamente al archivo cuando ISO lo ofrece sin costo, como sucede con la Parte 1-1:2024 en el catálogo oficial y con varios informes técnicos publicados en ISO Publicly Available Standards (ISO/IEC, 2024a), si no se puede acceder al documento colocar enlace.

Para las demás partes, el botón debe dirigir a la ficha oficial de la norma en el catálogo de ISO, a un organismo nacional de normalización o a la copia institucional que la universidad haya adquirido. El sistema debe indicar, junto a cada botón, si el acceso es gratuito, de pago o institucional, y el equipo debe verificar cada enlace antes de la entrega (Laporte, 2016).

### 4.8 Tecnología y arquitectura

La arquitectura es de libre elección, pero debe separar al menos tres capas: presentación, lógica de negocio y datos. Se sugiere almacenar el contenido de las normas y de las listas de verificación en la base de datos o en archivos JSON o YAML, de modo que el docente pueda revisar y corregir la información sin recompilar el sistema. Se valorará el uso de pruebas automatizadas para el cálculo del porcentaje y del estado de aplicación.

## 5. Contenido mínimo que debe cargar el sistema

El sistema debe incluir, como mínimo, las partes de la familia que se detallan en la Tabla 6. La introducción de cada ficha debe redactarse a partir de las fuentes oficiales, con paráfrasis propia y cita de la fuente; no se aceptará la copia textual de los documentos de ISO (ISO/IEC, 2024a).

**Tabla 6**
*Partes de la familia ISO/IEC 29110 que debe contener el sistema*

| Parte | Título resumido | Edición | Propósito y audiencia | Acceso |
| --- | --- | --- | --- | --- |
| 29110-1-1 | Visión general | 2024 | Conceptos, características de una VSE y taxonomía de perfiles; para todos los interesados. | Gratuito |
| 29110-1-2 | Vocabulario | 2024 | Términos comunes de la serie; para VSE, clientes, evaluadores y productores de normas. | Catálogo ISO |
| 29110-2-1 | Marco y taxonomía de perfiles | 2015 | Reglas para definir perfiles; para productores de normas. | Catálogo ISO |
| 29110-3-1 | Guía de evaluación | 2020 | Cómo evaluar procesos de una VSE; para evaluadores y VSE. | Verificar |
| 29110-3-2 | Esquema de certificación de conformidad | 2018 + Amd 1:2025 | Requisitos para certificar; la enmienda elimina la recertificación trienal obligatoria. | Catálogo ISO |
| 29110-4-1 | Especificaciones de perfiles de software | 2018 | Requisitos normativos («qué hacer») de los perfiles genéricos. | Catálogo ISO |
| 29110-5-1-1 | Guía del Perfil de Entrada | 2012 | Cómo aplicar el perfil inicial en proyectos pequeños o emprendimientos. | Verificar |
| 29110-5-1-2 | Guía del Perfil Básico | 2011 | Procesos GP e IS para una VSE con un proyecto a la vez. | Verificar |
| 29110-5-1-3 | Guía del Perfil Intermedio | 2017 | Gestión de varios proyectos en la organización. | Verificar |
| 29110-5-1-4 | Guía del Perfil Avanzado | 2018 | Crecimiento y sostenibilidad de la VSE como negocio. | Verificar |
| 29110-5-3 | Guía de prestación de servicios | 2018 | Procesos para VSE que operan servicios de TI. | Verificar |
| 29110-5-4 | Guía de desarrollo ágil | 2025 | Integra eventos ágiles con las prácticas del Perfil Básico. | Catálogo ISO |
| 29110-5-6-1 / 5-6-2 | Guías de ingeniería de sistemas (Entrada y Básico) | 2015 / 2014 | Productos que combinan hardware y software. | Verificar |

*Nota.* «Verificar» indica que el equipo debe confirmar en ISO Publicly Available Standards si el documento sigue disponible sin costo. Ediciones tomadas de ISO/IEC (2024a, 2024b, 2025a, 2025b) y Laporte (2016).

## 6. Lista de verificación base

Cada parte debe tener su propia lista de verificación. Para las guías de gestión e ingeniería, los ítems se derivan de las tareas de cada actividad; para los documentos de visión general, vocabulario o certificación, los ítems verifican que la organización conoce y prepara lo que la parte establece. La Tabla 7 muestra el punto de partida obligatorio para la guía del Perfil Básico (29110-5-1-2), que el equipo debe completar con todas las tareas de la norma (Laporte, 2016).

**Tabla 7**
*Ítems mínimos de la lista de verificación del Perfil Básico*

| Código | Ítem a verificar | Evidencia esperada | Rol |
| --- | --- | --- | --- |
| GP.1 | Se revisó el Enunciado del trabajo y se definieron con el cliente las instrucciones de entrega. | Enunciado del trabajo [revisado]; Plan del proyecto | GP, LT, CL |
| GP.1 | Existe un Plan del proyecto con tareas, estimaciones, calendario, recursos, riesgos y estrategia de control de versiones. | Plan del proyecto aprobado | GP |
| GP.2 | Se registran reportes de avance y actas de reunión con el cliente y el equipo. | Reportes de avance; actas | GP, ET |
| GP.2 | El repositorio del proyecto tiene respaldo periódico. | Respaldo del repositorio | GP, LT |
| GP.3 | Se compara el avance real con el plan y se definen acciones correctivas. | Acciones correctivas | GP |
| GP.3 | Las solicitudes de cambio se evalúan y se registra su estado (propuesta, evaluada, aceptada). | Solicitudes de cambio | GP, CL |
| GP.4 | El cliente firma el acta de aceptación al cierre del proyecto. | Acta de aceptación | GP, CL |
| IS.1 | El equipo revisó el Plan del proyecto al iniciar la implementación. | Acta de reunión | LT, ET |
| IS.2 | La Especificación de requisitos está verificada y validada por el cliente. | Especificación [validada]; Resultado de validación | AN, CL |
| IS.3 | Existe un diseño de arquitectura y diseño detallado trazable a los requisitos. | Diseño de software; matriz de trazabilidad | DIS, LT |
| IS.4 | Los componentes se construyeron con pruebas unitarias. | Componentes; resultados de pruebas | PR |
| IS.5 | Se ejecutaron pruebas de integración y se documentaron sus resultados. | Casos y procedimientos de prueba; informe de pruebas | PR, ET |
| IS.6 | Se entregó la configuración de software con guía de usuario y documento de mantenimiento. | Configuración de software; guías | LT, GP |

*Nota.* Roles: GP, gestor del proyecto; LT, líder técnico; CL, cliente; AN, analista; DIS, diseñador; PR, programador; ET, equipo de trabajo.

Para las demás partes se espera un mínimo de cinco ítems por norma. Por ejemplo, en la Parte 1-1 se puede verificar que la organización confirmó que es una VSE, que identificó el perfil adecuado a su contexto y que conoce los documentos que le corresponden; en la Parte 3-2, que existe la documentación requerida para una auditoría y que se seleccionó un organismo certificador acreditado.

## 7. Metodología de trabajo

El equipo debe gestionar su propio proyecto aplicando el Perfil Básico de ISO/IEC 29110, ya sea con un ciclo de vida predictivo o ágil. Esto significa que el desarrollo del sistema servirá, al mismo tiempo, como caso práctico para generar los productos de trabajo que exige la norma (Laporte, 2016).

**Tabla 8**
*Cronograma sugerido de la actividad*

| Semana | Fase | Actividades | Productos |
| --- | --- | --- | --- |
| 1 | Planificación y análisis | Conformar el equipo y asignar roles; redactar el Enunciado del trabajo; investigar cada parte de la familia; especificar requisitos. | Enunciado del trabajo; Plan del proyecto; Especificación de requisitos |
| 2 | Diseño y construcción | Diseñar la arquitectura y el modelo de datos; construir los módulos M1 a M5; cargar el contenido de las normas; aplicar pruebas unitarias. | Diseño de software; código en el repositorio; reportes de avance |
| 3 | Pruebas, entrega y cierre | Integrar y probar; completar M6 y M7; evaluar una organización de ejemplo; preparar la presentación. | Informe de pruebas; manuales; acta de aceptación; presentación |

## 8. Entregables

**Tabla 9**
*Entregables de la actividad*

| N.º | Entregable | Formato |
| --- | --- | --- |
| 1 | Código fuente completo en un repositorio Git con historial de commits de todos los integrantes. | Enlace al repositorio |
| 2 | Sistema funcional instalado o desplegado, con usuario de prueba para el docente. | URL o instalador |
| 3 | Informe técnico: introducción, requisitos, arquitectura, modelo de datos, justificación tecnológica y pruebas. | PDF, formato APA 7 |
| 4 | Carpeta de evidencias del Perfil Básico: enunciado, plan, actas, solicitudes de cambio, informe de pruebas y acta de aceptación. | PDF o carpeta comprimida |
| 5 | Manual de usuario y manual técnico de instalación. | PDF |
| 6 | Reporte de evaluación de una organización de ejemplo generado por el propio sistema. | PDF o hoja de cálculo |
| 7 | Presentación y demostración en vivo de 10 minutos por equipo. | Exposición |

## 9. Rúbrica de evaluación

**Tabla 10**
*Rúbrica de evaluación del proyecto*

| Criterio | Peso | Excelente (100 %) | Aceptable (60 %) | Insuficiente (20 %) |
| --- | --- | --- | --- | --- |
| Biblioteca y fichas de normas (M1, M2) | 20 % | Todas las partes de la Tabla 6, con información coherente, citada y redactada con paráfrasis propia. | Faltan partes o la información es superficial. | Contenido incompleto o copiado. |
| Acceso a documentos (M3) | 10 % | Botón funcional en cada norma, enlaces verificados y tipo de acceso indicado. | Botones con enlaces rotos o sin tipo de acceso. | Sin botón o con archivos redistribuidos indebidamente. |
| Listas de verificación (M4) | 20 % | Ítems completos por norma, cuatro valores de respuesta y evidencias adjuntas. | Listas parciales o sin evidencias. | Sin listas funcionales. |
| Estado y tablero (M5) | 15 % | Cálculo correcto según la fórmula, estados automáticos y gráficos claros. | Cálculo con errores menores. | Sin cálculo o con resultados incorrectos. |
| Reportes y administración (M6, M7) | 10 % | Exporta reportes y gestiona contenido y usuarios por rol. | Solo una de las dos funciones. | Ninguna de las dos. |
| Calidad técnica | 10 % | Arquitectura por capas, pruebas automatizadas, repositorio ordenado y README. | Código funcional con poca organización. | Código desordenado o sin versionar. |
| Evidencias ISO/IEC 29110 | 10 % | Productos de GP e IS completos y coherentes con el proyecto. | Productos incompletos. | Sin evidencias. |
| Presentación | 5 % | Demostración fluida y respuestas fundamentadas. | Demostración con fallos menores. | No presenta. |

## 10. Normas de presentación e integridad académica

- Los documentos escritos siguen el formato APA 7: Times New Roman 12, interlineado 1,5 y sangría de 1,27 cm.
- Toda información sobre las normas debe citar su fuente; el plagio o la copia textual de documentos protegidos anula el criterio correspondiente.
- Si se usan herramientas de inteligencia artificial, el equipo debe declararlo en el informe e indicar en qué partes las empleó.
- Cada integrante debe demostrar su aporte mediante commits y su participación en la exposición.

## 11. Referencias

ISO/IEC. (2024a). *ISO/IEC 29110-1-1:2024. Systems and software engineering — Lifecycle profiles for very small entities (VSEs) — Part 1-1: Overview*. International Organization for Standardization. https://www.iso.org/standard/85337.html

ISO/IEC. (2024b). *ISO/IEC 29110-1-2:2024. Systems and software engineering — Lifecycle profiles for very small entities (VSEs) — Part 1-2: Vocabulary*. International Organization for Standardization.

ISO/IEC. (2025a). *ISO/IEC 29110-3-2:2018/Amd 1:2025. Systems and software engineering — Lifecycle profiles for very small entities (VSEs) — Part 3-2: Conformity certification scheme — Amendment 1*. International Organization for Standardization. https://www.iso.org/standard/62732.html

ISO/IEC. (2025b). *ISO/IEC 29110-5-4:2025. Systems and software engineering — Life cycle profiles for very small entities (VSEs) — Part 5-4: Agile software development guidelines*. International Organization for Standardization. https://www.iso.org/standard/82668.html

Laporte, C. Y. (2016). *ISO/IEC 29110: Normas y guías de ingeniería de software y sistemas para entidades muy pequeñas* [Presentación]. Convención Informática 2016, La Habana, Cuba.
