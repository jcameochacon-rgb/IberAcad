/**
 * Animación de carga de IberAcad: escudo con halo, anillo giratorio y barra
 * de progreso. `overlay` cubre la pantalla (al iniciar sesión).
 */
export function BrandLoader({
  message = "Cargando tu información académica…",
  overlay = false,
}: {
  message?: string;
  overlay?: boolean;
}) {
  return (
    <div
      className={overlay ? "iber-loader iber-loader-overlay" : "iber-loader"}
      role="status"
      aria-live="polite"
    >
      <div className="iber-loader-mark" aria-hidden="true">
        <span className="iber-loader-ring" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/app-icons/icon-192.png" alt="" width={72} height={72} />
      </div>
      <p className="iber-loader-text">{message}</p>
      <span className="iber-loader-bar" aria-hidden="true">
        <span />
      </span>
    </div>
  );
}
