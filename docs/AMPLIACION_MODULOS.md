# Ampliación de módulos (filtros y módulos de IberAcadX)

## Qué se agregó

| Módulo | Dónde | Notas |
| --- | --- | --- |
| Filtros en consultas | Estudiantes, Cursos, Horarios, Asistencia, Calificaciones | Desplegables por columna además del buscador |
| Filtros en gestión | Fichas, Cursos, Matrículas, Asignaciones, Asignaturas | Gestión, curso, docente, materia, año y estado |
| Asignaturas | Administrar Asignaturas → Asignaturas | Catálogo de materias: registrar, editar, activar/inactivar |
| Personal administrativo | Gestión de Usuarios | Cuentas de Secretaría (solo Dirección) |
| Accesos de familias | Gestión de Usuarios | Cuentas de padres y tutores |
| Vincular cuenta a ficha existente | Crear usuario | Usa la misma invitación con enlace de verificación por correo |
| Eliminar borradores | Control de Asistencia / Gestión de Calificaciones | Solo registros en BORRADOR de tus cursos y materias |
| Informes guardados | Reportes Académicos → Generar / Consultar / Editar parámetros / Eliminar reporte | Guarda los filtros (no los datos) |
| Consultar asignaturas | Administrar Asignaturas | Todos los roles: docente sus materias, familia las del curso, administración todas |
| Editar asistencia | Control de Asistencia | Jornadas registradas con filtros (curso, mes, estado) y botón para reabrirlas |
| Editar calificaciones | Gestión de Calificaciones | Planillas por materia y trimestre con filtros y botón para reabrirlas |
| Consultar docentes | Gestión de Docentes | Plantel con especialidad, materias, periodos/semana y estado de la cuenta |
| Carga académica | Gestión de Docentes | Materias y cursos por docente (el docente ve la suya) |
| Horario del docente | Gestión de Docentes | Semana de clases de un docente en todos sus cursos |
| Cuentas de docentes | Gestión de Docentes | Accesos de los docentes al sistema |
| Secretaría administra cuentas | Gestión de Usuarios | Crea, edita y desactiva cuentas de estudiantes, docentes y familias; nunca de Dirección o Secretaría |

## Paso obligatorio en Supabase (una sola vez)

En Supabase → **SQL Editor**, pega y ejecuta el contenido de
`supabase/migrations/202611270001_ampliacion_modulos.sql`.

- Crea la tabla `reportes_guardados` y la función `eliminar_registro_academico`.
- Agrega permisos para que Secretaría administre solo cuentas no administrativas.
- Se puede ejecutar más de una vez sin borrar datos.
- No toca comunicados ni ninguna otra tabla existente.
- Es compatible con una base que ya tenga la actualización 0.10 de IberAcadX.

Sin este paso todo lo demás funciona; los informes guardados y la eliminación muestran un aviso pidiendo ejecutar el archivo, y Secretaría no verá las cuentas.

## Pruebas

- `npm run test:db`: 158 pruebas de base (incluye `supabase/tests/ampliacion.mjs`).
- `npm run test:web`: 37 pruebas unitarias.
- `npm run test:e2e`: 46 pruebas de navegador (más 2 que usan los datos de las anteriores) con datos ficticios.
