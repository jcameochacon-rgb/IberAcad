"use client";
import { createContext, useContext } from "react";

/** Nombre de la opción del menú lateral que está abierta. */
export const ActiveNavLabel = createContext<string | null>(null);

/**
 * Título principal de una ventana del panel. Muestra el nombre de la opción
 * del menú que se eligió; si la ruta no aparece en el menú, usa `fallback`.
 */
export function PageTitle({ fallback }: { fallback: string }) {
  const label = useContext(ActiveNavLabel);
  return (
    <h1 className="text-3xl font-semibold tracking-tight">
      {label ?? fallback}
      <span className="text-primary">.</span>
    </h1>
  );
}
