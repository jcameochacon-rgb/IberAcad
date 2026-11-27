import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { loadPanel } from "@/lib/data/live";
import { loadTeacherWeek } from "@/lib/data/teachers";
import { PanelShell } from "@/components/panel-shell";
import { PageTitle } from "@/components/page-title";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

export default async function TeacherSchedule({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { profile } = await requireProfile();
  const params = await searchParams;
  const requested = typeof params.docente === "string" ? params.docente : "";
  const model = await loadPanel();
  const week = await loadTeacherWeek(requested);
  const admin = profile.rol === "DIRECTOR" || profile.rol === "SECRETARIA";
  return (
    <PanelShell model={model} current="horarios">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs text-muted-foreground">
            Gestión de docentes
          </p>
          <PageTitle fallback="Horario del docente" />
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            {admin
              ? "Elige un docente para ver sus clases de la semana en todos sus cursos."
              : "Tus clases de la semana en todos tus cursos."}
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/panel/docentes/carga">Carga académica</Link>
        </Button>
      </div>
      {!week ? (
        <Card className="p-6 text-sm text-muted-foreground">
          Esta vista es para Dirección, Secretaría y docentes.
        </Card>
      ) : (
        <Card className="overflow-hidden">
          {admin && (
            <form
              method="get"
              className="flex flex-wrap items-center gap-3 border-b border-border p-5"
            >
              <select
                name="docente"
                aria-label="Docente"
                defaultValue={week.selected}
                className="h-11 min-w-72 rounded-lg border border-input bg-background px-3 text-sm"
              >
                <option value="">Selecciona un docente</option>
                {week.teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
              <Button variant="outline" type="submit">
                Ver horario
              </Button>
              {week.selected && (
                <span className="ml-auto text-xs text-muted-foreground">
                  {week.total} periodos por semana
                </span>
              )}
            </form>
          )}
          {!week.selected ? (
            <p className="px-6 py-10 text-center text-sm text-muted-foreground">
              {admin
                ? "Selecciona un docente para ver su horario."
                : "Tu cuenta aún no está vinculada a una ficha de docente."}
            </p>
          ) : !week.periods.length ? (
            <p className="px-6 py-10 text-center text-sm text-muted-foreground">
              Este docente aún no tiene clases en el horario.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-muted text-xs text-muted-foreground">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Periodo
                    </th>
                    {days.map((d) => (
                      <th key={d} scope="col" className="px-4 py-3 font-medium">
                        {d}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {week.periods.map((p) => (
                    <tr key={p.id} className="border-t border-border">
                      <th
                        scope="row"
                        className="whitespace-nowrap px-4 py-3 text-xs font-semibold"
                      >
                        {p.numero}
                        <span className="block font-normal text-muted-foreground">
                          {p.time}
                        </span>
                      </th>
                      {days.map((_, i) => {
                        const c = week.cells[`${i + 1}|${p.id}`];
                        return (
                          <td key={i} className="px-4 py-3 align-top">
                            {c ? (
                              <div className="rounded-lg bg-primary/10 px-3 py-2">
                                <p className="text-xs font-semibold text-primary">
                                  {c.subject}
                                </p>
                                <p className="text-[11px] text-muted-foreground">
                                  {c.course}
                                </p>
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground/60">
                                Libre
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}
    </PanelShell>
  );
}
