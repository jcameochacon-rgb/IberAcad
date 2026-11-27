"use server";
import { managedBySecretary } from "@/lib/user-validation";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireProfile } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { siteOrigin } from "@/lib/env";
import {
  readUserForm,
  validateUser,
  uuidRe,
  type UserFormState,
} from "@/lib/user-validation";
import type { Role } from "@iberdrola/shared";

const roleTable = {
  DOCENTE: "docentes",
  PADRE: "tutores",
  ESTUDIANTE: "estudiantes",
} as const;

function dbMessage(error: { code?: string; message?: string }) {
  if (error.code === "23505")
    return "Ya existe una persona con ese CI o una cuenta con esos datos.";
  if (error.code === "42501")
    return "Tu cuenta no puede administrar ese usuario.";
  if (
    /^Crear (docente|tutor|estudiante) antes/.test(error.message || "") ||
    /^Otra persona/.test(error.message || "")
  )
    return error.message!;
  return "No se pudo guardar. Revisa los datos e inténtalo de nuevo.";
}

/** Dirección administra todo; Secretaría, solo cuentas no administrativas. */
async function requireAccountManager() {
  const ctx = await requireProfile();
  if (ctx.profile.rol !== "DIRECTOR" && ctx.profile.rol !== "SECRETARIA")
    return null;
  return ctx;
}
const secretaryCanManage = (rol: string | undefined) =>
  (managedBySecretary as readonly string[]).includes(rol ?? "");
const SECRETARY_LIMIT =
  "Secretaría solo administra cuentas de estudiantes, docentes y familias.";

const NO_KEY =
  "Falta configurar SUPABASE_SERVICE_ROLE_KEY en el servidor (ver docs/GESTION_USUARIOS.md).";

