"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireProfile } from "@/lib/auth";
import { canWriteNotice, type NoticeState } from "@/lib/notices";
import { uuidPattern } from "@/lib/management-validation";
export async function saveNotice(
  previous: NoticeState,
  form: FormData,
): Promise<NoticeState> {
  const { supabase, profile } = await requireProfile();
  if (!canWriteNotice(profile.rol))
    return { error: "No tienes permiso para gestionar comunicados." };
  const text = (key: string) => String(form.get(key) ?? "");
  const id = text("id"),
    kind = text("accion");
  if (id && !uuidPattern.test(id)) return { error: "Aviso inválido." };
  let saved = "";
  try {
    let result;
    if (kind === "guardar") {
      const courses = form.getAll("curso").map(String);
      if (courses.some((c) => !uuidPattern.test(c)))
        return { error: "Selecciona cursos válidos." };
      result = await supabase.rpc("guardar_comunicado", {
        p_id: id || null,
        p_version: text("version") || null,
        p_titulo: text("titulo"),
        p_contenido: text("contenido"),
        p_institucional: form.get("institucional") === "on",
        p_cursos: courses,
      });
    } else if ((kind === "publicar" || kind === "retirar") && id) {
      result = await supabase.rpc("cambiar_estado_comunicado", {
        p_id: id,
        p_version: text("version") || null,
        p_publicar: kind === "publicar",
        p_confirmar: form.get("confirmar") === "on",
      });
    } else return { error: "Acción inválida." };
    if (result.error)
      return {
        error:
          result.error.code === "23514"
            ? result.error.message
            : result.error.code === "42501"
              ? "No tienes permiso para esta acción o para alguno de los cursos."
              : ["42883", "PGRST202"].includes(result.error.code)
                ? "Falta instalar 202610120001_comunicados.sql."
                : "No se pudo guardar. Comprueba la conexión y recarga antes de reintentar.",
      };
    saved = String(result.data);
  } catch {
    return {
      error: "No se pudo conectar. Conserva el texto antes de recargar.",
    };
  }
  revalidatePath("/panel", "layout");
  redirect(`/panel/comunicados/bandeja?id=${saved}&resultado=${kind}`);
}
