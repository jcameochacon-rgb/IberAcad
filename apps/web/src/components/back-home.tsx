import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/** Botón visible para regresar a la página principal desde cualquier ventana. */
export function BackHome({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`back-home-btn ${className}`.trim()}>
      <ArrowLeft size={18} aria-hidden="true" />
      Volver a la página principal
    </Link>
  );
}
