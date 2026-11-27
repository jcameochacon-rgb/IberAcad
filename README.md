# Logo vectorial v0.9.3

Se incorpora el SVG facilitado como logo de IberAcad en portada, autenticación y menú del sistema, conservando su proporción y colores. Se mantiene el escudo del colegio. Actualiza conservando `apps/web/.env.local`, ejecuta `npm ci` y `npm run dev`. No requiere SQL.

# Rediseño visual v0.9.2

Portada azul profundo, panel claro azul y blanco, tarjetas suaves y animaciones accesibles inspiradas en las referencias facilitadas. Actualización exclusivamente visual: conserva las funciones, roles y CAPTCHA. Sigue [ACTUALIZACION_DISENO.md](docs/ACTUALIZACION_DISENO.md).

# Actualización v0.9.1: portada y CAPTCHA

Ocho imágenes del colegio, logo IberAcad e integración Cloudflare Turnstile. Consulta [PORTADA_Y_CAPTCHA.md](docs/PORTADA_Y_CAPTCHA.md) para actualizar y activar la protección en Supabase. Se conserva la fase académica actual.

# Iberdrola A: informes académicos v0.9

Proyecto del sistema `Next.js + React Native/Expo + Supabase + TypeScript`. Esta entrega añade informes de calificaciones publicadas y asistencia, descarga CSV e impresión para guardar como PDF. Conserva portada, gestión académica, asistencia, calificaciones, horarios y comunicados. No se ha desplegado ni conectado a un proyecto remoto. La aplicación móvil está pendiente.

**Si ya instalaste v0.8**, ejecuta solamente `supabase/migrations/202610130001_informes.sql` y verifica con `supabase/12_verificar_informes.sql`. Conserva `apps/web/.env.local` y sigue `docs/FASE_9_INFORMES.md`. Abre **Informes** en el menú. Desde versiones anteriores instala todas las migraciones que falten por orden de nombre hasta la de informes.

**Si ya instalaste v0.7**, ejecuta solamente `supabase/migrations/202610120001_comunicados.sql`, verifica con `supabase/11_verificar_comunicados.sql` y sigue `docs/FASE_8_COMUNICADOS.md`. Conserva tu `apps/web/.env.local`. Dentro del sistema abre **Comunicados → Abrir tablón de comunicados**. Desde versiones anteriores, completa todas las migraciones faltantes por orden de nombre hasta esta nueva migración.

**Si ya instalaste v0.6**, ejecuta solamente `supabase/migrations/202610090002_registro_horarios.sql`, conserva `apps/web/.env.local` y sigue `docs/FASE_7_PORTADA_HORARIOS.md`. No repitas la base inicial ni el primer director. La portada se abre en `/`; dentro del sistema visita **Horarios → Ver horario semanal**.

**Si ya instalaste v0.5**, ejecuta primero `supabase/migrations/202610090001_registro_calificaciones.sql` y después la migración de horarios indicada arriba. Conserva `apps/web/.env.local` y sigue `docs/FASE_6_REGISTRO_CALIFICACIONES.md`. No repitas la base inicial ni el primer director.

**Si ya instalaste v0.4**, ejecuta primero `supabase/migrations/202610070001_registro_asistencia.sql` y luego la migración de calificaciones indicada arriba. Conserva `apps/web/.env.local` y sigue `docs/FASE_5_REGISTRO_ASISTENCIA.md` para configurar las fechas reales de trimestres. No repitas las migraciones anteriores ni el primer director.

**Si ya instalaste v0.3**, ejecuta primero `supabase/migrations/202610060002_docentes_asignaciones.sql`, conserva `apps/web/.env.local` y sigue `docs/FASE_4_DOCENTES_ASIGNACIONES.md`. No repitas las migraciones previas ni el primer director. Después instala la migración de asistencia indicada arriba.

