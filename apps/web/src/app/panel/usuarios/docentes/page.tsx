import Link from "next/link";
import { UserPage } from "@/components/user-page";
import { UserDirectory, parseSearch } from "@/components/user-directory";
import { Button } from "@/components/ui/button";
import { UnlinkedPeople } from "@/components/unlinked-people";
export default async function TeacherAccounts({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  return (
    <UserPage
      title="Cuentas de docentes"
      lead="Accesos de los docentes al sistema. Cada cuenta ve solo sus cursos y materias asignadas."
    >
      {({ selfId, roles }) => (
        <>
          <div className="mb-5 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/panel/usuarios/nuevo">Crear cuenta de docente</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/panel/docentes">Consultar docentes</Link>
            </Button>
          </div>
          <UserDirectory
            allowed={roles}
            mode="buscar"
            search={parseSearch(params, "buscar")}
            selfId={selfId}
            fixedRole="DOCENTE"
            path="/panel/usuarios/docentes"
          />
          <UnlinkedPeople
            kind="DOCENTE"
            title="Docentes sin cuenta"
            lead="Tienen ficha de docente pero todavía no pueden entrar al sistema. «Crear acceso» envía el enlace de verificación a su correo."
          />
        </>
      )}
    </UserPage>
  );
}
