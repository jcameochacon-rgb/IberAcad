import { requireProfile } from "@/lib/auth";
import { canManage } from "@/lib/management-validation";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PanelShell } from "@/components/panel-shell";
import { loadPanel } from "@/lib/data/live";
import { OperationForm } from "@/components/operation-form";
import { CrudTable } from "@/components/crud-table";
import { unlinkChild } from "./actions";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { supabase, profile } = await requireProfile();
  if (!canManage(profile.rol)) notFound();
  const { data, error } = await supabase
    .from("estudiante_tutor")
    .select(
      "estudiante_id,tutor_id,parentesco,estudiantes(personas(nombres,apellido_paterno,apellido_materno)),tutores(personas(nombres,apellido_paterno,apellido_materno))",
    );
  if (error) throw Error("No se pudieron consultar los vínculos.");
  const params = await searchParams;
  const key = (r: NonNullable<typeof data>[number]) =>
    `${r.estudiante_id}:${r.tutor_id}`;
  const fullName = (
    p:
      | {
          nombres: string;
          apellido_paterno: string | null;
          apellido_materno: string | null;
        }
      | null
      | undefined,
  ) =>
    p
      ? [p.nombres, p.apellido_paterno, p.apellido_materno]
          .filter(Boolean)
          .join(" ")
      : "Ficha no disponible";
  const selected = data?.find((r) => key(r) === params.vinculo);
  return (
    <PanelShell model={await loadPanel()}>
      <h1 className="mb-5 text-3xl font-semibold">Desvincular hijo</h1>
      <p className="mb-6 text-slate-600">
        Busca por estudiante o tutor y revisa el vínculo antes de retirarlo. Las
        fichas y el historial académico se conservan.
      </p>
      {selected ? (
        <>
          <Link
            className="mb-5 inline-block text-blue-700"
            href="/panel/vinculacion?accion=eliminar"
          >
            Volver a la búsqueda
          </Link>
          <OperationForm
            action={unlinkChild}
            label="Confirmar desvinculación"
            danger
            confirmMessage="¿Retirar este vínculo familiar? El tutor dejará de consultar la información de este estudiante."
          >
            <h2 className="text-xl font-semibold">
              {fullName(selected.estudiantes?.personas)}
            </h2>
            <p>
              Tutor: {fullName(selected.tutores?.personas)} ·{" "}
              {selected.parentesco}
            </p>
            <input
              type="hidden"
              name="estudiante"
              value={selected.estudiante_id}
            />
            <input type="hidden" name="tutor" value={selected.tutor_id} />
          </OperationForm>
        </>
      ) : (
        <CrudTable
          action="eliminar"
          deleteLabel="Revisar vínculo"
          base="/panel/vinculacion"
          idKey="vinculo"
          rows={(data || []).map((r) => ({
            id: key(r),
            name: fullName(r.estudiantes?.personas),
            detail: fullName(r.tutores?.personas),
            status: "Vinculado",
            category: r.parentesco,
            info: {
              Tutor: fullName(r.tutores?.personas),
              Parentesco: r.parentesco,
            },
          }))}
        />
      )}
    </PanelShell>
  );
}