**Si ya instalaste v0.2**, instala primero `202610060001_gestion_academica.sql` y después `202610060002_docentes_asignaciones.sql`. No vuelvas a ejecutar la migración inicial ni el primer director. Después instala la migración de asistencia indicada arriba.

## Ejecutar la web en Windows

Requiere Node.js **22.12 o posterior** (se recomienda una versión LTS compatible) y npm. Descomprime el ZIP, abre una terminal en la carpeta `iberdrola-a` y ejecuta:

```powershell
npm ci
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) para ver la portada pública y pulsa **Iniciar sesión**. La portada no necesita Supabase. Sin variables de conexión, el login estará deshabilitado y mostrará las instrucciones. Puedes explorar [http://localhost:3000/demo](http://localhost:3000/demo) con datos ficticios sin crear cuentas ni instalar Supabase.

Para conectar la base ya instalada, ejecuta en PowerShell:

```powershell
Copy-Item apps/web/.env.example apps/web/.env.local
```

Edita `apps/web/.env.local`:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://TU_PROYECTO.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=TU_CLAVE_PUBLICABLE
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ENABLE_DEMO=true
```

Obtén URL y clave publicable desde el proyecto Supabase; el programa también acepta una clave legacy anon. Rechaza claves secretas/service_role. Los textos de ejemplo no son credenciales válidas. Reinicia `npm run dev` después de cambiar el archivo.

La base puede estar vacía: los módulos muestran un estado vacío sin inventar datos. La demo es independiente de las sesiones reales y de Supabase; cambiar su rol no asigna permisos a ninguna cuenta. Para producción establece `ENABLE_DEMO=false`, configura el origen HTTPS de la web y ejecuta `npm run build` y `npm start`.

## Esta fase web incluye

- Portada pública con información de las dos fuentes compartidas por el usuario, atribución visible, historia, contacto y acceso al login. No publica datos académicos ni atribuye a A logros específicos de B.
- Inicio y cierre de sesión con cookies de Supabase SSR y renovación mediante `proxy.ts`.
- Verificación de identidad en servidor y perfil institucional activo consultado desde PostgreSQL; no se toma el rol del cliente ni de user_metadata.
- Recuperación y actualización de contraseña, callback PKCE y confirmación token_hash para invitaciones/enlaces abiertos en otro navegador.
- Pantalla de acceso pendiente cuando Auth existe pero no hay perfil activo.
- Dashboard con datos autorizados y contadores exactos disponibles por rol.
- Consultas de estudiantes, cursos, calificaciones, asistencia, horarios y comunicados, con búsqueda y paginación sobre los registros cargados.
- Diseño adaptable a móvil y escritorio, base de componentes Tailwind compatibles con la configuración shadcn/ui y demo de los cinco roles.
- Tipos de las 28 tablas y dos vistas derivados de la migración local, compartibles con la futura app Expo.

**Gestión académica** permite registrar y editar estudiantes/tutores/docentes, reutilizar personas para docentes, crear y activar/desactivar cursos, vincular tutores, gestionar matrículas y asignar materias/docentes a cursos. Dirección y Secretaría pueden guardar; otros roles conservan sus consultas. Los guardados son transaccionales, usan RLS y detectan modificaciones simultáneas. Registrar fichas no crea cuentas Auth; se incluye un SQL seguro para vincular una cuenta docente previamente creada.

**Asistencia** permite a Dirección y docentes asignados cargar el curso/fecha, guardar marcas A/F/R/L y observaciones, publicar la lista completa y despublicar para corregir. No marca alumnos automáticamente; se usa la vigencia de matrícula en esa fecha, incluidos retiros históricos. La familia autorizada solo ve sus marcas publicadas. Exige curso/gestión activos, fecha no futura de La Paz y trimestre abierto con fechas reales. Secretaría mantiene consulta.

