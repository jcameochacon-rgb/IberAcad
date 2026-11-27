import Link from "next/link";
import { UserPage } from "@/components/user-page";
import { UserDirectory, parseSearch } from "@/components/user-directory";
import { Button } from "@/components/ui/button";
export default async function Personal({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  return (
    <UserPage
      directorOnly
      title="Personal administrativo"
      lead="Cuentas de Secretaría. Solo Dirección puede crearlas, editarlas o desactivarlas."
    >
      {({ selfId }) => (
        <>
          <Button asChild className="mb-5">
            <Link href="/panel/usuarios/nuevo">Crear cuenta de Secretaría</Link>
          </Button>
          <UserDirectory
            mode="buscar"
            search={parseSearch(params, "buscar")}
            selfId={selfId}
            fixedRole="SECRETARIA"
            path="/panel/usuarios/personal"
          />
        </>
      )}
    </UserPage>
  );
}
