import { UserPage } from "@/components/user-page";
import { CreateUserForm } from "@/components/user-forms";
import { Card } from "@/components/ui/card";
import { getAdminConfig, getAdminStatus } from "@/lib/env";
import { loadUnlinkedPeople } from "@/lib/data/users";
export default async function Nuevo({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const initialPerson =
    typeof params.persona === "string" ? params.persona : "";
  const people = await loadUnlinkedPeople();
  return (
    <UserPage
      title="Crear usuario"
      lead="Registra a una persona nueva o vincula una ficha existente (estudiante, docente o tutor). Recibirá un correo con el enlace de verificación para crear su contraseña."
    >
      {({ roles }) => (
        <Card className="max-w-3xl p-6">
          <CreateUserForm
            keyReady={!!getAdminConfig()}
            keyStatus={getAdminStatus()}
            people={people}
            allowed={roles}
            initialPerson={initialPerson}
          />
        </Card>
      )}
    </UserPage>
  );
}
