import { describe, it, expect } from "vitest";
import {
  titles,
  sections,
  sectionsForRole,
  sectionTitles,
  allowedActions,
  operationTitle,
  workspaceHref,
  moduleAt,
  type WorkspaceModule,
} from "./workspace-navigation";
describe("navegación por rol", () => {
  it("conserva las operaciones originales en ocho módulos", () => {
    expect(Object.values(titles)).toEqual([
      "Gestión de usuarios",
      "Registro de estudiante",
      "Gestión de docente",
      "Padres y tutores",
      "Accesos de padres y tutores",
      "Personal administrativo",
      "Gestión de Cursos",
      "Asignación de materias",
      "Matrículas",
      "Administración de asignaturas",
      "Control de horarios",
      "Control de asistencia",
      "Gestión de calificaciones",
      "Informes y reportes",
    ]);
    expect(sections).toHaveLength(8);
    expect(sections.flatMap((s) => s.children).sort()).toEqual(
      Object.keys(titles)
        .filter((m) => !["familias", "personal"].includes(m))
        .sort(),
    );
    expect(
      sections.find((section) => section.id === "asignaturas")?.children,
    ).toEqual(["asignaturas", "cursos", "asignaciones"]);
    expect(allowedActions("DIRECTOR", "usuarios")).toHaveLength(4);
    expect(allowedActions("SECRETARIA", "usuarios")).toHaveLength(4);
    expect(allowedActions("SECRETARIA", "personal")).toEqual([]);
    expect(allowedActions("DIRECTOR", "personal")).toEqual([
      "registrar",
      "consultar",
      "editar",
      "eliminar",
    ]);
  });
  it("muestra exactamente los módulos principales de cada rol", () => {
    const all = [
      "usuarios",
      "estudiantes",
      "docentes",
      "asignaturas",
      "horarios",
      "asistencia",
      "calificaciones",
      "informes",
    ];
    expect(Object.keys(sectionTitles)).toEqual(all);
    expect(sectionsForRole("DIRECTOR").map((s) => s.id)).toEqual(all);
    expect(sectionsForRole("SECRETARIA").map((s) => s.id)).toEqual(all);
    expect(sectionsForRole("DOCENTE").map((s) => s.id)).toEqual([
      "asignaturas",
      "horarios",
      "asistencia",
      "calificaciones",
      "informes",
    ]);
    expect(sectionsForRole("PADRE").map((s) => s.id)).toEqual([
      "estudiantes",
      "horarios",
      "asistencia",
      "calificaciones",
    ]);
    expect(sectionsForRole("ESTUDIANTE").map((s) => s.id)).toEqual([
      "horarios",
      "asistencia",
      "calificaciones",
    ]);
  });
  it("no pierde ni duplica opciones ni concede nuevas acciones", () => {
    for (const role of [
      "DIRECTOR",
      "SECRETARIA",
      "DOCENTE",
      "PADRE",
      "ESTUDIANTE",
    ] as const) {
      const groups = sectionsForRole(role);
      expect(groups.every((s) => s.children.length > 0)).toBe(true);
      const children = groups.flatMap((s) => s.children);
      expect(children.sort()).toEqual(
        (Object.keys(titles) as WorkspaceModule[])
          .filter(
            (m) =>
              !["familias", "personal"].includes(m) &&
              allowedActions(role, m).length,
          )
          .sort(),
      );
      for (const group of groups) expect(group.children).toContain(group.id);
    }
    expect(
      sectionsForRole("DOCENTE").find((s) => s.id === "asignaturas")?.children,
    ).toEqual(["asignaturas", "estudiantes"]);
    for (const role of ["PADRE", "ESTUDIANTE"] as const) {
      expect(
        sectionsForRole(role).find((s) => s.id === "horarios")?.children,
      ).toEqual(["horarios", "asignaturas"]);
      expect(
        sectionsForRole(role).find((s) => s.id === "calificaciones")?.children,
      ).toEqual(["calificaciones", "informes"]);
    }
  });
  it("concede CRUD académico a administración y secretaría", () => {
    for (const m of Object.keys(titles) as WorkspaceModule[])
      for (const r of ["DIRECTOR", "SECRETARIA"] as const)
        expect(allowedActions(r, m)).toEqual(
          m === "personal" && r === "SECRETARIA"
            ? []
            : ["asistencia", "calificaciones"].includes(m)
              ? ["registrar", "consultar", "editar"]
              : m === "informes"
                ? ["generar", "consultar", "editar", "eliminar"]
                : ["registrar", "consultar", "editar", "eliminar"],
        );
  });
  it("limita docentes a sus operaciones autorizadas", () => {
    expect(allowedActions("DOCENTE", "usuarios")).toEqual([]);
    expect(allowedActions("DOCENTE", "docentes")).toEqual([]);
    expect(allowedActions("DOCENTE", "cursos")).toEqual([]);
    for (const m of ["estudiantes", "asignaturas", "horarios"] as const)
      expect(allowedActions("DOCENTE", m)).toEqual(["consultar"]);
    for (const m of ["asistencia", "calificaciones"] as const)
      expect(allowedActions("DOCENTE", m)).toEqual([
        "registrar",
        "consultar",
        "editar",
      ]);
    expect(allowedActions("DOCENTE", "informes")).toEqual([
      "generar",
      "consultar",
    ]);
  });
  it("estudiantes no pueden administrar cursos", () => {
    expect(allowedActions("PADRE", "cursos")).toEqual([]);
    for (const m of Object.keys(titles) as WorkspaceModule[])
      expect(allowedActions("ESTUDIANTE", m)).toEqual(
        [
          "asignaturas",
          "horarios",
          "asistencia",
          "calificaciones",
          "informes",
        ].includes(m)
          ? ["consultar"]
          : [],
      );
  });
  it("mantiene cada acción dentro de su módulo y una URL diferente", () => {
    for (const m of Object.keys(titles) as WorkspaceModule[]) {
      const links = allowedActions("DIRECTOR", m).map((a) =>
        workspaceHref("DIRECTOR", m, a),
      );
      expect(new Set(links).size).toBe(
        ["asistencia", "calificaciones"].includes(m) ? 3 : 4,
      );
      for (const link of links) {
        const [path, query] = link.split("?");
        expect(moduleAt(path, new URLSearchParams(query).get("modulo"))).toBe(
          m,
        );
      }
    }
  });
  it("abre formularios nuevos y conserva contexto de la demo", () => {
    expect(workspaceHref("DIRECTOR", "estudiantes", "registrar")).toBe(
      "/panel/usuarios?modulo=estudiantes&accion=registrar&rol=ESTUDIANTE",
    );
    expect(workspaceHref("DIRECTOR", "docentes", "registrar")).toBe(
      "/panel/usuarios?modulo=docentes&accion=registrar&rol=DOCENTE",
    );
    expect(workspaceHref("DIRECTOR", "tutores", "registrar")).toBe(
      "/panel/usuarios?modulo=tutores&accion=registrar&rol=PADRE",
    );
    expect(workspaceHref("DOCENTE", "asistencia", "editar", true)).toBe(
      "/demo/operaciones?modulo=asistencia&accion=editar&rol=DOCENTE",
    );
    expect(workspaceHref("DIRECTOR", "cursos", "registrar")).toBe(
      "/panel/gestion/cursos?accion=registrar&nuevo=1",
    );
    expect(workspaceHref("DIRECTOR", "usuarios", "consultar")).toBe(
      "/panel/usuarios?accion=consultar",
    );
    expect(workspaceHref("DIRECTOR", "usuarios", "registrar")).toBe(
      "/panel/usuarios?accion=registrar",
    );
    expect(workspaceHref("DIRECTOR", "asignaciones", "registrar")).toBe(
      "/panel/gestion/asignaciones?accion=registrar&nuevo=1",
    );
    expect(workspaceHref("DIRECTOR", "matriculas", "registrar")).toBe(
      "/panel/gestion/matriculas?accion=registrar&nuevo=1",
    );
    expect(workspaceHref("DIRECTOR", "familias", "registrar")).toBe(
      "/panel/usuarios?modulo=familias&rol=PADRE&accion=registrar",
    );
    expect(workspaceHref("DIRECTOR", "personal", "editar")).toBe(
      "/panel/usuarios?modulo=personal&rol=SECRETARIA&accion=editar",
    );
  });
});

