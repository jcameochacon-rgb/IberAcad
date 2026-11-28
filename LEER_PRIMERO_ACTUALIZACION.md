# IberAcad — actualización institucional y de perfiles

Base: el ZIP `IberAcad_Web_Movil_contrasena_corregida (1).zip` entregado por el usuario. Se conservan la estructura móvil, el flujo de contraseñas y la configuración propia incluida en esa entrega.

## Instalar esta actualización

1. Guarda una copia de tu proyecto actual y extrae esta carpeta `iberdrola-a`.
2. En tu Supabase, abre **SQL Editor → New query**. Copia y ejecuta **todo** el archivo `supabase/13_avatares.sql`. Este script complementa la base existente: crea el depósito privado de fotos, sus políticas y la operación de desactivación de docentes. No borra estudiantes, cuentas ni registros académicos. Es repetible. No vuelvas a ejecutar los scripts iniciales sobre una base que ya funciona.
3. Conserva tus variables de entorno actuales en Vercel y tus archivos locales de configuración. Esta entrega no contiene contraseñas ni claves del proyecto.
4. Actualiza el código del repositorio conectado a Vercel y realiza un nuevo despliegue. Mantén la carpeta raíz y los comandos de compilación de tu proyecto existente.
5. Para comprobarlo localmente, desde `iberdrola-a` ejecuta `npm ci`, después `npm run typecheck`, `npm run test:web` y `npm run build`. Usa `npm run dev` para abrir la web.
6. Entra con una cuenta autorizada y revisa Inicio, Mi perfil, Resumen y las opciones actualizadas del menú.

El SQL y el despliegue **no se han ejecutado en tu Supabase o Vercel real** durante esta revisión. Las pruebas se realizaron con datos ficticios locales.

## Qué cambia

- Navegación institucional fija, enlaces animados y nombre «Nuestra Institución».
- Las tres escenas HTML entregadas se integran como ilustraciones animadas por desplazamiento en Inicio, Nuestra Institución y Vida escolar. Se adaptaron textos y contraste al colegio. El libro conserva su profundidad y giro. Hay un acceso para saltar cada escena y soporte para movimiento reducido.
- Se retiran el botón y el bloque de acceso redundantes solicitados en Inicio. El acceso principal sigue en la navegación.
- Más contenido editorial y fotografías; trayectoria ampliada usando el Word facilitado. Los logros que el documento atribuye a Iberdrola B se identifican como tales.
- Contactos institucionales: correo, WhatsApp (+591 74075453) y Facebook. Pie de página también en el login.
- Usuario en la esquina superior derecha, con el cierre de sesión a su izquierda y Mi perfil desplegable debajo; menú Mi perfil con ratón o toque. Se retiran las rutas del encabezado derecho.
- Botón Generar PDF del resumen al principio del panel.
- Usuarios: crear, buscar, editar y desactivar. Vinculación familiar: registrar tutor, buscar tutor, editar ficha y desvincular hijo con búsqueda y confirmación.
- Docentes: desactivar ficha y acceso preservando asignaciones y datos académicos. Una reactivación posterior se gestiona desde Editar ficha y Editar usuarios; ambas activaciones deben revisarse.
- Se retira la eliminación de asistencia y calificaciones del menú y sus páginas de eliminación redirigen a la consulta. Se conservan las correcciones mediante Editar. La gestión de actividades de evaluación sin notas mantiene su lógica original.
- Registro de estudiantes, asignaturas, horarios e informes conservan sus operaciones.

## Foto y perfil

En el panel, pasa el cursor o toca tu nombre → **Mi perfil**. Selecciona una foto JPG, PNG o WebP de hasta 8 MB y pulsa **Guardar mi perfil**. La web recorta y comprime la imagen a JPEG de 384 × 384 antes de guardarla. El depósito es privado y cada cuenta solo puede leer o reemplazar su propia foto.

Las cuentas nuevas muestran sus iniciales hasta que su titular sube una foto. El perfil permite editar teléfono y dirección personales en los metadatos de la cuenta; estos datos no reemplazan la ficha oficial administrada por Secretaría. No permite cambiar nombre, CI, correo de acceso, rol ni datos académicos. Los permisos nunca se calculan a partir de estos metadatos personales.

## PDF y celular

En el navegador, **Generar PDF del resumen** abre la impresión: selecciona **Guardar como PDF**. Se ocultan la navegación y el pie de página. En la app compatible, utiliza el puente de exportación PDF que ya incluye el proyecto; se exportan indicadores y los cinco registros recientes de asistencia, calificaciones y horarios que aparecen en el resumen.

La APK que abre la dirección web actualizada recibe estos cambios al cargar de nuevo la página. No se cambió la configuración nativa, el identificador, el icono ni la firma de Android. Esta entrega es código fuente; no incluye una nueva APK compilada.

## Comprobaciones

- Tipos de TypeScript en web y móvil.
- Pruebas web de navegación, cuentas, validaciones y perfil.
- Pruebas PostgreSQL locales de permisos, desactivación sin borrado y aislamiento de avatares.
- Compilación web de producción y revisión ESLint.
- Navegación real con datos ficticios en navegador de escritorio y formato celular: escenas, menú fijo, login, resumen, perfil, vinculación familiar y exportación móvil.

No se enviaron invitaciones reales ni se modificaron usuarios del colegio. La subida de fotografías requiere instalar el SQL indicado y probar la conexión de Storage en tu proyecto real.


## Corrección visual del menú y encabezado

Las acciones Crear, Buscar, Editar y Desactivar usuarios aparecen directamente dentro de Gestión de usuarios. Vinculación familiar mantiene su propio desplegable. Se eliminó el nivel repetido «Gestionar usuarios».

Se simplificó el pie de página: contiene identidad institucional, ubicación y contactos; se retiraron el directorio de páginas, los enlaces de acceso/recuperación y el texto de roles. La paleta azul profundo, azul claro y turquesa une la navegación, las escenas y el pie.

Si ya ejecutaste `13_avatares.sql` en la entrega anterior, esta corrección visual no requiere otro cambio en Supabase: actualiza el código y vuelve a desplegar.

## Tema interior y animaciones

El panel usa una paleta unificada azul, celeste y turquesa en resumen, menú, formularios, búsquedas, filtros y tablas. Los menús animan apertura y cierre; los enlaces cerrados quedan fuera de la navegación por teclado. Los botones, controles y filas tienen respuestas visuales suaves al pasar el cursor, enfocar o pulsar. Se respeta la preferencia de movimiento reducido y los estilos de impresión.

Esta actualización solo cambia la presentación y el comportamiento visual. No requiere SQL adicional, cambios de permisos ni una nueva APK si tu app abre el mismo sitio web. Publica el código actualizado en Vercel. Los estilos internos están organizados en `apps/web/src/app/workspace-theme.css`.
