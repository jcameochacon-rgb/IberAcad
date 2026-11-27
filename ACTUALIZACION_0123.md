# IberAcad 0.12.3 — Carga, consultas y acceso

## Instalar sobre tu proyecto actual

1. Haz una copia de seguridad de tu carpeta actual.
2. Abre la carpeta `actualizacion-web` incluida en este ZIP. Copia su carpeta `apps` dentro de la raíz de TU proyecto (donde está `package.json`). Combina las carpetas y reemplaza únicamente los archivos coincidentes. No borres tu carpeta `apps` completa.
3. Conserva tus archivos `.env.local`, `.env`, `apps/mobile/app.json`, `apps/mobile/eas.json`, iconos y configuración de Expo. La carpeta `actualizacion-web` solo contiene los archivos web modificados; no contiene credenciales ni configuración móvil.
4. Desde la raíz de tu proyecto ejecuta `npm run typecheck`, `npm run test:web` y `npm run build`.
5. Sube los cambios a tu repositorio conectado a Vercel y espera el despliegue de producción. Abre tu dominio habitual y recarga la página.

No hay dependencias nuevas ni migraciones SQL. Si tu APK ya abre el dominio de producción correcto, estos cambios aparecerán al volver a abrir o recargar la aplicación; no hace falta generar otra APK. El ZIP también incluye `iberdrola-a`, una copia completa de la base del proyecto, pero utiliza `actualizacion-web` para conservar los ajustes que hiciste en tu equipo.

## Qué cambia

- Pantalla de carga con logo, indicador animado y mensaje accesible. Oculta temporalmente el pie de página durante la carga; vuelve a mostrarlo cuando termina. Se cubre también la espera de la sesión del panel.
- Login blanco y azul con bienvenida a toda la comunidad, información organizada en dos columnas y espaciados compactos. Se comprobó que encaja en 1440 × 900, 1366 × 768 y 1280 × 720. En pantallas estrechas, con zoom, teclado abierto o mensajes adicionales, permite el desplazamiento necesario para mantener accesibles el formulario y el CAPTCHA.
- Calificaciones: selección de gestión; búsqueda por nombre, CI y contenido; filtros por curso, asignatura, trimestre, situación, publicación y rango de nota. Las notas pendientes no se interpretan como cero.
- Asistencia: gestión, estudiante/CI, curso, marca, estado de la jornada y fechas inclusivas desde/hasta. Ordenación por fecha o nombre.
- Registro de asistencia: búsqueda del estudiante y filtro por marca. Los filtros solo ocultan filas visualmente. Guardar/publicar conserva la lista completa y sus cambios; marcar presentes afecta a todos los alumnos sin marcar.
- Horarios: selector de curso y filtros por día, periodo, asignatura y docente, con vistas Semana y Lista.
- Usuarios y asignaturas: barra uniforme con búsqueda, estado, orden y rol/categoría cuando corresponde.
- Estudiantes, docentes, tutores, cursos, matrículas y asignaciones: presentación uniforme de los filtros ya disponibles.
- Informes: búsqueda y filtros de la tabla del informe, y búsqueda en informes guardados. Los filtros de tabla ajustan la vista; PDF/CSV conservan todas las filas del informe generado. Para cambiar el alcance exportado, usa los filtros de generación.
- Botón para limpiar filtros, contador de resultados y controles adaptados a móvil.

## Alcance de los datos

Las consultas académicas completas recuperan las páginas de datos de la gestión seleccionada, manteniendo la sesión y las políticas RLS. Ya no buscan solamente en los últimos 100 registros. Los filtros combinados de la tabla se aplican sobre ese conjunto autorizado y después se pagina la presentación. Hay un máximo explícito de 10.000 filas por consulta; si se supera, se indica utilizar Informes y reportes por curso y periodo, en lugar de mostrar una lista incompleta como si fuera completa. Los resúmenes del inicio siguen siendo vistas abreviadas.

## Validación

- 76 pruebas unitarias web.
- Tipado web y móvil, lint y compilación de producción.
- Navegador Chromium con base PostgreSQL de prueba local: consultas con datos ficticios, búsqueda sin tildes, filtros, vista móvil, horarios y carga.
- Se verificó que filtrar la lista de asistencia no recorta los datos enviados al guardar.
- El CAPTCHA fue simulado únicamente en las pruebas del navegador. La aplicación conserva la integración y las comprobaciones reales existentes.
- No se modificaron datos de producción ni se enviaron invitaciones por correo.

## Archivos incluidos en la actualización parcial

- `apps/web/src/app/globals.css`
- `apps/web/src/app/login/page.tsx`
- `apps/web/src/app/panel/[modulo]/page.tsx`
- `apps/web/src/app/panel/asistencia/registro/page.tsx`
- `apps/web/src/app/panel/calificaciones/registro/page.tsx`
- `apps/web/src/app/panel/gestion/[seccion]/page.tsx`
- `apps/web/src/app/panel/horarios/semana/page.tsx`
- `apps/web/src/app/panel/informes/page.tsx`
- `apps/web/src/app/panel/layout.tsx`
- `apps/web/src/app/panel/loading.tsx`
- `apps/web/src/components/academic-loading.tsx`
- `apps/web/src/components/attendance-form.tsx`
- `apps/web/src/components/auth-shell.tsx`
- `apps/web/src/components/captcha.tsx`
- `apps/web/src/components/crud-table.tsx`
- `apps/web/src/components/module-page.tsx`
- `apps/web/src/components/records-table.tsx`
- `apps/web/src/components/report-table.tsx`
- `apps/web/src/components/saved-reports.tsx`
- `apps/web/src/components/schedule-consultation.tsx`
- `apps/web/src/components/table-toolbar.tsx`
- `apps/web/src/lib/data/live.test.ts`
- `apps/web/src/lib/data/live.ts`
- `apps/web/src/lib/data/model.ts`
- `apps/web/src/lib/table-filters.test.ts`
- `apps/web/src/lib/table-filters.ts`
