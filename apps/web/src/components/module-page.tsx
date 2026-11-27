import { PanelShell } from "@/components/panel-shell";
import { PageTitle } from "@/components/page-title";
import { Card } from "@/components/ui/card";
import { RecordsTable } from "@/components/records-table";
import type { Module } from "@iberdrola/shared";
import type { PanelModel } from "@/lib/data/model";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { canManage } from "@/lib/management-validation";
import { canRecordGrades } from "@/lib/grades-validation";
import { canRecordAttendance } from "@/lib/attendance-validation";
export function ModulePage({
  model,
  module,
}: {
  model: PanelModel;
  module: Module;
}) {
  const listing = model.listings[module];
  return (
    <PanelShell model={model} current={module}>
      <div className="mb-7">
        <p className="mb-2 text-xs text-muted-foreground">Consulta académica</p>
        <PageTitle fallback={listing.title} />
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {listing.description}
        </p>
      </div>
      <Card className="overflow-hidden">
        <RecordsTable listing={listing} />
      </Card>
      {!model.demo &&
        canManage(model.role) &&
        (module === "estudiantes" || module === "cursos") && (
          <Button asChild className="mt-5">
            <Link href={`/panel/gestion/${module}`}>
              Registrar y editar {module}
            </Link>
          </Button>
        )}
      <p className="mt-5 text-xs leading-6 text-muted-foreground">
        {module === "estudiantes" || module === "cursos"
          ? "Esta lista muestra los registros activos. Dirección y Secretaría pueden gestionar también las fichas inactivas desde Gestión académica."
          : module === "asistencia" && !model.demo
            ? "Dirección y los docentes asignados pueden registrar y publicar jornadas. La familia autorizada consulta únicamente sus marcas publicadas."
            : module === "horarios" && !model.demo
              ? "Consulta el horario semanal del curso. Dirección y Secretaría pueden configurar periodos y gestionar bloques."
              : module === "calificaciones" && !model.demo
                ? "Dirección y cada docente registran y publican las calificaciones de sus materias. La familia consulta únicamente sus notas publicadas."
                : module === "comunicados" && !model.demo
                  ? "Abre el tablón para consultar los avisos completos y gestionar borradores y publicaciones según tus permisos."
                  : "Este módulo permite consultar y buscar registros. La captura desde formularios se añadirá en una próxima fase."}
      </p>
      {!model.demo &&
        module === "asistencia" &&
        canRecordAttendance(model.role) && (
          <Button asChild className="mt-5">
            <Link href="/panel/asistencia/registro">Registrar asistencia</Link>
          </Button>
        )}
      {!model.demo &&
        module === "calificaciones" &&
        canRecordGrades(model.role) && (
          <Button asChild className="mt-5">
            <Link href="/panel/calificaciones/registro">
              Registrar calificaciones
            </Link>
          </Button>
        )}
      {!model.demo && module === "horarios" && (
        <Button asChild className="mt-5">
          <Link href="/panel/horarios/semana">Consultar horario</Link>
        </Button>
      )}
      {!model.demo && module === "comunicados" && (
        <Button asChild className="mt-5">
          <Link href="/panel/comunicados/bandeja">
            Abrir tablón de comunicados
          </Link>
        </Button>
      )}
      {module === "comunicados" && (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {model.notices.map((n) => (
            <Card key={n.id} className="p-5">
              <h2 className="text-sm font-semibold">{n.title}</h2>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
                {n.content}
              </p>
            </Card>
          ))}
        </div>
      )}
    </PanelShell>
  );
}