/** Crea la cuenta de acceso, la ficha personal y el perfil con su rol. */
export async function createUser(
  previous: UserFormState,
  form: FormData,
): Promise<UserFormState> {
  const attempt = (previous.attempt || 0) + 1;
  const raw = readUserForm(form);
  const values = Object.fromEntries(Object.entries(raw)) as Record<
    string,
    string
  >;
  const fail = (error: string): UserFormState => ({ error, values, attempt });
  const ctx = await requireAccountManager();
  if (!ctx) return fail("Solo Dirección y Secretaría pueden crear usuarios.");
  if (ctx.profile.rol === "SECRETARIA" && !secretaryCanManage(raw.rol))
    return fail(SECRETARY_LIMIT);
  // Modo "ficha existente": la cuenta se vincula a una persona ya registrada.
  const existingId = String(form.get("persona_id") ?? "");
  const linkExisting = form.get("modo") === "existente";
  values.modo = linkExisting ? "existente" : "nueva";
  values.persona_id = existingId;
  if (linkExisting) {
    if (!uuidRe.test(existingId))
      return fail("Selecciona la ficha a la que se vinculará la cuenta.");
    const invalidLink = validateUser(
      { ...raw, nombres: "Ficha", apellido_paterno: "existente", telefono: "" },
      { needsEmail: true },
    );
    if (invalidLink) return fail(invalidLink);
  } else {
    const invalid = validateUser(raw, { needsEmail: true });
    if (invalid) return fail(invalid);
  }
  const admin = createAdminClient();
  if (!admin) return fail(NO_KEY);
  const origin = siteOrigin();
  if (!origin)
    return fail("El administrador debe configurar NEXT_PUBLIC_SITE_URL.");
  const { supabase } = ctx;
  const rol = raw.rol as Role;

  // ¿Existe ya una ficha con ese CI? Se reutiliza si no tiene cuenta.
  let personaId: string | null = null;
  let personaNueva = false;
  if (linkExisting) {
    const taken = await supabase
      .from("perfiles")
      .select("id")
      .eq("persona_id", existingId)
      .maybeSingle();
    if (taken.error) return fail(dbMessage(taken.error));
    if (taken.data) return fail("Esa ficha ya tiene una cuenta de usuario.");
    const exists = await supabase
      .from("personas")
      .select("id")
      .eq("id", existingId)
      .maybeSingle();
    if (exists.error || !exists.data)
      return fail("La ficha seleccionada ya no está disponible.");
    personaId = existingId;
  } else if (raw.ci) {
    const found = await supabase
      .from("personas")
      .select("id")
      .eq("ci", raw.ci)
      .maybeSingle();
    if (found.error) return fail(dbMessage(found.error));
    if (found.data) {
      const taken = await supabase
        .from("perfiles")
        .select("id")
        .eq("persona_id", found.data.id)
        .maybeSingle();
      if (taken.error) return fail(dbMessage(taken.error));
      if (taken.data)
        return fail("Esa persona (CI) ya tiene una cuenta de usuario.");
      personaId = found.data.id;
    }
  }

  // 1. Invitación por correo: la persona define su propia contraseña.
  const invited = await admin.auth.admin.inviteUserByEmail(raw.email, {
    redirectTo: `${origin}/auth/callback?next=/actualizar-clave`,
  });
  if (invited.error || !invited.data.user) {
    const msg = invited.error?.message || "";
    return fail(
      /already|registered|exists/i.test(msg)
        ? "Ese correo ya tiene una cuenta."
        : "No se pudo enviar la invitación. Revisa el correo y la configuración de envío de Supabase.",
    );
  }
  const userId = invited.data.user.id;
  const rollback = async () => {
    await admin.auth.admin.deleteUser(userId);
    if (personaNueva && personaId)
      await admin.from("personas").delete().eq("id", personaId);
  };

  try {
    if (!personaId) {
      const p = await supabase
        .from("personas")
        .insert({
          nombres: raw.nombres,
          apellido_paterno: raw.apellido_paterno,
          apellido_materno: raw.apellido_materno,
          ci: raw.ci || null,
          telefono: raw.telefono || null,
          direccion: raw.direccion || null,
        })
        .select("id")
        .single();
      if (p.error || !p.data) {
        await rollback();
        return fail(p.error ? dbMessage(p.error) : "No se pudo guardar.");
      }
      personaId = p.data.id;
      personaNueva = true;
    }
    if (rol in roleTable) {
      const table = roleTable[rol as keyof typeof roleTable];
      const has = await supabase
        .from(table)
        .select("id")
        .eq("persona_id", personaId)
        .maybeSingle();
      if (has.error) {
        await rollback();
        return fail(dbMessage(has.error));
      }
      if (!has.data) {
        const made = await supabase
          .from(table)
          .insert({ persona_id: personaId });
        if (made.error) {
          await rollback();
          return fail(dbMessage(made.error));
        }
      }
    }
    const perfil = await supabase
      .from("perfiles")
      .insert({ id: userId, persona_id: personaId, rol, activo: true });
    if (perfil.error) {
      await rollback();
      return fail(dbMessage(perfil.error));
    }
  } catch {
    await rollback();
    return fail("No se pudo completar el alta. No se creó ningún usuario.");
  }
  revalidatePath("/panel/usuarios");
  redirect("/panel/usuarios?creado=1");
}

