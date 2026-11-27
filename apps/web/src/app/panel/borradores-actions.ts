"use server";
import { revalidatePath } from "next/cache";
import { requireProfile } from "@/lib/auth";
import { uuidPattern } from "@/lib/management-validation";

export type DraftDeleteState = { error?: string; deleted?: string };

/** Elimina un registro académico en BORRADOR. La base comprueba el permiso. */
export async function deleteDraft(
  _previous: DraftDeleteState,
  form: FormData,
): Promise<DraftDeleteState> {
  const { supabase, profile } = await requireProfile();
  const tipo = String(form.get("tipo") ?? "");
  const id = String(form.get("id") ?? "");
  if (!["asistencia", "calificaciones"].includes(tipo) || !uuidPattern.test(id))
    return { error: "El registro seleccionado no es válido." };
  if (!["DIRECTOR", "SECRETARIA", "DOCENTE"].includes(profile.rol))
    return { error: "Tu cuenta no puede eliminar registros académicos." };
  const { error } = await supabase.rpc("eliminar_registro_academico", {
    p_tipo: tipo,
    p_id: id,
  });
  if (error) {
    if (error.code === "PGRST202" || error.code === "42883")
      return {
        error:
          "Falta ejecutar en Supabase el archivo supabase/migrations/202611270001_ampliacion_modulos.sql.",
      };
    if (error.message?.startsWith("Retira la publicación"))
      return {
        error:
          "Ese registro está publicado. Despublícalo desde el registro antes de eliminarlo.",
      };
    if (error.code === "42501" || error.message === "Sin permiso")
      return {
        error: "Solo puedes eliminar borradores de tus cursos y materias.",
      };
    return { error: "No se pudo eliminar. Inténtalo de nuevo." };
  }
  revalidatePath("/panel", "layout");
  return { deleted: id };
}
