import { AuthShell } from "@/components/auth-shell";
import { AuthForm } from "@/components/auth-form";
import { requireIdentity } from "@/lib/auth";
export const dynamic = "force-dynamic";
export default async function Update() {
  await requireIdentity();
  return (
    <AuthShell>
      <p className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-primary">
        Bienvenidos a IberAcad
      </p>
      <h2 className="text-3xl font-semibold tracking-tight">
        Tu nueva contraseña
      </h2>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        Guarda una contraseña que solo tú conozcas. Después inicia sesión con
        ella.
      </p>
      <AuthForm mode="update" />
    </AuthShell>
  );
}
