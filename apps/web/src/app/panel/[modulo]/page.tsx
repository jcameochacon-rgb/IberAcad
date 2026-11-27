import { notFound } from "next/navigation";
import { isModule } from "@iberdrola/shared";
import { ModulePage } from "@/components/module-page";
import { loadPanel } from "@/lib/data/live";
import { requireProfile } from "@/lib/auth";
import { uuidPattern } from "@/lib/management-validation";
export default async function Module({
  params,
  searchParams,
}: {
  params: Promise<{ modulo: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { modulo } = await params;
  if (!isModule(modulo)) notFound();
  const query = await searchParams;
  const year =
    typeof query.gestion === "string" && uuidPattern.test(query.gestion)
      ? query.gestion
      : undefined;
  const { supabase } = await requireProfile();
  const years = await supabase
    .from("gestiones")
    .select("id,anio")
    .order("anio", { ascending: false });
  if (years.error) throw Error("No se pudieron cargar las gestiones.");
  return (
    <ModulePage
      model={await loadPanel({ complete: modulo, year })}
      module={modulo}
      years={years.data || []}
      selectedYear={year}
    />
  );
}
