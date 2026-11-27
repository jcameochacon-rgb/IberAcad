"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireProfile } from "@/lib/auth";
import { reportParams } from "@/lib/reports";
import { uuidPattern } from "@/lib/management-validation";

export type SavedReportState = { error?: string; ok?: string };
const MISSING =
  "Falta ejecutar en Supabase el archivo supabase/migrations/202611270001_ampliacion_modulos.sql.";

/** Solo se guardan los filtros del informe, nunca sus datos. */
function cleanParams(raw: string) {
  const source = new URLSearchParams(raw);
  const kept = new URLSearchParams();
  for (const key of ["tipo", "curso", "trimestre", "desde", "hasta"]) {
    const value = source.get(key);
    if (value) kept.set(key, value);
  }
  reportParams(kept);
  return kept.toString();
}

export async function saveReport(
  _previous: SavedReportState,
  form: FormData,
): Promise<SavedReportState> {
  const { supabase, user } = await requireProfile();
  const op = String(form.get("op") ?? "");
  const id = String(form.get("id") ?? "");
  const name = String(form.get("nombre") ?? "").trim();
  if (op !== "crear" && !uuidPattern.test(id))
    return { error: "El informe guardado no es válido." };
  if (op === "eliminar") {
    const { data, error } = await supabase
      .from("reportes_guardados")
      .delete()
      .eq("id", id)
      .eq("propietario_id", user.id)
      .select("id");
    if (error)
      return {
        error: error.code === "42P01" ? MISSING : "No se pudo eliminar.",
      };
    if (!data?.length) return { error: "El informe ya no existe." };
    revalidatePath("/panel/informes");
    return {
      ok: "Informe guardado eliminado. Los datos académicos no cambian.",
    };
  }
  if (op === "renombrar" || op === "crear" || op === "actualizar") {
    if (op !== "actualizar" && (!name || name.length > 150))
      return { error: "Escribe un nombre de hasta 150 caracteres." };
  } else return { error: "Operación no válida." };
  let parametros = "";
  if (op !== "renombrar") {
    try {
      parametros = cleanParams(String(form.get("parametros") ?? ""));
    } catch {
      return { error: "Genera un informe válido antes de guardarlo." };
    }
  }
  const now = new Date().toISOString();
  const result =
    op === "crear"
      ? await supabase
          .from("reportes_guardados")
          .insert({ propietario_id: user.id, nombre: name, parametros })
          .select("id")
      : await supabase
          .from("reportes_guardados")
          .update(
            op === "renombrar"
              ? { nombre: name, updated_at: now }
              : { parametros, updated_at: now },
          )
          .eq("id", id)
          .eq("propietario_id", user.id)
          .select("id");
  if (result.error)
    return {
      error: result.error.code === "42P01" ? MISSING : "No se pudo guardar.",
    };
  if (!result.data?.length) return { error: "El informe ya no existe." };
  revalidatePath("/panel/informes");
  if (op === "crear")
    redirect(`/panel/informes?${parametros}&guardado=${result.data[0].id}`);
  return {
    ok:
      op === "renombrar"
        ? "Nombre actualizado."
        : "Filtros del informe actualizados.",
  };
}
