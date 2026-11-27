import { UserPage } from "@/components/user-page";
import { UserDirectory, parseSearch } from "@/components/user-directory";
export default async function Desactivar({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  return (
    <UserPage
      title="Desactivar usuarios"
      lead="Un usuario desactivado no puede iniciar sesión. No se borra ningún dato y puedes reactivarlo cuando quieras."
    >
      {({ selfId, roles }) => (
        <UserDirectory
          allowed={roles}
          mode="desactivar"
          search={parseSearch(params, "desactivar")}
          selfId={selfId}
        />
      )}
    </UserPage>
  );
}
