import type { ReactNode } from "react";
import { roles, type Role } from "@iberdrola/shared";
import { managedBySecretary } from "@/lib/user-validation";
import { PageTitle } from "@/components/page-title";
import { requireProfile } from "@/lib/auth";
import { loadPanel } from "@/lib/data/live";
import { PanelShell } from "@/components/panel-shell";
import { Card } from "@/components/ui/card";

/**
 * Estructura común de Gestión de Usuarios. Dirección administra todas las
 * cuentas; Secretaría, solo las de estudiantes, docentes y familias.
 */
export async function UserPage({
  title,
  lead,
  children,
  directorOnly = false,
}: {
  title: string;
  lead: string;
  directorOnly?: boolean;
  children: (ctx: {
    selfId: string;
    roles: readonly Role[];
  }) => ReactNode | Promise<ReactNode>;
}) {
  const { profile, user } = await requireProfile();
  const model = await loadPanel();
  return (
    <PanelShell model={model}>
      <div className="mb-7">
        <p className="mb-2 text-xs text-muted-foreground">
          Gestión de usuarios
        </p>
        <PageTitle fallback={title} />
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          {lead}
        </p>
      </div>
      {profile.rol !== "DIRECTOR" &&
      (directorOnly || profile.rol !== "SECRETARIA") ? (
        <Card className="p-6 text-sm">
          {directorOnly
            ? "Solo Dirección puede administrar estas cuentas."
            : "Solo Dirección y Secretaría pueden administrar usuarios."}
        </Card>
      ) : (
        await children({
          selfId: user.id,
          roles: profile.rol === "DIRECTOR" ? roles : managedBySecretary,
        })
      )}
    </PanelShell>
  );
}