describe("títulos de las operaciones", () => {
  it("identifica la acción y la entidad en los encabezados", () => {
    expect(operationTitle("usuarios", "consultar")).toBe("Buscar usuarios");
    expect(operationTitle("docentes", "editar")).toBe("Editar docentes");
    expect(operationTitle("estudiantes", "registrar")).toBe(
      "Registrar estudiantes",
    );
    expect(operationTitle("calificaciones", "eliminar")).toBe(
      "Eliminar calificaciones",
    );
    expect(operationTitle("matriculas", "registrar")).toBe(
      "Matricular estudiante",
    );
    expect(operationTitle("informes", "generar")).toBe(
      "Generar informe o reporte",
    );
    expect(operationTitle("informes", "editar")).toBe(
      "Editar parámetros de informes y reportes",
    );
  });
  it("cubre todas las operaciones del menú con títulos distintos", () => {
    const headings = (Object.keys(titles) as WorkspaceModule[]).flatMap(
      (module) =>
        allowedActions("DIRECTOR", module).map((action) =>
          operationTitle(module, action),
        ),
    );
    expect(headings).toHaveLength(54);
    expect(new Set(headings).size).toBe(headings.length);
    expect(
      headings.every((heading) =>
        /^(Registrar|Consultar|Editar|Eliminar|Generar|Matricular|Crear|Buscar|Desactivar|Desvincular) /.test(
          heading,
        ),
      ),
    ).toBe(true);
  });
});
