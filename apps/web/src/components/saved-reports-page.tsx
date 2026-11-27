import Link from "next/link";
import { loadPanel } from "@/lib/data/live";
import { loadSavedReports } from "@/lib/data/saved-reports";
import { PanelShell } from "@/components/panel-shell";
import { PageTitle } from "@/components/page-title";
import { SavedReportList } from "@/components/saved-reports";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const copy = {
  consultar: {
    title: "Consultar informes/reportes",
    lead: "Tus informes guardados. Al abrir uno se vuelven a consultar los datos actuales con los mismos filtros.",
  },
  editar: {
    title: "Editar parámetros",
    lead: "Renombra un informe o ábrelo con «Cambiar filtros»: ajusta curso, trimestre o fechas y pulsa «Guardar estos filtros en él».",
  },
  eliminar: {
    title: "Eliminar reporte",
    lead: "Elimina informes guardados que ya no necesitas. Solo se borra el informe guardado; las calificaciones y la asistencia no cambian.",
  },
} as const;

/** Ventanas de informes guardados: consultar, editar parámetros y eliminar. */
export async function SavedReportsPage({
  mode,
}: {
  mode: "consultar" | "editar" | "eliminar";
}) {
  const model = await loadPanel();
  const { available, reports } = await loadSavedReports();
  return (
    <PanelShell model={model} current="informes">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs text-muted-foreground">
            Informes y reportes
          </p>
          <PageTitle fallback={copy[mode].title} />
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            {copy[mode].lead}
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/panel/informes">Generar informe/reporte</Link>
        </Button>
      </div>
      <Card className="p-5">
        {available ? (
          <SavedReportList reports={reports} mode={mode} />
        ) : (
          <p className="text-sm text-muted-foreground">
            Para guardar y administrar informes, ejecuta una vez en Supabase el
            archivo supabase/migrations/202611270001_ampliacion_modulos.sql.
          </p>
        )}
      </Card>
    </PanelShell>
  );
}
