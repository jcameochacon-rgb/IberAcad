import { requireProfile } from "@/lib/auth";
import type { LinkRow } from "@/components/link-table";

type Person = {
  nombres?: string;
  apellido_paterno?: string | null;
  apellido_materno?: string | null;
  ci?: string | null;
  telefono?: string | null;
} | null;
const fullName = (p: Person) =>
  p
    ? [p.apellido_paterno, p.apellido_materno, p.nombres]
        .filter(Boolean)
        .join(" ")
    : "";
const courseLabel = (
  c?: {
    grado_id: number;
    paralelo: string;
    gestiones?: { anio: number } | null;
  } | null,
) => (c ? `${c.grado_id}° ${c.paralelo} · ${c.gestiones?.anio ?? ""}` : "");
const isAdmin = (rol: string) => rol === "DIRECTOR" || rol === "SECRETARIA";

/** Docentes con su cuenta, materias asignadas y periodos semanales. */
export async function loadTeacherDirectory(): Promise<LinkRow[] | null> {
  const { supabase, profile } = await requireProfile();
  if (!isAdmin(profile.rol)) return null;
  const [teachers, accounts, assignments, schedule] = await Promise.all([
    supabase
      .from("docentes")
      .select(
        "id,persona_id,especialidad,activo,personas(nombres,apellido_paterno,apellido_materno,ci,telefono)",
      )
      .limit(1000),
    supabase.from("perfiles").select("persona_id,activo").limit(5000),
    supabase
      .from("asignaciones_docente")
      .select("docente_id,activo")
      .limit(5000),
    supabase.from("horarios").select("docente_id").limit(20000),
  ]);
  if (teachers.error) throw Error("No se pudieron consultar los docentes.");
  const account = new Map(
    (accounts.data || []).map((a) => [a.persona_id, a.activo]),
  );
  const subjects = new Map<string, number>();
  for (const a of assignments.data || [])
    if (a.activo)
      subjects.set(a.docente_id, (subjects.get(a.docente_id) || 0) + 1);
  const periods = new Map<string, number>();
  for (const h of schedule.data || [])
    periods.set(h.docente_id, (periods.get(h.docente_id) || 0) + 1);
  return (teachers.data || [])
    .map((t) => {
      const access = account.get(t.persona_id);
      return {
        id: t.id,
        href: `/panel/gestion/docentes?id=${t.id}`,
        cells: {
          name: fullName(t.personas) || "Sin nombre",
          ci: t.personas?.ci || "",
          phone: t.personas?.telefono || "",
          specialty: t.especialidad || "Sin especialidad",
          subjects: String(subjects.get(t.id) || 0),
          periods: String(periods.get(t.id) || 0),
          account:
            access === undefined
              ? "Sin cuenta"
              : access
                ? "Con acceso"
                : "Cuenta desactivada",
          status: t.activo ? "Activo" : "Inactivo",
        },
      };
    })
    .sort((a, b) => a.cells.name.localeCompare(b.cells.name, "es"));
}

/** Carga académica: materias y cursos de cada docente (o del propio docente). */
export async function loadTeachingLoad(): Promise<{
  rows: LinkRow[];
  admin: boolean;
} | null> {
  const { supabase, profile } = await requireProfile();
  const admin = isAdmin(profile.rol);
  if (!admin && profile.rol !== "DOCENTE") return null;
  const [assignments, schedule] = await Promise.all([
    supabase
      .from("asignaciones_docente")
      .select(
        "id,activo,asignaturas(nombre),cursos(grado_id,paralelo,gestiones(anio)),docentes(personas(nombres,apellido_paterno,apellido_materno))",
      )
      .limit(2000),
    supabase.from("horarios").select("asignacion_docente_id").limit(20000),
  ]);
  if (assignments.error)
    throw Error("No se pudo consultar la carga académica.");
  const periods = new Map<string, number>();
  for (const h of schedule.data || [])
    periods.set(
      h.asignacion_docente_id,
      (periods.get(h.asignacion_docente_id) || 0) + 1,
    );
  return {
    admin,
    rows: (assignments.data || [])
      .filter((a) => admin || a.activo)
      .map((a) => {
        const course = courseLabel(a.cursos);
        return {
          id: a.id,
          href: admin ? `/panel/gestion/asignaciones?id=${a.id}` : undefined,
          cells: {
            teacher: fullName(a.docentes?.personas ?? null) || "Sin nombre",
            course,
            year: String(a.cursos?.gestiones?.anio ?? ""),
            subject: a.asignaturas?.nombre || "",
            periods: String(periods.get(a.id) || 0),
            status: a.activo ? "Activa" : "Inactiva",
          },
        };
      })
      .sort((x, y) =>
        `${x.cells.teacher}${x.cells.course}${x.cells.subject}`.localeCompare(
          `${y.cells.teacher}${y.cells.course}${y.cells.subject}`,
          "es",
          { numeric: true },
        ),
      ),
  };
}

