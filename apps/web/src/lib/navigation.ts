import type { Module, Role } from "@iberdrola/shared";
export function panelHref(
  model: { demo: boolean; role: Role },
  module?: Module,
) {
  return model.demo
    ? `/demo${module ? `/${module}` : ""}?rol=${model.role}`
    : `/panel${module ? `/${module}` : ""}`;
}

export type NavIcon =
  | "inicio"
  | "cuenta"
  | "comunicados"
  | "usuarios"
  | "estudiantes"
  | "docentes"
  | "asignaturas"
  | "horarios"
  | "asistencia"
  | "calificaciones"
  | "reportes";
export type NavItem = {
  label: string;
  /** Ruta de la sesión real. */
  href: string;
  /** Ruta equivalente en la demostración; si falta, el elemento no se muestra en la demo. */
  demo?: string;
  /** Solo Dirección y Secretaría. */
  manage?: boolean;
  /** Solo estos roles. */
  roles?: readonly Role[];
  /** Etiqueta alternativa según el rol (por ejemplo "Mis hijos"). */
  roleLabels?: Partial<Record<Role, string>>;
};
export type NavGroup = {
  id: string;
  /** Número de sprint de la planificación; los grupos sin número no pertenecen a un sprint. */
  sprint?: number;
  label: string;
  icon: NavIcon;
  /** Enlace directo: se muestra sin submenú y lleva a su único elemento. */
  direct?: boolean;
  items: NavItem[];
};
export const navGroups: NavGroup[] = [
  {
    id: "usuarios",
    sprint: 1,
    label: "Gestión de Usuarios",
    icon: "usuarios",
    items: [
      {
        label: "Crear usuario",
        href: "/panel/usuarios/nuevo",
        roles: ["DIRECTOR", "SECRETARIA"],
      },
      {
        label: "Buscar usuarios",
        href: "/panel/usuarios",
        roles: ["DIRECTOR", "SECRETARIA"],
      },
      {
        label: "Editar usuario",
        href: "/panel/usuarios/editar",
        roles: ["DIRECTOR", "SECRETARIA"],
      },
      {
        label: "Desactivar usuarios",
        href: "/panel/usuarios/desactivar",
        roles: ["DIRECTOR", "SECRETARIA"],
      },
      {
        label: "Personal administrativo",
        href: "/panel/usuarios/personal",
        roles: ["DIRECTOR"],
      },
      {
        label: "Accesos de familias",
        href: "/panel/usuarios/familias",
        roles: ["DIRECTOR", "SECRETARIA"],
      },
    ],
  },
  {
    id: "estudiantes",
    sprint: 2,
    label: "Registro de Estudiantes",
    icon: "estudiantes",
    items: [
      {
        label: "Estudiantes",
        href: "/panel/estudiantes",
        demo: "/demo/estudiantes",
        roleLabels: { PADRE: "Mis hijos", ESTUDIANTE: "Mi ficha" },
      },
      {
        label: "Fichas de estudiantes",
        href: "/panel/gestion/estudiantes",
        manage: true,
      },
      {
        label: "Tutores y responsables",
        href: "/panel/gestion/tutores",
        manage: true,
      },
      { label: "Cursos", href: "/panel/cursos", demo: "/demo/cursos" },
      {
        label: "Administrar cursos",
        href: "/panel/gestion/cursos",
        manage: true,
      },
      { label: "Matrículas", href: "/panel/gestion/matriculas", manage: true },
    ],
  },
  {
    id: "docentes",
    sprint: 3,
    label: "Gestión de Docentes",
    icon: "docentes",
    items: [
      {
        label: "Consultar docentes",
        href: "/panel/docentes",
        manage: true,
      },
      {
        label: "Fichas de docentes",
        href: "/panel/gestion/docentes",
        manage: true,
      },
      {
        label: "Carga académica",
        href: "/panel/docentes/carga",
        roles: ["DIRECTOR", "SECRETARIA", "DOCENTE"],
      },
      {
        label: "Horario del docente",
        href: "/panel/docentes/horario",
        roles: ["DIRECTOR", "SECRETARIA", "DOCENTE"],
      },
      {
        label: "Cuentas de docentes",
        href: "/panel/usuarios/docentes",
        roles: ["DIRECTOR", "SECRETARIA"],
      },
    ],
  },
  {
    id: "asignaturas",
    sprint: 4,
    label: "Administrar Asignaturas",
    icon: "asignaturas",
    items: [
      { label: "Consultar asignaturas", href: "/panel/asignaturas" },
      {
        label: "Gestionar asignaturas",
        href: "/panel/gestion/asignaturas",
        manage: true,
      },
      {
        label: "Asignación de materias",
        href: "/panel/gestion/asignaciones",
        manage: true,
      },
    ],
  },
  {
    id: "horarios",
    sprint: 5,
    label: "Control de Horarios",
    icon: "horarios",
    items: [
      {
        label: "Asignación de horarios",
        href: "/panel/horarios",
        demo: "/demo/horarios",
      },
      { label: "Consultar horario", href: "/panel/horarios/semana" },
      {
        label: "Asignación de cursos",
        href: "/panel/horarios/asignar",
        manage: true,
      },
    ],
  },
  {
    id: "asistencia",
    sprint: 6,
    label: "Control de Asistencia",
    icon: "asistencia",
    items: [
      {
        label: "Registrar asistencia",
        href: "/panel/asistencia/registro",
        roles: ["DIRECTOR", "DOCENTE"],
      },
      {
        label: "Consultar asistencia",
        href: "/panel/asistencia",
        demo: "/demo/asistencia",
      },
      {
        label: "Editar asistencia",
        href: "/panel/asistencia/editar",
        roles: ["DIRECTOR", "DOCENTE"],
      },
      {
        label: "Eliminar asistencia",
        href: "/panel/asistencia/borradores",
        roles: ["DIRECTOR", "DOCENTE"],
      },
    ],
  },
  {
    id: "calificaciones",
    sprint: 7,
    label: "Gestión de Calificaciones",
    icon: "calificaciones",
    items: [
      {
        label: "Registrar calificaciones",
        href: "/panel/calificaciones/registro",
        roles: ["DIRECTOR", "DOCENTE"],
      },
      {
        label: "Consultar calificaciones",
        href: "/panel/calificaciones",
        demo: "/demo/calificaciones",
      },
      {
        label: "Editar calificaciones",
        href: "/panel/calificaciones/editar",
        roles: ["DIRECTOR", "DOCENTE"],
      },
      {
        label: "Eliminar calificaciones",
        href: "/panel/calificaciones/borradores",
        roles: ["DIRECTOR", "DOCENTE"],
      },
    ],
  },
  {
    id: "reportes",
    sprint: 8,
    label: "Reportes Académicos",
    icon: "reportes",
    items: [
      { label: "Generar informe/reporte", href: "/panel/informes" },
      {
        label: "Consultar informes/reportes",
        href: "/panel/informes/guardados",
      },
      { label: "Editar parámetros", href: "/panel/informes/editar" },
      { label: "Eliminar reporte", href: "/panel/informes/eliminar" },
    ],
  },
];
export type ResolvedNavItem = { label: string; href: string; path: string };
export type ResolvedNavGroup = Omit<NavGroup, "items"> & {
  items: ResolvedNavItem[];
};
/** Filtra el menú según rol y modo (demo o sesión real) y resuelve las rutas. */
export function resolveNav(model: {
  demo: boolean;
  role: Role;
}): ResolvedNavGroup[] {
  const manager = model.role === "DIRECTOR" || model.role === "SECRETARIA";
  return navGroups
    .map((group) => ({
      ...group,
      items: group.items.flatMap((item): ResolvedNavItem[] => {
        if (item.manage && !manager) return [];
        if (item.roles && !item.roles.includes(model.role)) return [];
        if (model.demo && item.demo === undefined) return [];
        const path = model.demo ? item.demo! : item.href;
        return [
          {
            label: item.roleLabels?.[model.role] ?? item.label,
            path,
            href: model.demo ? `${path}?rol=${model.role}` : path,
          },
        ];
      }),
    }))
    .filter((group) => group.items.length > 0);
}
/** Elemento activo: la ruta más específica que coincide con la dirección actual. */
export function activeNav(groups: ResolvedNavGroup[], pathname: string) {
  let best: { group: ResolvedNavGroup; item: ResolvedNavItem } | null = null;
  for (const group of groups)
    for (const item of group.items) {
      const exact = pathname === item.path;
      const nested =
        item.path !== "/panel" &&
        item.path !== "/demo" &&
        pathname.startsWith(`${item.path}/`);
      if (
        (exact || nested) &&
        (!best || item.path.length > best.item.path.length)
      )
        best = { group, item };
    }
  return best;
}
