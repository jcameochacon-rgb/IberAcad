import { UserPage } from "@/components/user-page";
import { UserDirectory, parseSearch } from "@/components/user-directory";
export default async function Buscar({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  return (
    <UserPage
      title="Buscar usuarios"
      lead="Encuentra cuentas por nombre, CI o correo. Filtra por rol y estado."
    >
      {({ selfId, roles }) => (
        <>
          {params.creado === "1" && (
            <p
              role="status"
              className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
            >
              Usuario creado. Se envió una invitación a su correo para que
              defina su contraseña.
            </p>
          )}
          <UserDirectory
            allowed={roles}
            mode="buscar"
            search={parseSearch(params, "buscar")}
            selfId={selfId}
          />
        </>
      )}
    </UserPage>
  );
}
