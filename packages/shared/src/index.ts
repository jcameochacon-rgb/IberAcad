export type { Database, Json } from "./database.types";
import type { Database } from "./database.types";
export type Role = Database["public"]["Enums"]["rol_usuario"];
export const roles: readonly Role[] = [
  "DIRECTOR",
  "SECRETARIA",
  "DOCENTE",
  "PADRE",
  "ESTUDIANTE",
];
export const roleLabels: Record<Role, string> = {
  DIRECTOR: "Dirección",
  SECRETARIA: "Secretaría",
  DOCENTE: "Docente",
  PADRE: "Padre / tutor",
  ESTUDIANTE: "Estudiante",
};
export const isRole = (value: unknown): value is Role =>
  typeof value === "string" && roles.some((role) => role === value);
export type Module =
  | "estudiantes"
  | "cursos"
  | "calificaciones"
  | "asistencia"
  | "horarios"
  | "comunicados";
export const modules: readonly Module[] = [
  "estudiantes",
  "cursos",
  "calificaciones",
  "asistencia",
  "horarios",
  "comunicados",
];
export const moduleLabels: Record<Module, string> = {
  estudiantes: "Estudiantes",
  cursos: "Cursos",
  calificaciones: "Calificaciones",
  asistencia: "Asistencia",
  horarios: "Horarios",
  comunicados: "Comunicados",
};
export const isModule = (value: string): value is Module =>
  modules.some((module) => module === value);
export const roleScope: Record<Role, string> = {
  DIRECTOR: "Información de la institución",
  SECRETARIA: "Registros y consultas académicas",
  DOCENTE: "Información de tus cursos y materias",
  PADRE: "Información de tus hijos vinculados",
  ESTUDIANTE: "Tu información académica",
};