export type TeacherWeek = {
  teachers: { id: string; label: string }[];
  selected: string;
  periods: { id: string; numero: number; time: string }[];
  cells: Record<string, { subject: string; course: string }>;
  total: number;
};

/** Horario semanal de un docente (Dirección/Secretaría eligen; el docente ve el suyo). */
export async function loadTeacherWeek(
  requested: string,
): Promise<TeacherWeek | null> {
  const { supabase, profile } = await requireProfile();
  const admin = isAdmin(profile.rol);
  if (!admin && profile.rol !== "DOCENTE") return null;
  const teachers = await supabase
    .from("docentes")
    .select("id,activo,personas(nombres,apellido_paterno,apellido_materno)")
    .limit(1000);
  // RLS: el docente solo recibe su propia ficha.
  const list = (teachers.data || [])
    .map((t) => ({
      id: t.id,
      label: fullName(t.personas) || "Sin nombre",
    }))
    .sort((a, b) => a.label.localeCompare(b.label, "es"));
  const selected = admin
    ? list.find((t) => t.id === requested)?.id || ""
    : list[0]?.id || "";
  const empty = {
    teachers: admin ? list : list.slice(0, 1),
    selected,
    periods: [],
    cells: {},
    total: 0,
  };
  if (!selected) return empty;
  const rows = await supabase
    .from("horarios")
    .select("dia_semana,periodo_id,gestion_id,asignacion_docente_id")
    .eq("docente_id", selected)
    .limit(500);
  if (rows.error) throw Error("No se pudo consultar el horario del docente.");
  const ids = [
    ...new Set((rows.data || []).map((r) => r.asignacion_docente_id)),
  ];
  // Periodos de las gestiones en las que el docente tiene clases.
  const years = [...new Set((rows.data || []).map((r) => r.gestion_id))];
  const periods = years.length
    ? await supabase
        .from("periodos")
        .select("id,numero,hora_inicio,hora_fin")
        .in("gestion_id", years)
        .order("numero")
    : { data: [] as never[] };
  const assignments = ids.length
    ? await supabase
        .from("asignaciones_docente")
        .select(
          "id,asignaturas(nombre),cursos(grado_id,paralelo,gestiones(anio))",
        )
        .in("id", ids)
    : { data: [] as never[] };
  const byId = new Map((assignments.data || []).map((a) => [a.id, a]));
  const cells: TeacherWeek["cells"] = {};
  for (const r of rows.data || []) {
    const a = byId.get(r.asignacion_docente_id);
    cells[`${r.dia_semana}|${r.periodo_id}`] = {
      subject: a?.asignaturas?.nombre || "",
      course: courseLabel(a?.cursos),
    };
  }
  return {
    ...empty,
    periods: (periods.data || []).map((p) => ({
      id: p.id,
      numero: p.numero,
      time:
        p.hora_inicio && p.hora_fin
          ? `${p.hora_inicio.slice(0, 5)} – ${p.hora_fin.slice(0, 5)}`
          : "",
    })),
    cells,
    total: rows.data?.length || 0,
  };
}
