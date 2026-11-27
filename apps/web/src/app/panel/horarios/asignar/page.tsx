import Link from "next/link";
import { PageTitle } from "@/components/page-title";
import { CalendarPlus, ClipboardList } from "lucide-react";
import { requireProfile } from "@/lib/auth";
import { loadPanel } from "@/lib/data/live";
import { loadScheduleCourses } from "@/lib/data/schedule";
import { canManage } from "@/lib/management-validation";
import { PanelShell } from "@/components/panel-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/** Punto de partida para asignar el horario de un curso: Dirección y Secretaría. */
export default async function AsignarCurso() {
  const { profile } = await requireProfile();
  const model = await loadPanel();
  if (!canManage(profile.rol))
    return (
      <PanelShell model={model} current="horarios">
        <Card className="p-7">
          <h1 className="text-2xl font-semibold">Acceso restringido</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Solo Dirección y Secretaría pueden asignar horarios a los cursos.
          </p>
          <Button asChild className="mt-5">
            <Link href="/panel/horarios">Ver asignación de horarios</Link>
          </Button>
        </Card>
      </PanelShell>
    );
  const courses = await loadScheduleCourses();
  return (
    <PanelShell model={model} current="horarios">
      <div className="mb-7">
        <p className="mb-2 text-xs text-muted-foreground">
          Control de horarios · Dirección y Secretaría
        </p>
        <PageTitle fallback="Asignación de cursos" />
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          Elige un curso para ubicar sus materias en el horario semanal. Si
          todavía no tiene materias con docente, asígnalas primero.
        </p>
      </div>
      {courses.length ? (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {courses.map((c) => (
            <li key={c.id}>
              <Card className="flex h-full flex-col p-5">
                <h2 className="text-lg font-semibold">{c.label}</h2>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Button asChild size="sm">
                    <Link
                      href={`/panel/horarios/semana?curso=${c.id}#editar-bloque`}
                    >
                      <CalendarPlus size={15} /> Asignar horario
                    </Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link
                      href={`/panel/gestion/asignaciones?nuevo=1&curso=${c.id}`}
                    >
                      <ClipboardList size={15} /> Asignar materia
                    </Link>
                  </Button>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      ) : (
        <Card className="p-7 text-sm">
          Aún no hay cursos. Créalos en{" "}
          <Link
            className="font-semibold text-primary underline"
            href="/panel/gestion/cursos"
          >
            Administrar cursos
          </Link>
          .
        </Card>
      )}
    </PanelShell>
  );
}
