# IberAcad — reorganización del menú por rol (base 0.12.3)

## Instalación

Usa la carpeta `iberdrola-a` como proyecto completo o copia únicamente los archivos de `actualizacion-sidebar.zip` sobre la raíz de tu proyecto actual, combinando carpetas. Conserva tus `.env`, configuración y cambios propios. No hay dependencias nuevas, migraciones, ni cambios a la configuración móvil.

Si ya tienes el dominio de producción configurado en el APK, despliega los cambios web y vuelve a abrir la aplicación. El APK usa WebView, por lo que no necesita recompilarse por este cambio de navegación.

## Módulos principales

- Administrador (DIRECTOR) y Personal administrativo (SECRETARIA): Gestión de usuarios, Registro de estudiantes, Gestión de docentes, Administración de asignaturas, Control de horarios, Control de asistencia, Gestión de calificaciones, Informes y reportes.
- Docente: Administración de asignaturas, Control de horarios, Control de asistencia, Gestión de calificaciones, Informes y reportes.
- Padre/tutor: Registro de estudiantes, Control de horarios, Control de asistencia, Gestión de calificaciones.
- Estudiante: Control de horarios, Control de asistencia, Gestión de calificaciones.

Resumen sigue siendo el acceso independiente al inicio, no se cuenta como módulo. Las fichas y cuentas familiares y el personal administrativo permanecen bajo Gestión de usuarios (según permisos); Matrículas pasa a Registro de estudiantes; Gestión de Cursos y Asignación de materias permanecen bajo Administración de asignaturas. El docente conserva Consultar estudiantes dentro de Administración de asignaturas. Estudiante y Padre conservan Consultar asignaturas dentro de Control de horarios e Informes y reportes dentro de Gestión de calificaciones. No se cambiaron las rutas, operaciones, roles ni permisos.

## Validación

Se comprobó el tipado de la configuración de navegación con TypeScript, la sintaxis TS/TSX de los archivos editados y la igualdad de las opciones, acciones y 264 enlaces (producción y demo) frente al ZIP original para los cinco roles. Se actualizaron las pruebas unitarias y de navegador. No se ejecutaron Vitest, Playwright ni una compilación integral de Next.js en este entorno porque no están instaladas las dependencias locales. Tampoco se desplegó la aplicación ni se modificó la base de datos.

Para verificar en tu entorno, desde la raíz ejecuta `npm run typecheck`, `npm run test:web`, `npm run build` y, si tienes el entorno de pruebas configurado, `npm run test:e2e`. Revisa el menú con las cinco cuentas o mediante `/demo?rol=DIRECTOR`, `SECRETARIA`, `DOCENTE`, `PADRE` y `ESTUDIANTE` cuando la demo esté habilitada.
