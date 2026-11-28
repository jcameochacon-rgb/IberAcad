import type { Role } from "@iberdrola/shared";
export type Action =
  "registrar" | "consultar" | "editar" | "eliminar" | "generar";
export type WorkspaceModule =
  | "usuarios"
  | "estudiantes"
  | "docentes"
  | "tutores"
  | "familias"
  | "personal"
  | "cursos"
  | "asignaciones"
  | "matriculas"
  | "asignaturas"
  | "horarios"
  | "asistencia"
  | "calificaciones"
  | "informes";
export const titles: Record<WorkspaceModule, string> = {
  usuarios: "Gestión de usuarios",
  estudiantes: "Registro de estudiante",
  docentes: "Gestión de docente",
  tutores: "Padres y tutores",
  familias: "Accesos de padres y tutores",
  personal: "Personal administrativo",
  cursos: "Gestión de Cursos",
  asignaciones: "Asignación de materias",
  matriculas: "Matrículas",
  asignaturas: "Administración de asignaturas",
  horarios: "Control de horarios",
  asistencia: "Control de asistencia",
  calificaciones: "Gestión de calificaciones",
  informes: "Informes y reportes",
};
// Los ocho módulos principales son independientes de las rutas y permisos.
type SectionId =
  | "usuarios"
  | "estudiantes"
  | "docentes"
  | "asignaturas"
  | "horarios"
  | "asistencia"
  | "calificaciones"
  | "informes";
type Section = { id: SectionId; children: WorkspaceModule[] };

export const sections: Section[] = [
  { id: "usuarios", children: ["usuarios", "tutores"] },
  { id: "estudiantes", children: ["estudiantes", "matriculas"] },
  { id: "docentes", children: ["docentes"] },
  { id: "asignaturas", children: ["asignaturas", "cursos", "asignaciones"] },
  { id: "horarios", children: ["horarios"] },
  { id: "asistencia", children: ["asistencia"] },
  { id: "calificaciones", children: ["calificaciones"] },
  { id: "informes", children: ["informes"] },
];

export const sectionTitles: Record<SectionId, string> = {
  usuarios: "Gestión de usuarios",
  estudiantes: "Registro de estudiantes",
  docentes: "Gestión de docentes",
  asignaturas: "Administración de asignaturas",
  horarios: "Control de horarios",
  asistencia: "Control de asistencia",
  calificaciones: "Gestión de calificaciones",
  informes: "Informes y reportes",
};

