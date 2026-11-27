# IberAcad – Segunda actualización del sidebar

## Cambios
- Se eliminó la fila Resumen de la navegación lateral para todos los roles. La página de resumen sigue existiendo.
- El logo IberAcad es un enlace accesible al resumen: `/panel` en producción y `/demo?rol=...` en demostración. Al pulsarlo se cierra el menú móvil y se restablecen los desplegables.
- Una función central `operationTitle` genera los encabezados de las operaciones. Se utiliza en la barra superior, `CrudHeading`, las consultas generales y las fichas de gestión (incluidos cursos, tutores, matrículas y asignaciones). Ejemplos: Consultar usuarios, Registrar docentes, Editar calificaciones, Eliminar asignaturas, Matricular estudiante y Generar informe o reporte.
- Se mantienen las secciones por rol, los enlaces de las operaciones y sus permisos. No hay cambios en la lógica de negocio, el esquema ni las dependencias.

## Instalación
El ZIP completo incluye la actualización anterior. El ZIP parcial contiene los cambios de esta segunda actualización y se aplica sobre la versión con el sidebar de ocho módulos. Extraer las carpetas en la raíz del proyecto, reemplazar los archivos coincidentes y ejecutar `npm run typecheck`, `npm run test:web`, `npm run build`. Para las pruebas de navegador, con el entorno de prueba configurado, ejecutar `npm run test:e2e -- tests/browser/sidebar.spec.ts`.

## Verificación
- Comprobación de tipos aislada de la configuración de navegación con TypeScript.
- Comparación automática con la versión anterior: 264 rutas de operaciones idénticas (demostración y real), mismas acciones y secciones para los cinco roles, 56 títulos distintos para las operaciones del administrador.
- Comprobación de sintaxis TypeScript/TSX y actualización de pruebas unitarias y de navegador.
- No se ejecutaron la compilación completa de Next.js ni las pruebas de navegador porque no están instaladas las dependencias del proyecto en este entorno. No se modificó el despliegue ni la base de datos.
