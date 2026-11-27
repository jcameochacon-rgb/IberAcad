import { requireProfile } from "@/lib/auth";
import { loadSubjectsView } from "@/lib/data/editing";
import { ListPage } from "@/components/list-page";
export default async function Subjects() {
  const { profile } = await requireProfile();
  const view = await loadSubjectsView();
  const admin = profile.rol === "DIRECTOR" || profile.rol === "SECRETARIA";
  return (
    <ListPage
      eyebrow="Administración de asignaturas"
      title="Consultar asignaturas"
      lead={
        admin
          ? "Materias asignadas a cada curso y su docente."
          : profile.rol === "DOCENTE"
            ? "Las materias y cursos que tienes asignados."
            : "Las materias del curso del estudiante."
      }
      columns={[
        { key: "subject", label: "Materia", filter: true },
        { key: "course", label: "Curso", filter: true },
        ...(view.showTeacher
          ? [{ key: "teacher", label: "Docente", filter: true }]
          : []),
        { key: "description", label: "Descripción" },
        ...(admin ? [{ key: "status", label: "Estado", filter: true }] : []),
      ]}
      load={async () => view.rows}
      searchLabel="Buscar materia o curso…"
      empty="Aún no hay materias asignadas."
      extra={
        admin
          ? {
              href: "/panel/gestion/asignaturas",
              label: "Gestionar asignaturas",
            }
          : undefined
      }
    />
  );
}