**Calificaciones** permite configurar actividades SER/SABER/HACER, registrar notas y autoevaluación, justificar extras, guardar borradores y publicar por estudiante. Dirección y los docentes de la materia pueden capturar; la familia solo ve sus notas publicadas. Los blancos son pendientes, la nota final se limita a 100 y los cambios simultáneos se detectan antes de sobrescribir. Consulta `docs/FASE_6_REGISTRO_CALIFICACIONES.md`.

**Horarios** permite a Dirección y Secretaría configurar horas de los periodos y añadir, editar o retirar clases con confirmación. Evita cruces de curso/docente y detecta versiones antiguas. Docente y familia tienen consulta semanal según RLS. No inventa horas ni recreos; los cambios guardados se ven inmediatamente. Consulta `docs/FASE_7_PORTADA_HORARIOS.md`.

Comunicados incorpora borradores, vista previa, publicación y retiro según permisos. Informes consulta datos publicados por curso y permite CSV e impresión/PDF. Aún faltan administración web de cuentas y envío push. El reemplazo de docente tras registrar actividad requiere una fase posterior que modele la responsabilidad por periodos; ahora se protege ese historial.

Los módulos de consulta del resumen conservan el límite de 100 registros y referencias auxiliares de 1000; su búsqueda es local y los contadores son exactos. **Gestión académica** busca en la base completa y pagina de 25 en 25, con fichas activas e inactivas. Sus selectores permiten buscar hasta 50 coincidencias por consulta. El resumen selecciona la gestión activa de año más alto; la gestión de cursos/matrículas incluye otras gestiones. El registro de asistencia carga la lista completa de la fecha, con un límite explícito de 500 matrículas; no aplica el límite del resumen.

## Estructura del proyecto

```text
apps/web/          Next.js App Router, autenticación, dashboard y consultas
packages/shared/   Tipos PostgreSQL, roles y etiquetas compartidas
supabase/          Migración, primer director, comprobación y pruebas SQL
scripts/           Generación de tipos y servidor simulado de pruebas web
tests/browser/     Pruebas de navegación y autenticación con servicios ficticios
docs/              Modelo de datos, validación y configuración de Auth
```

Consulta `docs/CONFIGURACION_WEB.md` para las URLs y plantillas de correo de Supabase.

## Instalación paso a paso

