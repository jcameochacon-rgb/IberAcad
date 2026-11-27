import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { loadPanel } from "@/lib/data/live";
import { PanelShell } from "@/components/panel-shell";
import { PageTitle } from "@/components/page-title";
import { DraftDelete, type DraftRow } from "@/components/draft-delete";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/** Ventana "Eliminar borradores" de asistencia o calificaciones. */
export async function DraftsPage({
  tipo,
}: {
  tipo: "asistencia" | "calificaciones";
}) {
  const { profile } = await requireProfile();
  const model = await loadPanel();
  const allowed = ["DIRECTOR", "SECRETARIA", "DOCENTE"].includes(profile.rol);
  const listing = model.listings[tipo];
  // Asistencia: la jornada en BORRADOR; calificaciones: su estado de publicación.
  const rows: DraftRow[] = listing.rows
    .filter((r) =>
      tipo === "asistencia"
        ? r.cells.status === "BORRADOR"
        : r.cells.publication === "BORRADOR",
    )
    .map((r) => ({
      id: r.id,
      cells: Object.fromEntries(
        Object.entries(r.cells).map(([k, v]) => [
          k,
          v == null ? "" : String(v),
        ]),
      ),
    }));
  const columns = listing.columns.filter(
    (c) => !(tipo === "asistencia" && c.key === "status"),
  );
  const register =
    tipo === "asistencia"
      ? "/panel/asistencia/registro"
      : "/panel/calificaciones/registro";
  return (
    <PanelShell model={model} current={tipo}>
      <div className="mb-7">
        <p className="mb-2 text-xs text-muted-foreground">
          {tipo === "asistencia"
            ? "Control de asistencia"
            : "Gestión de calificaciones"}
        </p>
        <PageTitle fallback="Eliminar borradores" />
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          Solo se pueden eliminar registros en borrador de tus cursos y
          materias. Si ya está publicado, despublícalo primero desde{" "}
          <Link
            href={register}
            className="text-primary underline-offset-4 hover:underline"
          >
            {tipo === "asistencia" ? "Pasar lista" : "Registrar notas"}
          </Link>
          .
        </p>
      </div>
      {allowed ? (
        <Card className="overflow-hidden">
          <DraftDelete tipo={tipo} rows={rows} columns={columns} />
        </Card>
      ) : (
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">
            Tu cuenta puede consultar la información, pero no eliminar
            registros.
          </p>
          <Button asChild variant="outline" className="mt-4">
            <Link href={`/panel/${tipo}`}>Volver a la consulta</Link>
          </Button>
        </Card>
      )}
    </PanelShell>
  );
}
