import "server-only";
import { requireProfile } from "@/lib/auth";
import { labels, displayDate, gradeTone, type PanelModel } from "./model";
import type { Module } from "@iberdrola/shared";
function assertResult<T extends { error: unknown }>(result: T): T {
  if (result.error)
    throw new Error("No se pudo consultar la información académica.");
  return result;
}
// Full consultation lists paginate through PostgREST's response cap. Fail explicitly
// instead of returning a silently truncated list. Every request retains session RLS.
export async function readAll<T>(query: {
  range: (
    from: number,
    to: number,
  ) => PromiseLike<{ data: T[] | null; error: unknown; count?: number | null }>;
}) {
  const data: T[] = [];
  for (let offset = 0; offset <= 10000; offset += 500) {
    const result = assertResult(await query.range(offset, offset + 499));
    data.push(...(result.data || []));
    if (data.length > 10000)
      throw Error(
        "La consulta supera 10.000 registros. Utiliza Informes y reportes para consultar por curso y periodo.",
      );
    if ((result.data?.length || 0) < 500)
      return { data, error: null, count: data.length };
  }
  throw Error(
    "La consulta es demasiado grande. Consulta por curso y periodo en Informes y reportes.",
  );
}
export async function loadPanel(options?: {
  complete: Module;
  year?: string;
}): Promise<PanelModel> {
  const { supabase, profile, name, user } = await requireProfile();
  let avatarUrl: string | undefined;
  if (user?.user_metadata?.avatar_file === `${user.id}/avatar.jpg`) {
    const { data } = await supabase.storage
      .from("avatares")
      .createSignedUrl(`${user.id}/avatar.jpg`, 3600);
    avatarUrl = data?.signedUrl;
  }
  let yearQuery = supabase
    .from("gestiones")
    .select("id,anio")
    .order("anio", { ascending: false })
    .limit(1);
  yearQuery = options?.year
    ? yearQuery.eq("id", options.year)
    : yearQuery.eq("activo", true);
  const g = assertResult(await yearQuery);
  const year = g.data?.[0];
  const empty: PanelModel["listings"] = {
    estudiantes: { ...labels.estudiantes, rows: [], total: 0 },
    cursos: { ...labels.cursos, rows: [], total: 0 },
    calificaciones: { ...labels.calificaciones, rows: [], total: 0 },
    asistencia: { ...labels.asistencia, rows: [], total: 0 },
    horarios: { ...labels.horarios, rows: [], total: 0 },
  };
  if (!year)
    return {
      avatarUrl,
      role: profile.rol,
      name,
      year: null,
      demo: false,
      studentCount: 0,
      courseCount: 0,
      publishedGrades: 0,
      attendanceCount: 0,
      listings: empty,
      terms: [],
    };
  // Cliente con sesión del usuario y clave publicable. Ninguna consulta usa service_role.
  const [
    students,
    courses,
    grades,
    attendance,
    schedules,
    assignments,
    subjects,
    enrolments,
    days,
    periods,
    terms,
    publishedCount,
    attendanceCount,
  ] = await Promise.all([
    options?.complete === "estudiantes"
      ? readAll(
          supabase
            .from("estudiantes")
            .select(
              "id,rude,activo,personas(nombres,apellido_paterno,apellido_materno,ci)",
              { count: "exact" },
            )
            .eq("activo", true)
            .order("created_at", { ascending: false })
            .order("id"),
        )
      : supabase
          .from("estudiantes")
          .select(
            "id,rude,activo,personas(nombres,apellido_paterno,apellido_materno,ci)",
            { count: "exact" },
          )
          .eq("activo", true)
          .order("created_at", { ascending: false })
          .limit(100),
    options
      ? readAll(
          supabase
            .from("cursos")
            .select("id,grado_id,paralelo,activo,grados(nombre)", {
              count: "exact",
            })
            .eq("gestion_id", year.id)
            .order("grado_id")
            .order("id"),
        )
      : supabase
          .from("cursos")
          .select("id,grado_id,paralelo,activo,grados(nombre)", {
            count: "exact",
          })
          .eq("gestion_id", year.id)
          .eq("activo", true)
          .order("grado_id")
          .limit(100),
    options?.complete === "calificaciones"
      ? readAll(
          supabase
            .from("v_calificaciones")
            .select(
              "id,matricula_id,curso_id,asignacion_docente_id,nota_final,situacion,trimestre_id,estado",
              { count: "exact" },
            )
            .eq("gestion_id", year.id)
            .order("updated_at", { ascending: false })
            .order("id"),
        )
      : supabase
          .from("v_calificaciones")
          .select(
            "id,matricula_id,curso_id,asignacion_docente_id,nota_final,situacion,trimestre_id,estado",
            { count: "exact" },
          )
          .eq("gestion_id", year.id)
          .order("updated_at", { ascending: false })
          .limit(100),
    options?.complete === "asistencia"
      ? readAll(
          supabase
            .from("asistencias")
            .select("id,matricula_id,curso_id,jornada_id,estado", {
              count: "exact",
            })
            .eq("gestion_id", year.id)
            .order("updated_at", { ascending: false })
            .order("id"),
        )
      : supabase
          .from("asistencias")
          .select("id,matricula_id,curso_id,jornada_id,estado", {
            count: "exact",
          })
          .eq("gestion_id", year.id)
          .order("updated_at", { ascending: false })
          .limit(100),
    options?.complete === "horarios"
      ? readAll(
          supabase
            .from("horarios")
            .select("id,curso_id,asignacion_docente_id,periodo_id,dia_semana", {
              count: "exact",
            })
            .eq("gestion_id", year.id)
            .order("dia_semana")
            .order("id"),
        )
      : supabase
          .from("horarios")
          .select("id,curso_id,asignacion_docente_id,periodo_id,dia_semana", {
            count: "exact",
          })
          .eq("gestion_id", year.id)
          .order("dia_semana")
          .limit(100),
    options
      ? readAll(
          supabase
            .from("asignaciones_docente")
            .select(
              "id,asignatura_id,curso_id,docentes(personas(nombres,apellido_paterno,apellido_materno))",
            )
            .eq("gestion_id", year.id)
            .order("id"),
        )
      : supabase
          .from("asignaciones_docente")
          .select(
            "id,asignatura_id,curso_id,docentes(personas(nombres,apellido_paterno,apellido_materno))",
          )
          .eq("gestion_id", year.id)
          .limit(1000),
    options
      ? readAll(supabase.from("asignaturas").select("id,nombre").order("id"))
      : supabase.from("asignaturas").select("id,nombre").limit(1000),
    options
      ? readAll(
          supabase
            .from("matriculas")
            .select("id,estudiante_id,curso_id")
            .eq("gestion_id", year.id)
            .order("id"),
        )
      : supabase
          .from("matriculas")
          .select("id,estudiante_id,curso_id")
          .eq("gestion_id", year.id)
          .limit(1000),
    options
      ? readAll(
          supabase
            .from("jornadas_asistencia")
            .select("id,fecha,estado")
            .eq("gestion_id", year.id)
            .order("id"),
        )
      : supabase
          .from("jornadas_asistencia")
          .select("id,fecha,estado")
          .eq("gestion_id", year.id)
          .limit(1000),
    options
      ? readAll(
          supabase
            .from("periodos")
            .select("id,numero,hora_inicio,hora_fin")
            .eq("gestion_id", year.id)
            .order("id"),
        )
      : supabase
          .from("periodos")
          .select("id,numero,hora_inicio,hora_fin")
          .eq("gestion_id", year.id)
          .limit(6),
    options
      ? readAll(
          supabase
            .from("trimestres")
            .select("id,numero,estado")
            .eq("gestion_id", year.id)
            .order("numero")
            .order("id"),
        )
      : supabase
          .from("trimestres")
          .select("id,numero,estado")
          .eq("gestion_id", year.id)
          .order("numero")
          .limit(3),
    supabase
      .from("calificaciones_trimestrales")
      .select("id", { count: "exact", head: true })
      .eq("gestion_id", year.id)
      .eq("estado", "PUBLICADO"),
    supabase
      .from("asistencias")
      .select("id", { count: "exact", head: true })
      .eq("gestion_id", year.id),
  ]);
  [
    students,
    courses,
    grades,
    attendance,
    schedules,
    assignments,
    subjects,
    enrolments,
    days,
    periods,
    terms,
    publishedCount,
    attendanceCount,
  ].forEach(assertResult);
  const personName = (
    person: NonNullable<typeof students.data>[number]["personas"],
  ) =>
    person
      ? [person.nombres, person.apellido_paterno, person.apellido_materno]
          .filter(Boolean)
          .join(" ")
      : "Ficha no disponible";
  const studentIds = [
    ...new Set((enrolments.data || []).map((m) => m.estudiante_id)),
  ];
  const nameRows = studentIds.length
    ? assertResult(
        await (options
          ? readAll(
              supabase
                .from("estudiantes")
                .select(
                  "id,personas(nombres,apellido_paterno,apellido_materno,ci)",
                )
                .order("id"),
            )
          : supabase
              .from("estudiantes")
              .select(
                "id,personas(nombres,apellido_paterno,apellido_materno,ci)",
              )
              .in("id", studentIds)
              .limit(1000)),
      ).data
    : [];
  const studentNames = new Map(
    nameRows?.map((s) => [s.id, personName(s.personas)]),
  );
  const studentFor = (matricula: string | null) =>
    studentNames.get(
      enrolments.data?.find((m) => m.id === matricula)?.estudiante_id || "",
    ) || "Nombre no disponible";
  const subjectFor = (assignment: string | null) =>
    subjects.data?.find(
      (s) =>
        s.id ===
        assignments.data?.find((a) => a.id === assignment)?.asignatura_id,
    )?.nombre || "Asignatura";
  const courseFor = (id: string) => {
    const c = courses.data?.find((c) => c.id === id);
    return c ? `${c.grado_id}° ${c.paralelo}` : "Curso histórico";
  };
  const ciFor = (matricula: string | null) =>
    nameRows?.find(
      (s) =>
        s.id ===
        enrolments.data?.find((m) => m.id === matricula)?.estudiante_id,
    )?.personas?.ci || "—";
  const courseColumns = [
    { key: "ci", label: "CI" },
    { key: "course", label: "Curso" },
  ];
  const listings: PanelModel["listings"] = {
    estudiantes: {
      ...labels.estudiantes,
      total: students.count || 0,
      rows: (students.data || []).map((s) => ({
        id: s.id,
        cells: {
          name: personName(s.personas),
          rude: s.rude,
          status: s.activo ? "Activo" : "Inactivo",
        },
        tone: "success",
      })),
    },
    cursos: {
      ...labels.cursos,
      total: courses.count || 0,
      rows: (courses.data || []).map((c) => ({
        id: c.id,
        cells: {
          course: `${c.grado_id}° ${c.paralelo}`,
          grade: c.grados?.nombre || "",
          status: c.activo ? "Activo" : "Inactivo",
        },
        tone: "success",
      })),
    },
    calificaciones: {
      ...labels.calificaciones,
      columns: [
        labels.calificaciones.columns[0],
        ...courseColumns,
        ...labels.calificaciones.columns.slice(1),
        { key: "publication", label: "Publicación" },
      ],
      total: grades.count || 0,
      rows: (grades.data || []).map((c) => ({
        id: c.id || "",
        cells: {
          student: studentFor(c.matricula_id),
          ci: ciFor(c.matricula_id),
          course: courseFor(c.curso_id || ""),
          publication: c.estado,
          subject: subjectFor(c.asignacion_docente_id),
          term: `${terms.data?.find((t) => t.id === c.trimestre_id)?.numero || "—"}°`,
          grade: c.nota_final,
          status: c.situacion,
        },
        tone: gradeTone(c.situacion),
      })),
    },
    asistencia: {
      ...labels.asistencia,
      columns: [
        labels.asistencia.columns[0],
        ...courseColumns,
        ...labels.asistencia.columns.slice(1),
      ],
      total: attendance.count || 0,
      rows: (attendance.data || []).map((a) => {
        const day = days.data?.find((d) => d.id === a.jornada_id);
        return {
          id: a.id,
          date: day?.fecha,
          cells: {
            student: studentFor(a.matricula_id),
            ci: ciFor(a.matricula_id),
            course: courseFor(a.curso_id),
            date: displayDate(day?.fecha || null),
            state: { A: "Presente", F: "Falta", R: "Retraso", L: "Licencia" }[
              a.estado
            ],
            status: day?.estado || "Jornada histórica",
          },
          tone:
            a.estado === "F"
              ? "danger"
              : a.estado === "A"
                ? "success"
                : "warning",
        };
      }),
    },
    horarios: {
      ...labels.horarios,
      columns: [
        ...labels.horarios.columns,
        { key: "teacher", label: "Docente" },
      ],
      total: schedules.count || 0,
      rows: (schedules.data || []).map((h) => {
        const p = periods.data?.find((p) => p.id === h.periodo_id);
        return {
          id: h.id,
          cells: {
            course: courseFor(h.curso_id),
            day: ["", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes"][
              h.dia_semana
            ],
            period: p?.numero || "—",
            subject: subjectFor(h.asignacion_docente_id),
            teacher: (() => {
              const p = assignments.data?.find(
                (a) => a.id === h.asignacion_docente_id,
              )?.docentes?.personas;
              return p
                ? [p.nombres, p.apellido_paterno, p.apellido_materno]
                    .filter(Boolean)
                    .join(" ")
                : "Sin información";
            })(),
            time:
              p?.hora_inicio && p.hora_fin
                ? `${p.hora_inicio.slice(0, 5)} – ${p.hora_fin.slice(0, 5)}`
                : "Por configurar",
          },
        };
      }),
    },
  };
  return {
    avatarUrl,
    role: profile.rol,
    name,
    year: year.anio,
    demo: false,
    studentCount: students.count || 0,
    courseCount: courses.count || 0,
    publishedGrades: publishedCount.count || 0,
    attendanceCount: attendanceCount.count || 0,
    listings,

    terms: (terms.data || []).map((t) => ({
      number: t.numero,
      state: t.estado,
    })),
  };
}
export function moduleFor(value: string): Module | null {
  return Object.hasOwn(labels, value) ? (value as Module) : null;
}
