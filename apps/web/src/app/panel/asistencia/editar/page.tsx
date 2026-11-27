import { requireProfile } from "@/lib/auth";
import { canRecordAttendance } from "@/lib/attendance-validation";
import { loadAttendanceDays } from "@/lib/data/editing";
import { ListPage } from "@/components/list-page";
export default async function EditAttendance() {
  const { profile } = await requireProfile();
  const allowed = canRecordAttendance(profile.rol);
  return (
    <ListPage
      current="asistencia"
      eyebrow="Control de asistencia"
      title="Editar asistencia"
      lead="Jornadas ya registradas. Abre una para corregir sus marcas; si está publicada, primero despublícala desde la misma planilla."
      columns={[
        { key: "course", label: "Curso", filter: true },
        { key: "date", label: "Fecha" },
        { key: "month", label: "Mes", filter: true },
        { key: "marks", label: "Marcas" },
        { key: "status", label: "Estado", filter: true },
      ]}
      load={async () => (allowed ? loadAttendanceDays() : null)}
      action="Editar"
      searchLabel="Buscar curso o fecha…"
      empty="Aún no hay jornadas registradas. Usa «Registrar asistencia» para crear la primera."
      denied="Tu cuenta puede consultar la asistencia, pero no editarla."
      extra={{
        href: "/panel/asistencia/registro",
        label: "Registrar asistencia",
      }}
    />
  );
}
