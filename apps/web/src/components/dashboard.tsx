import { PanelShell } from "./panel-shell";
import { RecordsTable } from "./records-table";
import { Card } from "./ui/card";
import type { PanelModel } from "@/lib/data/model";

const copy = {
  DIRECTOR: ["Visión institucional", "Supervisa la gestión académica y administra las cuentas de la comunidad."],
  SECRETARIA: ["Gestión del día", "Organiza estudiantes, docentes, horarios y el seguimiento académico."],
  DOCENTE: ["Tus aulas, al día", "Revisa los resultados, la asistencia y el horario de tus cursos."],
  PADRE: ["Acompaña cada paso", "Consulta los resultados y la asistencia de tus hijos vinculados. Cada registro indica a qué estudiante pertenece."],
  ESTUDIANTE: ["Tu avance académico", "Revisa tus calificaciones, tu asistencia y las materias de tu horario."],
};

export function Dashboard({ model }: { model: PanelModel }) {
  const [title, body] = copy[model.role];
  const family = model.role === "PADRE" || model.role === "ESTUDIANTE";
  const stats = [
    [model.role === "PADRE" ? "Hijos vinculados" : model.role === "ESTUDIANTE" ? "Ficha personal" : "Estudiantes visibles", model.studentCount],
    ["Calificaciones publicadas", model.publishedGrades],
    ["Registros de asistencia", model.attendanceCount],
    [family ? "Cursos vinculados" : "Cursos visibles", model.courseCount],
  ];

  return (
    <PanelShell model={model}>
      <p className="text-sm text-slate-500">Gestión {model.year ?? "sin configurar"}</p>
      <h1 className="mt-2 text-4xl font-semibold">{title}</h1>
      <p className="my-5 max-w-3xl text-lg leading-7 text-slate-600">{body}</p>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map(([label, value]) => (
          <Card key={String(label)} className="stat-card min-h-32 p-5 sm:p-6">
            <p className="text-sm leading-5 text-slate-500">{label}</p>
            <p className="mt-3 text-3xl font-semibold sm:text-4xl">{value}</p>
          </Card>
        ))}
      </div>
      <div className="mt-8 space-y-8">
        {(family ? ["calificaciones", "asistencia", "horarios"] as const : ["asistencia", "calificaciones", "horarios"] as const).map((module) => (
          <section key={module}>
            <h2 className="mb-3 text-xl font-semibold">{model.listings[module].title}</h2>
            <Card className="overflow-hidden">
              <RecordsTable listing={model.listings[module]} compact />
            </Card>
          </section>
        ))}
      </div>
      <p className="mt-5 text-sm leading-6 text-slate-500">
        Las listas muestran los registros recientes autorizados para tu cuenta. Usa el menú para consultar el detalle de cada módulo.
      </p>
    </PanelShell>
  );
}