1. En [Supabase](https://supabase.com/dashboard), crea un proyecto nuevo para **Iberdrola A**. Conserva la contraseña de la base en tu gestor de contraseñas. Elige la región apropiada; São Paulo es una opción para evaluar desde Bolivia si aparece disponible. No se ha medido latencia para este colegio.
2. Abre **SQL Editor**, crea una consulta y pega **completo** `supabase/migrations/202610050001_base.sql`. Ejecuta una sola vez como propietario del proyecto. El archivo contiene una transacción: si hay un error, no continúes con un fragmento; revisa el mensaje.
3. Ejecuta `supabase/03_verificar_instalacion.sql`. Debes encontrar 28 tablas con RLS, 6 grados, 9 asignaturas, la gestión 2026, 3 trimestres y 6 periodos.
   Después instala `supabase/migrations/202610060001_gestion_academica.sql` y verifica sus cuatro funciones con `supabase/04_verificar_gestion_academica.sql`.
   Instala luego `supabase/migrations/202610060002_docentes_asignaciones.sql` y verifica con `supabase/05_verificar_docentes_asignaciones.sql`.
   Instala `supabase/migrations/202610070001_registro_asistencia.sql` y verifica con `supabase/07_verificar_registro_asistencia.sql`. Para fechas reales consulta `supabase/08_configurar_trimestre_asistencia.sql`.
   Instala `supabase/migrations/202610090001_registro_calificaciones.sql` y verifica con `supabase/09_verificar_registro_calificaciones.sql`.
   Instala `supabase/migrations/202610090002_registro_horarios.sql` y verifica con `supabase/10_verificar_registro_horarios.sql`. Luego instala `supabase/migrations/202610120001_comunicados.sql` y verifica con `supabase/11_verificar_comunicados.sql`. Finalmente instala `supabase/migrations/202610130001_informes.sql` y verifica con `supabase/12_verificar_informes.sql`.
4. En **Authentication > Users**, crea o invita a tu primera cuenta de Dirección. Para un sistema de altas institucionales, desactiva el registro público en la configuración de Auth y no habilites inicios anónimos. Crear una cuenta Auth no concede acceso a datos: hace falta el perfil autorizado.
5. Edita correo, nombres y apellidos en `supabase/02_primer_director.sql` y ejecútalo. No contiene contraseña ni crea cuentas directamente en `auth.users`. Vincula una cuenta que ya existe y le concede el rol `DIRECTOR`; rechaza sobrescribir perfiles o crear otro primer director.
6. Conserva el paquete en el repositorio del equipo. Los siguientes cambios de estructura serán migraciones nuevas, nunca volver a ejecutar la inicial sobre la misma base.

No hay conexión disponible a tu cuenta de Supabase en este entorno; ninguno de estos pasos remotos se ha ejecutado por ti. No es necesario compartir contraseñas ni claves secretas para instalar el SQL.

## Antes de empezar a registrar notas

- Crea los paralelos y cursos reales, las personas, estudiantes, tutores y docentes.
- Vincula tutores con estudiantes usando `estudiante_tutor`. Solo los responsables con `autorizado_consulta=true` pueden consultar a sus hijos. Un tutor puede tener varios hijos; un niño puede tener varios tutores.
- Para cuentas docentes/tutores/estudiantes, crea primero la ficha específica y después `perfiles` con la misma `persona_id`. `perfiles.id` es el UUID de Auth. Una persona tiene como máximo una cuenta y un rol en esta versión.
- Registra matrículas internas, fechas y asignaciones curso/asignatura/docente. Una matrícula activa por estudiante y gestión; traslados mediante cierre de la anterior y creación de otra sin solapar fechas.
- Configura fechas reales para cada trimestre y cambia su estado a `ABIERTO`. Las fechas quedan bloqueadas cuando existen registros académicos; Dirección puede cerrar o reabrir el estado, con auditoría.
- Configura las horas reales de los seis periodos. Cada periodo dura 40 minutos; todos deben estar dentro de 14:00–18:05 y no superponerse. Las horas se dejan vacías porque todavía no conocemos la ubicación de los 5 minutos que sobran respecto a los 240 minutos de clases. El sistema rechaza asignar horarios a periodos sin hora.

## Qué incluye

- 28 tablas, claves foráneas simples y compuestas, índices y restricciones.
- Roles `DIRECTOR`, `SECRETARIA`, `DOCENTE`, `PADRE` (incluye tutores) y `ESTUDIANTE`.
- Usuarios separados de las fichas personales: registrar un alumno no obliga a crearle cuenta ni correo.
- Asistencia diaria `A`, `F`, `R`, `L`, publicación de jornadas y resumen mensual.
- Actividades dinámicas SER/SABER/HACER; autoevaluación, extras con motivo y nota final calculada.
- Borradores invisibles para familias. Publicar exige información completa.
- Avance curricular, observaciones internas o compartidas, comunicados por curso/cuenta e institucionales, confirmación de lectura y tokens push privados.
- Auditoría de inserciones, cambios y eliminaciones sensibles; lectura solo por Dirección.
- Vistas con `security_invoker=true`, que respetan los permisos del usuario.

Los tokens push son solo la estructura de datos. El envío con Expo, las tareas de servidor, Storage, Realtime, importación de planillas, exportación de informes, Auth de las aplicaciones y pantallas se implementarán en fases posteriores. No hay un worker que envíe avisos en este paquete.

## Calificaciones

Las actividades de cada dimensión usan el mismo máximo: SER 10, SABER 45, HACER 40. Todas pesan igual dentro de su dimensión. No se mezclan puntajes de escalas distintas.

```text
SER   = redondear(promedio de todas las actividades SER)
SABER = redondear(promedio de todas las actividades SABER)
HACER = redondear(promedio de todas las actividades HACER)
FINAL = mínimo(100, redondear(SER + SABER + HACER + autoevaluación + extras))
```

El redondeo es al entero más cercano; para valores positivos, .5 sube. Se redondean las dimensiones por separado, siguiendo el ejemplo de la planilla. Se acepta autoevaluación entre 0 y 5, extras entre 0 y 100, y cada puntaje entre 0 y el máximo de su dimensión. El límite 100 de extras es una decisión técnica: puntos superiores no tendrían efecto en la nota final.

Se exige al menos una actividad en cada dimensión y todas las notas registradas. Una nota faltante no es un cero. Si falta una dimensión, una actividad o la autoevaluación, la vista devuelve `PENDIENTE` y `nota_final=NULL`; no permite publicación. Para alumnos trasladados, el docente debe definir la evaluación correspondiente antes de publicar. No hay exenciones de actividades en esta versión.

| Caso | Resultado |
|---|---:|
| SER 7,6,4; SABER 45; HACER 25; auto 3 | 79 |
| Base 48 + extras 5 | 53, aprobado |
| Base 97 + extras 8 | 100, aprobado |
| Nota final 50 | Reprobado |
| Nota final 51 | Aprobado |

Las notas publicadas se corrigen en tres pasos: **despublicar sin cambiar valores**, corregir, volver a publicar. Los criterios quedan bloqueados mientras haya alguna nota publicada de esa materia/trimestre. Un trimestre cerrado bloquea notas, criterios, avance, observaciones y la asistencia de sus fechas, incluso para Dirección. Dirección debe reabrir el trimestre explícitamente para corregir.

`v_calificaciones` es la fuente para notas finales. Los promedios y totales se calculan al consultar; no se almacenan como valores duplicados que puedan quedar desactualizados. No se ha definido promedio anual ni promoción automática: los documentos no fijan esas reglas.

## Asistencia

Se registra por jornada/curso y matrícula, sin duplicar el estudiante en la tabla. La fecha debe caer dentro de su matrícula. Se exige marcar a todos los alumnos de esa fecha antes de publicar. Borradores y ausencias de registro no se presentan a la familia como faltas.

`v_resumen_asistencia` incluye solo jornadas publicadas. Por decisión de diseño, porcentaje de presencia = `(A + R) / días registrados * 100`; licencia permanece en el denominador. La vista mantiene los cuatro conteos separados y se podrá ajustar esta definición si Dirección usa otro indicador. No equivale a días hábiles del calendario escolar, todavía no modelado.

## Permisos

| Operación | Dirección | Secretaría | Docente | Padre/tutor | Estudiante |
|---|---|---|---|---|---|
| Usuarios y roles | Gestiona | Sin edición de cuentas | Propio | Propio | Propio |
| Estudiantes/tutores | Gestiona | Gestiona | Lee de sus cursos | Lee sus hijos | Lee propio |
| Cursos y asignaciones | Gestiona | Gestiona | Lee asignados | Lee cursos de hijos | Lee propios |
| Asistencia | Gestiona | Lee | Gestiona sus cursos | Lee publicada de hijos | Lee publicada propia |
| Notas y criterios | Gestiona | Lee | Gestiona sus materias | Lee publicados de hijos | Lee publicados propios |
| Avance curricular | Gestiona | Lee | Gestiona sus materias | Lee de hijos | Lee propio |
| Observaciones | Gestiona | Lee | Gestiona sus materias | Solo compartidas de hijos | Solo compartidas propias |
| Comunicados | Gestiona | Gestiona | Sus avisos para cursos asignados | Lee recibidos | Lee recibidos |
| Configuración/trimestres | Gestiona | Lee | Lee | Lee | Lee |
| Tokens push | Su dispositivo | Su dispositivo | Su dispositivo | Su dispositivo | Su dispositivo |
| Auditoría | Lee | Sin acceso | Sin acceso | Sin acceso | Sin acceso |

Se evita el borrado de fichas, matrículas y asignaciones desde clientes; se desactivan o finalizan para preservar referencias e historial. Un docente de otra materia del mismo curso puede leer el listado de alumnos y pasar asistencia, pero no las notas de la materia ajena.

La matriz es una decisión de diseño basada en el flujo propuesto. El sistema usa la misma información y reglas para web y móvil; permisos no dependen de ocultar botones. La pertenencia a cursos conserva lectura histórica de matrículas anteriores. Los tutores autorizados pueden ver datos de los otros responsables vinculados a su hijo; no un directorio general de tutores.

## Seguridad y operación

- Las funciones con privilegios elevados viven en `private`; mantén este esquema fuera de **Exposed schemas**. No leen roles de `user_metadata` ni aceptan un rol declarado por el cliente.
- Las 28 tablas tienen RLS; `anon` no tiene acceso. Sin perfil activo no hay datos. Se revocan permisos implícitos y se conceden solo las operaciones declaradas.
- La administración de cuentas Auth y los avisos push requieren servidor. Las claves `service_role`/secretas se usan solo allí: eluden RLS. Nunca ponerlas en Next.js público, Expo ni variables `NEXT_PUBLIC_*` o `EXPO_PUBLIC_*`. Para clientes se utilizará la clave publicable del proyecto.
- Las pruebas simulan identidades para comprobar RLS. No prueban la emisión/verificación real de JWT de Supabase Auth ni la Data API remota. Antes de usar datos del colegio se debe repetir una prueba de extremo a extremo con cuentas ficticias reales.
- RLS controla autorización. Para operación real faltan las aplicaciones, revisión institucional de permisos, respaldos y recuperación, tratamiento de datos y retención de auditoría. La auditoría almacena valores anteriores/nuevos y puede contener datos personales; es de acceso exclusivo de Dirección.
- Un nuevo usuario de Auth no recibe automáticamente un rol. El primer director se asigna desde SQL confiable; los siguientes se gestionarán mediante un flujo administrativo de servidor.

## Pruebas reproducibles

Requiere Node.js 22.12 o posterior y npm. En esta carpeta:

```bash
npm ci
npm test
```

Las pruebas ejecutan el SQL completo en un PostgreSQL embebido (PGlite), con datos ficticios y un esquema `auth` mínimo, y verifican validaciones web con Vitest. Todo ocurre en memoria; no conectan a Supabase y no necesitan credenciales. No ejecutar el bootstrap de pruebas en un proyecto real.

Consulta `docs/VALIDACION.md` para la base y `docs/VALIDACION_WEB.md` para la web y sus límites. La migración está dirigida a PostgreSQL 15+; el servicio remoto queda por instalar y verificar.

## Documentación de origen y decisiones confirmadas

Se revisaron los tres PDFs entregados: entrevista, planillas y capítulos 1/2. Se aplican las aclaraciones posteriores del usuario: **solo Primaria**, horario **14:00–18:05**, y **extras con nota final máxima 100**. Los PDFs no se incluyen en este paquete y no se importaron los alumnos de ejemplo.

El documento académico todavía menciona Inicial en su alcance/límites; este SQL sigue la aclaración de Primaria y esa redacción se debe actualizar cuando se revise el documento. La planilla es una referencia; algunos totales mostrados no coinciden entre columnas, por lo que se implementa la fórmula verificable y no se copian resultados inconsistentes.

No reemplaza RUDE ni el Sistema Académico del Ministerio. No hay pagos, biblioteca, biometría, chat o videollamadas.

## Referencias técnicas oficiales

- [Supabase: Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase: Managing User Data](https://supabase.com/docs/guides/auth/managing-user-data)
- [Supabase: Functions](https://supabase.com/docs/guides/database/functions)

Próxima fase propuesta: administración de cuentas y vinculación de perfiles desde la web. La conexión a tu proyecto remoto se configura según `docs/CONFIGURACION_WEB.md`.
