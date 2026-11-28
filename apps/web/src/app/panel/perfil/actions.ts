"use server";
import { requireProfile } from "@/lib/auth";
import { revalidatePath } from "next/cache";
export async function saveProfile(_: string, form: FormData) {
  const { supabase, user } = await requireProfile();
  const telefono = String(form.get("telefono") || "").trim(),
    direccion = String(form.get("direccion") || "").trim();
  if (telefono.length > 40 || direccion.length > 300)
    return "Revisa la longitud de los datos.";
  const file = form.get("foto");
  let avatar_file: string | undefined;
  if (file instanceof File && file.size) {
    if (file.type !== "image/jpeg" || file.size > 500000)
      return "Selecciona una imagen JPEG de hasta 500 KB.";
    const bytes = new Uint8Array(await file.arrayBuffer());
    if (bytes[0] !== 255 || bytes[1] !== 216 || bytes[2] !== 255)
      return "La imagen no es válida.";
    avatar_file = `${user.id}/avatar.jpg`;
    const { error } = await supabase.storage
      .from("avatares")
      .upload(avatar_file, bytes, {
        contentType: "image/jpeg",
        upsert: true,
        cacheControl: "0",
      });
    if (error)
      return "No se pudo guardar la foto. Comprueba la instalación del depósito privado de avatares.";
  }
  const { error } = await supabase.auth.updateUser({
    data: {
      contacto_personal: { telefono, direccion },
      ...(avatar_file ? { avatar_file } : {}),
    },
  });
  if (error) return "No se pudieron guardar tus datos. Intenta nuevamente.";
  revalidatePath("/panel", "layout");
  return "Perfil actualizado.";
}
