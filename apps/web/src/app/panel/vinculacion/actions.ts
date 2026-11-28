"use server";
import { requireProfile } from "@/lib/auth";
import { canManage, uuidPattern } from "@/lib/management-validation";
import { revalidatePath } from "next/cache";
export async function unlinkChild(_: string, f: FormData) {
  const { supabase, profile } = await requireProfile();
  if (!canManage(profile.rol)) return "Sin permiso.";
  const estudiante = String(f.get("estudiante")),
    tutor = String(f.get("tutor"));
  if (!uuidPattern.test(estudiante) || !uuidPattern.test(tutor))
    return "Vínculo inválido.";
  const { data, error } = await supabase
    .from("estudiante_tutor")
    .delete()
    .eq("estudiante_id", estudiante)
    .eq("tutor_id", tutor)
    .select("estudiante_id");
  if (error) return "No se pudo desvincular. Comprueba la actualización SQL.";
  if (!data?.length) return "El vínculo ya no está disponible.";
  revalidatePath("/panel", "layout");
  return "Hijo desvinculado. Se conservan las fichas y el historial académico.";
}
