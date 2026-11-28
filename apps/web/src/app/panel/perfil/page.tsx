import { requireProfile } from "@/lib/auth";
import { loadPanel } from "@/lib/data/live";
import { PanelShell } from "@/components/panel-shell";
import { ProfileForm } from "@/components/profile-form";
export default async function Page() {
  const { user } = await requireProfile();
  const data = user.user_metadata?.contacto_personal;
  const model = await loadPanel();
  return (
    <PanelShell model={model}>
      <h1 className="mb-6 text-3xl font-semibold">Mi perfil</h1>
      <ProfileForm
        name={model.name}
        avatarUrl={model.avatarUrl}
        telefono={typeof data?.telefono === "string" ? data.telefono : ""}
        direccion={typeof data?.direccion === "string" ? data.direccion : ""}
      />
    </PanelShell>
  );
}
