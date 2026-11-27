# Ajuste de pantalla de contraseña

- Se reutiliza el diseño compacto de acceso en `/actualizar-clave` y `/recuperar-clave`.
- En escritorio (desde 1024 px CSS) se definen explícitamente dos columnas, panel azul y formulario. En pantallas estrechas se oculta el panel decorativo y se conserva el logo en el formulario.
- La altura puede crecer si se muestran errores o si el usuario aumenta el zoom: no se recorta el contenido ni se bloquea el scroll necesario.
- No se modifican las acciones de autenticación, las validaciones, el correo, los tokens ni los permisos.
- Prueba de regresión incluida en `tests/browser/web.spec.ts` (requiere instalar las dependencias del repositorio).
