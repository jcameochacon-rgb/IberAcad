import { requireProfile } from "@/lib/auth";
import { canRecordGrades } from "@/lib/grades-validation";
import { loadGradeSheets } from "@/lib/data/editing";
import { ListPage } from "@/components/list-page";
export default async function EditGrades() {
  const { profile } = await requireProfile();
  const allowed = canRecordGrades(profile.rol);
  return (
    <ListPage
      current="calificaciones"
      eyebrow="Gestión de calificaciones"
      title="Editar calificaciones"
      lead="Planillas con notas registradas por materia y trimestre. Ábrela para corregir; si está publicada, despublícala primero desde la misma planilla."
      columns={[
        { key: "course", label: "Curso", filter: true },
        { key: "subject", label: "Materia", filter: true },
        { key: "term", label: "Trimestre", filter: true },
        { key: "students", label: "Estudiantes" },
        { key: "status", label: "Estado", filter: true },
      ]}
      load={async () => (allowed ? loadGradeSheets() : null)}
      action="Editar"
      searchLabel="Buscar curso o materia…"
      empty="Aún no hay calificaciones registradas. Usa «Registrar calificaciones» para empezar."
      denied="Tu cuenta puede consultar las calificaciones, pero no editarlas."
      extra={{
        href: "/panel/calificaciones/registro",
        label: "Registrar calificaciones",
      }}
    />
  );
}