/** Edita datos personales, rol y correo de un usuario. */
export async function updateUser(
  previous: UserFormState,
  form: FormData,
): Promise<UserFormState> {
  const attempt = (previous.attempt || 0) + 1;
  const raw = readUserForm(form);
  const id = String(form.get("id") || "");
  const version = String(form.get("version") || "");
  const values = Object.fromEntries(Object.entries(raw)) as Record<
    string,
    string
  >;
  const fail = (error: string): UserFormState => ({ error, values, attempt });
  const ctx = await requireAccountManager();
  if (!ctx) return fail("Solo Dirección y Secretaría pueden editar usuarios.");
  if (ctx.profile.rol === "SECRETARIA" && !secretaryCanManage(raw.rol))
    return fail(SECRETARY_LIMIT);
  if (!uuidRe.test(id)) return fail("El usuario no es válido.");
  const invalid = validateUser(raw, { needsEmail: true });
  if (invalid) return fail(invalid);
  const { supabase, user } = ctx;
  const current = await supabase
    .from("perfiles")
    .select("id,persona_id,rol,updated_at")
    .eq("id", id)
    .maybeSingle();
  if (current.error || !current.data)
    return fail("El usuario ya no existe. Vuelve a buscarlo.");
  if (ctx.profile.rol === "SECRETARIA" && !secretaryCanManage(current.data.rol))
    return fail(SECRETARY_LIMIT);
  if (version && current.data.updated_at !== version)
    return fail(
      "Otra persona modificó este usuario. Recarga la página para ver los cambios.",
    );
  const rol = raw.rol as Role;
  if (id === user.id && rol !== current.data.rol)
    return fail("No puedes cambiar tu propio rol.");
  if (current.data.rol === "DIRECTOR" && rol !== "DIRECTOR") {
    const others = await supabase
      .from("perfiles")
      .select("id", { count: "exact", head: true })
      .eq("rol", "DIRECTOR")
      .eq("activo", true)
      .neq("id", id);
    if (!others.count) return fail("Debe quedar al menos un Director activo.");
  }
  const persona = await supabase
    .from("personas")
    .update({
      nombres: raw.nombres,
      apellido_paterno: raw.apellido_paterno,
      apellido_materno: raw.apellido_materno,
      ci: raw.ci || null,
      telefono: raw.telefono || null,
      direccion: raw.direccion || null,
    })
    .eq("id", current.data.persona_id);
  if (persona.error) return fail(dbMessage(persona.error));
  if (rol !== current.data.rol) {
    if (rol in roleTable) {
      const table = roleTable[rol as keyof typeof roleTable];
      const has = await supabase
        .from(table)
        .select("id")
        .eq("persona_id", current.data.persona_id)
        .maybeSingle();
      if (!has.data) {
        const made = await supabase
          .from(table)
          .insert({ persona_id: current.data.persona_id });
        if (made.error) return fail(dbMessage(made.error));
      }
    }
    const changed = await supabase
      .from("perfiles")
      .update({ rol })
      .eq("id", id);
    if (changed.error) return fail(dbMessage(changed.error));
  }
  // Correo: requiere clave de servicio; solo se toca si cambió.
  const admin = createAdminClient();
  if (admin) {
    const auth = await admin.auth.admin.getUserById(id);
    if (auth.data.user && auth.data.user.email?.toLowerCase() !== raw.email) {
      const upd = await admin.auth.admin.updateUserById(id, {
        email: raw.email,
        email_confirm: true,
      });
      if (upd.error)
        return fail(
          "Se guardaron los datos, pero no se pudo cambiar el correo (¿ya está en uso?).",
        );
    }
  }
  revalidatePath("/panel/usuarios");
  redirect("/panel/usuarios/editar?guardado=1");
}

/** Desactiva o reactiva una cuenta (no borra ningún registro). */
export async function setUserActive(
  _previous: UserFormState,
  form: FormData,
): Promise<UserFormState> {
  const id = String(form.get("id") || "");
  const active = form.get("activo") === "true";
  const ctx = await requireAccountManager();
  if (!ctx)
    return { error: "Solo Dirección y Secretaría pueden cambiar el estado." };
  if (!uuidRe.test(id)) return { error: "El usuario no es válido." };
  const { supabase, user } = ctx;
  if (ctx.profile.rol === "SECRETARIA") {
    const target = await supabase
      .from("perfiles")
      .select("rol")
      .eq("id", id)
      .maybeSingle();
    if (!target.data || !secretaryCanManage(target.data.rol))
      return { error: SECRETARY_LIMIT };
  }
  if (!active) {
    if (id === user.id)
      return { error: "No puedes desactivar tu propia cuenta." };
    const target = await supabase
      .from("perfiles")
      .select("rol")
      .eq("id", id)
      .maybeSingle();
    if (target.data?.rol === "DIRECTOR") {
      const others = await supabase
        .from("perfiles")
        .select("id", { count: "exact", head: true })
        .eq("rol", "DIRECTOR")
        .eq("activo", true)
        .neq("id", id);
      if (!others.count)
        return { error: "Debe quedar al menos un Director activo." };
    }
  }
  const res = await supabase
    .from("perfiles")
    .update({ activo: active })
    .eq("id", id);
  if (res.error) return { error: dbMessage(res.error) };
  // Además se bloquea/desbloquea el inicio de sesión (si hay clave de servicio).
  const admin = createAdminClient();
  if (admin)
    await admin.auth.admin.updateUserById(id, {
      ban_duration: active ? "none" : "876000h",
    });
  revalidatePath("/panel/usuarios");
  return {
    success: active ? "Usuario reactivado." : "Usuario desactivado.",
    attempt: (_previous.attempt || 0) + 1,
  };
}
