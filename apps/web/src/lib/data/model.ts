import type { Role, Module } from "@iberdrola/shared";
/** `filter`: la consulta muestra un desplegable con los valores de esa columna. */
export type TableColumn = { key: string; label: string; filter?: boolean };
export type TableRow = {
  id: string;
  cells: Record<string, string | number | null>;
  tone?: "success" | "warning" | "danger";
};
export type Listing = {
  title: string;
  description: string;
  columns: TableColumn[];
  rows: TableRow[];
  total: number;
};
export type PanelModel = {
  role: Role;
  name: string;
  year: number | null;
  demo: boolean;
  studentCount: number;
  courseCount: number;
  publishedGrades: number;
  attendanceCount: number;
  listings: Record<Module, Listing>;
  notices: {
    id: string;
    title: string;
    content: string;
    date: string | null;
  }[];
  terms: { number: number; state: string }[];
};
export function displayDate(value: string | null) {
  return value
    ? new Intl.DateTimeFormat("es-BO", {
        timeZone: "America/La_Paz",
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(
        new Date(value.length === 10 ? `${value}T12:00:00-04:00` : value),
      )
    : "Sin fecha";
}
export const gradeTone = (state: string | null): TableRow["tone"] =>
  state === "APROBADO"
    ? "success"
    : state === "REPROBADO"
      ? "danger"
      : "warning";
export const labels = {
  estudiantes: {
    title: "Estudiantes",
    description: "Fichas de los estudiantes que puedes consultar.",
    columns: [
      { key: "name", label: "Estudiante" },
      { key: "rude", label: "RUDE" },
      { key: "status", label: "Estado", filter: true },
    ],
  },
  cursos: {
    title: "Cursos",
    description: "Cursos y paralelos de la gestión seleccionada.",
    columns: [
      { key: "course", label: "Curso" },
      { key: "grade", label: "Año de escolaridad", filter: true },
      { key: "status", label: "Estado", filter: true },
    ],
  },
  calificaciones: {
    title: "Calificaciones",
    description:
      "Notas trimestrales disponibles para tu rol. Los registros pendientes conservan su estado.",
    columns: [
      { key: "student", label: "Estudiante" },
      { key: "subject", label: "Asignatura", filter: true },
      { key: "term", label: "Trimestre", filter: true },
      { key: "grade", label: "Nota final" },
      { key: "status", label: "Situación", filter: true },
    ],
  },
  asistencia: {
    title: "Asistencia",
    description:
      "Registros diarios publicados y borradores visibles para tu rol.",
    columns: [
      { key: "student", label: "Estudiante" },
      { key: "date", label: "Fecha", filter: true },
      { key: "state", label: "Marca", filter: true },
      { key: "status", label: "Jornada", filter: true },
    ],
  },
  horarios: {
    title: "Horarios",
    description: "Distribución de materias por curso, día y periodo.",
    columns: [
      { key: "course", label: "Curso", filter: true },
      { key: "day", label: "Día", filter: true },
      { key: "period", label: "Periodo" },
      { key: "subject", label: "Asignatura", filter: true },
      { key: "time", label: "Hora" },
    ],
  },
  comunicados: {
    title: "Comunicados",
    description: "Avisos institucionales o dirigidos a tus cursos y tu cuenta.",
    columns: [
      { key: "title", label: "Título" },
      { key: "date", label: "Fecha" },
      { key: "status", label: "Estado", filter: true },
    ],
  },
} satisfies Record<Module, Omit<Listing, "rows" | "total">>;
