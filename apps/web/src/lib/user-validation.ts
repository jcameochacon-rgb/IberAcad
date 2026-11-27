import { isRole, type Role } from "@iberdrola/shared";
import { validEmail } from "@/lib/auth-validation";

export type UserValues = {
  email: string;
  rol: Role;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  ci: string;
  telefono: string;
  direccion: string;
};
export type UserFormState = {
  error?: string;
  success?: string;
  values?: Record<string, string>;
  attempt?: number;
};
export const uuidRe =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const clean = (v: FormDataEntryValue | null, max: number) =>
  String(v ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);

export function readUserForm(form: FormData) {
  return {
    email: clean(form.get("email"), 254).toLowerCase(),
    rol: clean(form.get("rol"), 20),
    nombres: clean(form.get("nombres"), 120),
    apellido_paterno: clean(form.get("apellido_paterno"), 120),
    apellido_materno: clean(form.get("apellido_materno"), 120),
    ci: clean(form.get("ci"), 40),
    telefono: clean(form.get("telefono"), 40),
    direccion: clean(form.get("direccion"), 500),
  };
}

/** Devuelve un mensaje de error o null si los datos son válidos. */
export function validateUser(
  v: ReturnType<typeof readUserForm>,
  opts: { needsEmail: boolean },
): string | null {
  if (opts.needsEmail && !validEmail(v.email))
    return "Ingresa un correo electrónico válido.";
  if (!isRole(v.rol)) return "Selecciona el rol del usuario.";
  if (v.nombres.length < 2) return "Escribe los nombres (mínimo 2 letras).";
  if (!v.apellido_paterno && !v.apellido_materno)
    return "Escribe al menos un apellido.";
  if (v.telefono && !/^[0-9+()\-\s]{6,40}$/.test(v.telefono))
    return "El teléfono solo puede tener números, espacios, + ( ) y guiones.";
  return null;
}

/** Texto en minúsculas sin tildes para búsquedas. */
export const fold = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** Roles de las cuentas que Secretaría puede crear, editar y desactivar. */
export const managedBySecretary = ["ESTUDIANTE", "DOCENTE", "PADRE"] as const;
