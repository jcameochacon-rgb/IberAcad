import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { UserPage } from "@/components/user-page";
import { UserDirectory, parseSearch } from "@/components/user-directory";
import { EditUserForm, ActiveToggle } from "@/components/user-forms";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { loadUser } from "@/lib/data/users";
import { uuidRe } from "@/lib/user-validation";
import { roleLabels } from "@iberdrola/shared";

export default async function Editar({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const id =
    typeof params.id === "string" && uuidRe.test(params.id) ? params.id : "";
  return (
    <UserPage
      title="Editar usuario"
      lead="Busca a la persona y actualiza sus datos, su rol o su correo."
    >
      {async ({ selfId, roles }) => {
        if (!id)
          return (
            <>
              {params.guardado === "1" && (
                <p
                  role="status"
                  className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
                >
                  Cambios guardados correctamente.
                </p>
              )}
              <UserDirectory
                allowed={roles}
                mode="editar"
                search={parseSearch(params, "editar")}
                selfId={selfId}
              />
            </>
          );
        const found = await loadUser(id);
        if (!found)
          return (
            <Card className="p-6 text-sm">
              El usuario no existe.{" "}
              <Link
                className="font-semibold text-primary underline"
                href="/panel/usuarios/editar"
              >
                Volver a buscar
              </Link>
            </Card>
          );
        const { user, emailsAvailable } = found;
        return (
          <div className="max-w-3xl space-y-5">
            <Button asChild variant="outline" size="sm">
              <Link href="/panel/usuarios/editar">
                <ArrowLeft size={14} /> Volver a la búsqueda
              </Link>
            </Button>
            <Card className="p-6">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">{user.fullName}</h2>
                  <p className="text-xs text-muted-foreground">
                    {roleLabels[user.rol]} ·{" "}
                    {user.activo ? "Activo" : "Inactivo"}
                  </p>
                </div>
                <ActiveToggle user={user} self={user.id === selfId} />
              </div>
              <EditUserForm
                key={user.version}
                user={user}
                emailsAvailable={emailsAvailable}
                allowed={roles}
              />
            </Card>
          </div>
        );
      }}
    </UserPage>
  );
}
