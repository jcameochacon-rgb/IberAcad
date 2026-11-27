import { requireProfile } from "@/lib/auth";
import { loadAttendanceCourses } from "@/lib/data/attendance";
import { loadGradeOptions } from "@/lib/data/grades";
import type { LinkRow } from "@/components/link-table";

const fullName = (
  p?: { nombres?: string; apellido_paterno?: string | null } | null,
) => (p ? [p.nombres, p.apellido_paterno].filter(Boolean).join(" ") : "");

const dayLabel = (iso: string) => {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

/** Jornadas de asistencia ya registradas que la cuenta puede reabrir. */
export async function loadAttendanceDays(): Promise<LinkRow[]> {
  const { supabase } = await requireProfile();
  const courses = await loadAttendanceCourses();
  if (!courses.length) return [];
  const label = new Map(courses.map((c) => [c.id, c.label]));
  const [days, marks] = await Promise.all([
    supabase
      .from("jornadas_asistencia")
      .select("id,curso_id,fecha,estado")
      .order("fecha", { ascending: false })
      .limit(500),
    supabase.from("asistencias").select("jornada_id").limit(20000),
  ]);
  if (days.error) throw Error("No se pudieron consultar las jornadas.");
  const count = new Map<string, number>();
  for (const m of marks.data || [])
    count.set(m.jornada_id, (count.get(m.jornada_id) || 0) + 1);
  return (days.data || [])
    .filter((d) => label.has(d.curso_id))
    .map((d) => ({
      id: d.id,
      href: `/panel/asistencia/registro?curso=${d.curso_id}&fecha=${d.fecha}`,
      cells: {
        course: label.get(d.curso_id) || "",
        date: dayLabel(d.fecha),
        month: d.fecha.slice(0, 7),
        marks: String(count.get(d.id) || 0),
        status: d.estado === "PUBLICADO" ? "Publicada" : "Borrador",
      },
    }));
}

/** Planillas de calificaciones (materia + trimestre) con notas registradas. */
export async function loadGradeSheets(): Promise<LinkRow[]> {
  const { supabase } = await requireProfile();
  const options = await loadGradeOptions();
  if (!options.assignments.length) return [];
  const { data, error } = await supabase
    .from("calificaciones_trimestrales")
    .select("asignacion_docente_id,trimestre_id,estado")
    .limit(20000);
  if (error) throw Error("No se pudieron consultar las calificaciones.");
  const sheets = new Map<
    string,
    { a: string; t: string; total: number; published: number }
  >();
  for (const c of data || []) {
    const key = `${c.asignacion_docente_id}|${c.trimestre_id}`;
    const s = sheets.get(key) || {
      a: c.asignacion_docente_id,
      t: c.trimestre_id,
      total: 0,
      published: 0,
    };
    s.total++;
    if (c.estado === "PUBLICADO") s.published++;
    sheets.set(key, s);
  }
  const assignment = new Map(options.assignments.map((a) => [a.id, a]));
  const term = new Map(options.terms.map((t) => [t.id, t]));
  return [...sheets.values()]
    .filter((s) => assignment.has(s.a) && term.has(s.t))
    .map((s) => {
      const [course, subject, year] = assignment.get(s.a)!.label.split(" · ");
      const t = term.get(s.t)!;
      return {
        id: `${s.a}-${s.t}`,
        href: `/panel/calificaciones/registro?asignacion=${s.a}&trimestre=${s.t}`,
        cells: {
          course: `${course} · ${year}`,
          subject,
          term: `Trimestre ${t.numero}`,
          students: String(s.total),
          status:
            s.published === s.total
              ? "Publicada"
              : s.published
                ? "Parcialmente publicada"
                : "Borrador",
        },
      };
    })
    .sort((x, y) =>
      `${x.cells.course}${x.cells.subject}${x.cells.term}`.localeCompare(
        `${y.cells.course}${y.cells.subject}${y.cells.term}`,
        "es",
        { numeric: true },
      ),
    );
}

/**
 * Asignaturas visibles para la cuenta: Dirección y Secretaría ven todas las
 * asignaciones; el docente, las suyas; estudiante y familia, las de su curso.
 */
export async function loadSubjectsView(): Promise<{
  rows: LinkRow[];
  showTeacher: boolean;
}> {
  const { supabase, profile } = await requireProfile();
  const admin = profile.rol === "DIRECTOR" || profile.rol === "SECRETARIA";
  const { data, error } = await supabase
    .from("asignaciones_docente")
    .select(
      "id,activo,asignaturas(nombre,descripcion),cursos(grado_id,paralelo,gestiones(anio)),docentes(personas(nombres,apellido_paterno))",
    )
    .order("id")
    .limit(1000);
  if (error) throw Error("No se pudieron consultar las asignaturas.");
  const rows: LinkRow[] = (data || [])
    .filter((a) => admin || a.activo)
    .map((a) => ({
      id: a.id,
      cells: {
        subject: a.asignaturas?.nombre || "",
        course: a.cursos
          ? `${a.cursos.grado_id}° ${a.cursos.paralelo} · ${a.cursos.gestiones?.anio ?? ""}`
          : "",
        teacher: fullName(a.docentes?.personas),
        description: a.asignaturas?.descripcion || "",
        status: a.activo ? "Activa" : "Inactiva",
      },
    }))
    .sort((x, y) =>
      `${x.cells.course}${x.cells.subject}`.localeCompare(
        `${y.cells.course}${y.cells.subject}`,
        "es",
        { numeric: true },
      ),
    );
  return { rows, showTeacher: admin || profile.rol === "DOCENTE" };
}
