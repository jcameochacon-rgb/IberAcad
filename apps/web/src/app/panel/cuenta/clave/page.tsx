import { requireProfile } from "@/lib/auth";
import { PageTitle } from "@/components/page-title";
import { loadPanel } from "@/lib/data/live";
import { PanelShell } from "@/components/panel-shell";
import { AuthForm } from "@/components/auth-form";
import { Card } from "@/components/ui/card";

/** Cambio de contraseña con la sesión iniciada. */
export default async function CambiarClave() {
  await requireProfile();
  const model = await loadPanel();
  return (
    <PanelShell model={model}>
      <div className="mb-7">
        <p className="mb-2 text-xs text-muted-foreground">Mi cuenta</p>
        <PageTitle fallback="Cambiar contraseña" />
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          Elige una contraseña que solo tú conozcas. Al guardarla cerraremos tu
          sesión para que ingreses con la nueva.
        </p>
      </div>
      <Card className="max-w-xl p-6">
        <AuthForm mode="update" />
      </Card>
    </PanelShell>
  );
}
