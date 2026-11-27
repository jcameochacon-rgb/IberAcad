import "server-only";
import { requireProfile } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { fold } from "@/lib/user-validation";
import type { Role } from "@iberdrola/shared";

export type UserRow = {
  id: string;
  rol: Role;
  activo: boolean;
  version: string;
  email: string;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  ci: string;
  telefono: string;
  direccion: string;
  fullName: string;
};
export type UserSearch = {
  q: string;
  rol: string;
  estado: "todos" | "activos" | "inactivos";
};

async function emailMap() {
  const admin = createAdminClient();
  const map = new Map<string, string>();
  if (!admin) return { map, available: false };
  for (let page = 1; page <= 10; page++) {
    const { data, error } = await admin.auth.admin.listUsers({
      page,
      perPage: 200,
    });
    if (error) return { map, available: false };
    data.users.forEach((u) => map.set(u.id, u.email || ""));
    if (data.users.length < 200) break;
  }
  return { map, available: true };
}

const toRow = (
  p: {
    id: string;
    rol: Role;
    activo: boolean;
    updated_at: string;
    personas: {
      nombres: string;
      apellido_paterno: string;
      apellido_materno: string;
      ci: string | null;
      telefono: string | null;
      direccion: string | null;
    } | null;
  },
  email: string,
): UserRow => {
  const s = p.personas;
  return {
    id: p.id,
    rol: p.rol,
    activo: p.activo,
    version: p.updated_at,
    email,
    nombres: s?.nombres ?? "",
    apellido_paterno: s?.apellido_paterno ?? "",
    apellido_materno: s?.apellido_materno ?? "",
    ci: s?.ci ?? "",
    telefono: s?.telefono ?? "",
    direccion: s?.direccion ?? "",
    fullName: [s?.nombres, s?.apellido_paterno, s?.apellido_materno]
      .filter(Boolean)
      .join(" "),
  };
};

export async function searchUsers(search: UserSearch) {
  const { supabase } = await requireProfile();
  const { data, error } = await supabase
    .from("perfiles")
    .select(
      "id,rol,activo,updated_at,personas(nombres,apellido_paterno,apellido_materno,ci,telefono,direccion)",
    )
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) throw new Error("No se pudo consultar a los usuarios.");
  const { map, available } = await emailMap();
  const term = fold(search.q.trim());
  const rows = (data ?? [])
    .map((p) => toRow(p as never, map.get(p.id) ?? ""))
    .filter((u) => (search.rol ? u.rol === search.rol : true))
    .filter((u) =>
      search.estado === "activos"
        ? u.activo
        : search.estado === "inactivos"
          ? !u.activo
          : true,
    )
    .filter(
      (u) => !term || fold(`${u.fullName} ${u.email} ${u.ci}`).includes(term),
    )
    .sort((a, b) => a.fullName.localeCompare(b.fullName, "es"));
  return { rows, emailsAvailable: available };
}

export async function loadUser(id: string) {
  const { supabase } = await requireProfile();
  const { data } = await supabase
    .from("perfiles")
    .select(
      "id,rol,activo,updated_at,personas(nombres,apellido_paterno,apellido_materno,ci,telefono,direccion)",
    )
    .eq("id", id)
    .maybeSingle();
  if (!data) return null;
  const admin = createAdminClient();
  let email = "";
  if (admin) {
    const r = await admin.auth.admin.getUserById(id);
    email = r.data.user?.email ?? "";
  }
  return { user: toRow(data as never, email), emailsAvailable: !!admin };
}

/** Fichas (estudiante, docente o tutor) que todavía no tienen cuenta de acceso. */
export type UnlinkedPerson = {
  id: string;
  label: string;
  kinds: ("ESTUDIANTE" | "DOCENTE" | "PADRE")[];
};
export async function loadUnlinkedPeople(): Promise<UnlinkedPerson[]> {
  const { supabase, profile } = await requireProfile();
  if (profile.rol !== "DIRECTOR" && profile.rol !== "SECRETARIA") return [];
  // Consultas simples (sin relaciones anidadas) y unión en el servidor.
  const [students, teachers, tutors, accounts] = await Promise.all([
    supabase.from("estudiantes").select("persona_id").limit(5000),
    supabase.from("docentes").select("persona_id").limit(5000),
    supabase.from("tutores").select("persona_id").limit(5000),
    supabase.from("perfiles").select("persona_id").limit(10000),
  ]);
  if (students.error || teachers.error || tutors.error || accounts.error)
    return [];
  const kinds = new Map<string, UnlinkedPerson["kinds"]>();
  const add = (
    rows: { persona_id: string }[],
    kind: UnlinkedPerson["kinds"][number],
  ) => {
    for (const r of rows)
      kinds.set(r.persona_id, [...(kinds.get(r.persona_id) || []), kind]);
  };
  add(students.data || [], "ESTUDIANTE");
  add(teachers.data || [], "DOCENTE");
  add(tutors.data || [], "PADRE");
  for (const a of accounts.data || [])
    if (a.persona_id) kinds.delete(a.persona_id);
  const ids = [...kinds.keys()];
  if (!ids.length) return [];
  const people: {
    id: string;
    nombres: string;
    apellido_paterno: string | null;
    apellido_materno: string | null;
    ci: string | null;
  }[] = [];
  for (let i = 0; i < ids.length; i += 200) {
    const { data } = await supabase
      .from("personas")
      .select("id,nombres,apellido_paterno,apellido_materno,ci")
      .in("id", ids.slice(i, i + 200));
    people.push(...(data || []));
  }
  return people
    .map((p) => ({
      id: p.id,
      kinds: kinds.get(p.id) || [],
      label: [
        p.apellido_paterno,
        p.apellido_materno,
        p.nombres,
        p.ci ? `· CI ${p.ci}` : "",
      ]
        .filter(Boolean)
        .join(" "),
    }))
    .sort((x, y) => x.label.localeCompare(y.label, "es"));
}
