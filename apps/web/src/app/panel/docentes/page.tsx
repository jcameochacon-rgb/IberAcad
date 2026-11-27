import { loadTeacherDirectory } from "@/lib/data/teachers";
import { ListPage } from "@/components/list-page";
export default function TeacherDirectory() {
  return (
    <ListPage
      eyebrow="Gestión de docentes"
      title="Consultar docentes"
      lead="Plantel docente con su especialidad, materias asignadas, periodos semanales y estado de la cuenta de acceso."
      columns={[
        { key: "name", label: "Docente" },
        { key: "ci", label: "CI" },
        { key: "phone", label: "Teléfono" },
        { key: "specialty", label: "Especialidad", filter: true },
        { key: "subjects", label: "Materias" },
        { key: "periods", label: "Periodos/semana" },
        { key: "account", label: "Cuenta", filter: true },
        { key: "status", label: "Estado", filter: true },
      ]}
      load={loadTeacherDirectory}
      action="Ver ficha"
      searchLabel="Buscar por nombre o CI…"
      empty="Aún no hay docentes registrados. Usa «Fichas de docentes» para registrar el primero."
      denied="Solo Dirección y Secretaría pueden consultar el plantel docente."
      extra={{
        href: "/panel/gestion/docentes?nuevo=1",
        label: "Registrar docente",
      }}
    />
  );
}