// Reubicar las consultas existentes sin conceder ni revocar permisos.
export function sectionsForRole(role: Role): Section[] {
  const family = role === "ESTUDIANTE" || role === "PADRE";
  const visible = new Set<SectionId>(
    role === "ESTUDIANTE"
      ? ["horarios", "asistencia", "calificaciones"]
      : role === "PADRE"
        ? ["estudiantes", "horarios", "asistencia", "calificaciones"]
        : role === "DOCENTE"
          ? [
              "asignaturas",
              "horarios",
              "asistencia",
              "calificaciones",
              "informes",
            ]
          : sections.map((s) => s.id),
  );
  return sections
    .filter((s) => visible.has(s.id))
    .map((s) => {
      const children: WorkspaceModule[] = [...s.children];
      if (role === "DOCENTE" && s.id === "asignaturas")
        children.push("estudiantes");
      if (family && s.id === "horarios") children.push("asignaturas");
      if (family && s.id === "calificaciones") children.push("informes");
      return {
        id: s.id,
        children: children.filter((m) => allowedActions(role, m).length > 0),
      };
    });
}
export function allowedActions(role: Role, module: WorkspaceModule): Action[] {
  if (["asistencia", "calificaciones"].includes(module))
    return role === "DIRECTOR" || role === "SECRETARIA" || role === "DOCENTE"
      ? ["registrar", "consultar", "editar"]
      : ["consultar"];
  const admin = role === "DIRECTOR" || role === "SECRETARIA";
  if (admin) {
    if (module === "personal" && role !== "DIRECTOR") return [];
    return module === "informes"
      ? ["generar", "consultar", "editar", "eliminar"]
      : ["registrar", "consultar", "editar", "eliminar"];
  }
  if (role === "DOCENTE") {
    if (["estudiantes", "asignaturas", "horarios"].includes(module))
      return ["consultar"];
    if (["asistencia", "calificaciones"].includes(module))
      return ["registrar", "consultar", "editar", "eliminar"];
    if (module === "informes") return ["generar", "consultar"];
    return [];
  }
  return [
    "asignaturas",
    "horarios",
    "asistencia",
    "calificaciones",
    "informes",
  ].includes(module) ||
    (role === "PADRE" && module === "estudiantes")
    ? ["consultar"]
    : [];
}
export function actionLabel(module: WorkspaceModule, action: Action) {
  if (module === "usuarios")
    return {
      registrar: "Crear usuario",
      consultar: "Buscar usuarios",
      editar: "Editar usuarios",
      eliminar: "Desactivar usuarios",
      generar: "Crear usuario",
    }[action];
  if (module === "docentes" && action === "eliminar")
    return "Desactivar docente";
  if (module === "tutores")
    return {
      registrar: "Registrar tutor",
      consultar: "Buscar tutor",
      editar: "Editar ficha",
      eliminar: "Desvincular hijo",
      generar: "Registrar tutor",
    }[action];
  const verb = {
    registrar: "Registrar",
    consultar: "Consultar",
    editar: "Editar",
    eliminar: "Eliminar",
    generar: "Generar",
  }[action];
  if (module === "informes")
    return {
      generar: "Generar informe/reporte",
      consultar: "Consultar informes/reportes",
      editar: "Editar parámetros",
      eliminar: "Eliminar reporte",
      registrar: "Generar informe/reporte",
    }[action];
  if (module === "matriculas")
    return {
      registrar: "Matricular estudiante",
      consultar: "Consultar matrículas",
      editar: "Editar matrícula",
      eliminar: "Eliminar matrícula",
      generar: "Matricular estudiante",
    }[action];
  return module === "asistencia"
    ? `${verb} asistencia`
    : module === "calificaciones"
      ? `${verb} calificaciones`
      : verb;
}
// Los nombres del menú identifican módulos; los encabezados identifican acciones.
const pageSubjects: Record<WorkspaceModule, string> = {
  usuarios: "usuarios",
  estudiantes: "estudiantes",
  docentes: "docentes",
  tutores: "padres y tutores",
  familias: "cuentas familiares",
  personal: "personal administrativo",
  cursos: "cursos",
  asignaciones: "asignaciones de materias",
  matriculas: "matrículas",
  asignaturas: "asignaturas",
  horarios: "horarios",
  asistencia: "asistencia",
  calificaciones: "calificaciones",
  informes: "informes y reportes",
};
export function operationTitle(
  module: WorkspaceModule,
  action: Action,
): string {
  if (
    ["usuarios", "tutores"].includes(module) ||
    (module === "docentes" && action === "eliminar")
  )
    return actionLabel(module, action);
  if (module === "informes") {
    if (action === "generar" || action === "registrar")
      return "Generar informe o reporte";
    if (action === "editar") return "Editar parámetros de informes y reportes";
    if (action === "eliminar") return "Eliminar reporte";
  }
  if (module === "matriculas" && action === "registrar")
    return "Matricular estudiante";
  const verb = {
    registrar: "Registrar",
    consultar: "Consultar",
    editar: "Editar",
    eliminar: "Eliminar",
    generar: "Generar",
  }[action];
  return `${verb} ${pageSubjects[module]}`;
}
export function workspaceHref(
  role: Role,
  module: WorkspaceModule,
  action: Action,
  demo = false,
) {
  if (demo)
    return `/demo/operaciones?modulo=${module}&accion=${action}&rol=${role}`;
  let base = "/panel";
  switch (module) {
    case "usuarios":
      base += "/usuarios";
      break;
    case "estudiantes":
      if (action === "registrar")
        return "/panel/usuarios?modulo=estudiantes&accion=registrar&rol=ESTUDIANTE";
      base +=
        role === "DIRECTOR" || role === "SECRETARIA"
          ? "/gestion/estudiantes"
          : "/estudiantes";
      break;
    case "docentes":
      if (action === "registrar")
        return "/panel/usuarios?modulo=docentes&accion=registrar&rol=DOCENTE";
      base += "/gestion/docentes";
      break;
    case "tutores":
      if (action === "eliminar") return "/panel/vinculacion?accion=eliminar";
      if (action === "registrar")
        return "/panel/usuarios?modulo=tutores&accion=registrar&rol=PADRE";
      base += "/gestion/tutores";
      break;
    case "familias":
    case "personal":
      return `/panel/usuarios?modulo=${module}&rol=${module === "familias" ? "PADRE" : "SECRETARIA"}&accion=${action}`;
    case "cursos":
      base += "/gestion/cursos";
      break;
    case "asignaciones":
      base += "/gestion/asignaciones";
      break;
    case "matriculas":
      base += "/gestion/matriculas";
      break;
    case "asignaturas":
      base += "/asignaturas";
      break;
    case "horarios":
      base += "/horarios/semana";
      break;
    case "asistencia":
    case "calificaciones":
      base += `/${module}${action === "consultar" ? "" : "/registro"}`;
      break;
    case "informes":
      base += "/informes";
  }
  return `${base}?accion=${action}${action === "registrar" && ["estudiantes", "docentes", "tutores", "cursos", "asignaciones", "matriculas"].includes(module) ? "&nuevo=1" : ""}`;
}
export function moduleAt(
  path: string,
  requested?: string | null,
): WorkspaceModule | null {
  if (path === "/panel/vinculacion") return "tutores";
  if (requested && Object.hasOwn(titles, requested))
    return requested as WorkspaceModule;
  for (const key of Object.keys(titles) as WorkspaceModule[])
    if (path.split("/").includes(key)) return key;
  return null;
}
export function readAction(
  value: unknown,
  fallback: Action = "consultar",
): Action {
  return typeof value === "string" &&
    ["registrar", "consultar", "editar", "eliminar", "generar"].includes(value)
    ? (value as Action)
    : fallback;
}
