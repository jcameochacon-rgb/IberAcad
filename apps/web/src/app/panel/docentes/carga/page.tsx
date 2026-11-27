import { requireProfile } from "@/lib/auth";
import { loadTeachingLoad } from "@/lib/data/teachers";
import { ListPage } from "@/components/list-page";
export default async function TeachingLoad() {
  const { profile } = await requireProfile();
  const admin = profile.rol === "DIRECTOR" || profile.rol === "SECRETARIA";
  const data = await loadTeachingLoad();
  return (
    <ListPage
      eyebrow="Gestión de docentes"
      title="Carga académica"
      lead={
        admin
          ? "Materias y cursos de cada docente, con los periodos semanales que ya tienen horario."
          : "Tus materias y cursos, con los periodos semanales asignados en el horario."
      }
      columns={[
        ...(admin ? [{ key: "teacher", label: "Docente", filter: true }] : []),
        { key: "course", label: "Curso", filter: true },
        { key: "subject", label: "Materia", filter: true },
        { key: "year", label: "Gestión", filter: true },
        { key: "periods", label: "Periodos/semana" },
        ...(admin ? [{ key: "status", label: "Estado", filter: true }] : []),
      ]}
      load={async () => data?.rows ?? null}
      action={admin ? "Editar" : undefined}
      searchLabel="Buscar docente, curso o materia…"
      empty="Aún no hay materias asignadas."
      denied="Tu cuenta no tiene carga académica."
      extra={
        admin
          ? {
              href: "/panel/gestion/asignaciones?nuevo=1",
              label: "Asignar materia",
            }
          : { href: "/panel/docentes/horario", label: "Ver mi horario" }
      }
    />
  );
}
