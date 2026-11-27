import { requireProfile } from "@/lib/auth";
import { loadScheduleCourses } from "@/lib/data/schedule";
import { displayDate } from "@/lib/data/model";
import type { SavedReport } from "@/components/saved-reports";

/** Informes guardados de la cuenta (solo filtros, nunca datos). */
export async function loadSavedReports(): Promise<{
  available: boolean;
  reports: SavedReport[];
}> {
  const { supabase } = await requireProfile();
  const [saved, courses, terms] = await Promise.all([
    supabase
      .from("reportes_guardados")
      .select("id,nombre,parametros,updated_at")
      .order("updated_at", { ascending: false })
      .limit(200),
    loadScheduleCourses(),
    supabase
      .from("trimestres")
      .select("id,numero,gestiones(anio)")
      .order("numero")
      .limit(501),
  ]);
  if (saved.error) return { available: false, reports: [] };
  const courseLabel = new Map(courses.map((c) => [c.id, c.label]));
  const termLabel = new Map(
    (terms.data || []).map((t) => [
      t.id,
      `Trimestre ${t.numero} · ${t.gestiones?.anio ?? ""}`,
    ]),
  );
  return {
    available: true,
    reports: (saved.data || []).map((r) => {
      const p = new URLSearchParams(r.parametros);
      const tipo = p.get("tipo") || "calificaciones";
      return {
        id: r.id,
        nombre: r.nombre,
        parametros: r.parametros,
        fecha: displayDate(r.updated_at),
        detalle: [
          tipo === "asistencia" ? "Asistencia" : "Calificaciones",
          courseLabel.get(p.get("curso") || "") || "Curso no disponible",
          tipo === "asistencia"
            ? `${p.get("desde")} a ${p.get("hasta")}`
            : termLabel.get(p.get("trimestre") || "") || "",
        ]
          .filter(Boolean)
          .join(" · "),
      };
    }),
  };
}
