import { operationTitle } from "@/lib/workspace-navigation";
import { PanelShell } from "@/components/panel-shell";
import { Card } from "@/components/ui/card";
import { RecordsTable } from "@/components/records-table";
import type { Module } from "@iberdrola/shared";
import type { PanelModel } from "@/lib/data/model";
export function ModulePage({
  model,
  module,
  years,
  selectedYear,
}: {
  model: PanelModel;
  module: Module;
  years?: { id: string; anio: number }[];
  selectedYear?: string;
}) {
  const listing = model.listings[module];
  return (
    <PanelShell model={model} current={module}>
      <div className="mb-7">
        <p className="mb-2 text-xs text-muted-foreground">Consulta académica</p>
        <h1 className="text-3xl font-semibold tracking-tight">
          {operationTitle(module, "consultar")}
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {listing.description}
        </p>
      </div>
      {years && (
        <form
          method="get"
          className="query-year-bar"
          action={`/panel/${module}`}
        >
          <label>
            Gestión académica
            <select
              name="gestion"
              defaultValue={
                selectedYear ||
                years.find((y) => y.anio === model.year)?.id ||
                ""
              }
            >
              {years.map((y) => (
                <option key={y.id} value={y.id}>
                  {y.anio}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" className="crud-row-action">
            Consultar gestión
          </button>
          <p>Información visible según los permisos de tu cuenta.</p>
        </form>
      )}
      <Card className="overflow-hidden">
        <RecordsTable key={`${module}-${model.year}`} listing={listing} />
      </Card>
    </PanelShell>
  );
}
