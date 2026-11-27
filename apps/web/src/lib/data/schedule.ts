import "server-only";
import { requireProfile } from "@/lib/auth";
import type { ScheduleSheet } from "@/lib/schedule-validation";
export async function loadScheduleCourses() {
  const { supabase } = await requireProfile();
  const { data, error } = await supabase
    .from("cursos")
    .select("id,grado_id,paralelo,activo,gestiones(anio,activo)")
    .order("grado_id")
    .order("paralelo")
    .limit(501);
  if (error) throw Error("No se pudieron consultar los cursos.");
  if ((data?.length || 0) > 500)
    throw Error(
      "Se necesita un filtro por gestión para mostrar más de 500 cursos.",
    );
  return (data || []).map((c) => ({
    id: c.id,
    label: `${c.grado_id}° ${c.paralelo} · ${c.gestiones?.anio}${!c.activo || !c.gestiones?.activo ? " · Inactivo" : ""}`,
  }));
}
export async function loadScheduleSheet(
  course: string,
): Promise<{ sheet: ScheduleSheet | null; error?: string }> {
  const { supabase } = await requireProfile();
  const { data, error } = await supabase.rpc("consultar_horario_curso", {
    p_curso: course,
  });
  if (error)
    return {
      sheet: null,
      error: ["42883", "PGRST202"].includes(error.code)
        ? "Falta instalar 202610090002_registro_horarios.sql en Supabase."
        : error.code === "42501"
          ? "Tu cuenta no tiene acceso al horario de este curso."
          : "No se pudo cargar el horario. Comprueba la conexión.",
    };
  return { sheet: data as unknown as ScheduleSheet };
}

export async function loadInstitutionSchedule() {
  const { supabase } = await requireProfile();
  const { data } = await supabase
    .from("configuracion")
    .select("turno,hora_ingreso,hora_salida")
    .maybeSingle();
  if (!data) return null;
  const hhmm = (t: string) => t.slice(0, 5);
  return {
    turno: data.turno === "TARDE" ? "Turno tarde" : data.turno,
    ingreso: hhmm(data.hora_ingreso),
    salida: hhmm(data.hora_salida),
  };
}
