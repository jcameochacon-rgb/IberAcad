"use client";
import { Button } from "@/components/ui/button";
export function PrintReport() {
  return <Button onClick={() => window.print()}>Imprimir / Guardar PDF</Button>;
}
