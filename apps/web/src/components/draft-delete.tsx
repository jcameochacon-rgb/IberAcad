"use client";
import { useActionState, useMemo, useState } from "react";
import { LoaderCircle, Trash2 } from "lucide-react";
import {
  deleteDraft,
  type DraftDeleteState,
} from "@/app/panel/borradores-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type DraftRow = { id: string; cells: Record<string, string> };

/** Lista de borradores con filtros y eliminación con confirmación. */
export function DraftDelete({
  tipo,
  rows,
  columns,
}: {
  tipo: "asistencia" | "calificaciones";
  rows: DraftRow[];
  columns: { key: string; label: string; filter?: boolean }[];
}) {
  const [state, action, pending] = useActionState(
    deleteDraft,
    {} as DraftDeleteState,
  );
  const [confirming, setConfirming] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [removed, setRemoved] = useState<string[]>([]);
  if (state.deleted && !removed.includes(state.deleted))
    setRemoved([...removed, state.deleted]);
  const visible = rows.filter((r) => !removed.includes(r.id));
  const filters = useMemo(
    () =>
      columns
        .filter((c) => c.filter)
        .map((c) => ({
          ...c,
          values: [
            ...new Set(rows.map((r) => r.cells[c.key]).filter(Boolean)),
          ].sort((a, b) => a.localeCompare(b, "es", { numeric: true })),
        }))
        .filter((c) => c.values.length > 1),
    [columns, rows],
  );
  const shown = visible.filter(
    (r) =>
      Object.entries(selected).every(([k, v]) => !v || r.cells[k] === v) &&
      Object.values(r.cells)
        .join(" ")
        .toLocaleLowerCase("es")
        .includes(search.toLocaleLowerCase("es")),
  );
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 border-b border-border p-5">
        <Input
          aria-label="Buscar borradores"
          placeholder="Buscar estudiante…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-11 max-w-xs"
        />
        {filters.map((f) => (
          <select
            key={f.key}
            aria-label={`Filtrar por ${f.label}`}
            value={selected[f.key] ?? ""}
            onChange={(e) =>
              setSelected((prev) => ({ ...prev, [f.key]: e.target.value }))
            }
            className="h-11 rounded-lg border border-input bg-background px-3 text-sm"
          >
            <option value="">{f.label}: todos</option>
            {f.values.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        ))}
        <span className="ml-auto text-xs text-muted-foreground">
          {shown.length} de {visible.length} borradores
        </span>
      </div>
      {state.error && (
        <p
          role="alert"
          className="m-5 rounded-lg bg-red-50 p-3 text-sm text-red-700"
        >
          {state.error}
        </p>
      )}
      {state.deleted && (
        <p
          role="status"
          className="m-5 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800"
        >
          Borrador eliminado. Los demás registros se conservan.
        </p>
      )}
      {shown.length ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted text-xs text-muted-foreground">
              <tr>
                {columns.map((c) => (
                  <th
                    key={c.key}
                    scope="col"
                    className="whitespace-nowrap px-5 py-3 font-medium"
                  >
                    {c.label}
                  </th>
                ))}
                <th scope="col" className="px-5 py-3 text-right">
                  Acción
                </th>
              </tr>
            </thead>
            <tbody>
              {shown.map((r) => (
                <tr key={r.id} className="border-t border-border">
                  {columns.map((c) => (
                    <td
                      key={c.key}
                      className="whitespace-nowrap px-5 py-3 text-xs"
                    >
                      {r.cells[c.key] || "—"}
                    </td>
                  ))}
                  <td className="px-5 py-3 text-right">
                    {confirming === r.id ? (
                      <form action={action} className="inline-flex gap-2">
                        <input type="hidden" name="tipo" value={tipo} />
                        <input type="hidden" name="id" value={r.id} />
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={pending}
                        >
                          {pending ? (
                            <LoaderCircle size={14} className="animate-spin" />
                          ) : (
                            <Trash2 size={14} />
                          )}
                          Confirmar
                        </Button>
                        <Button
                          size="sm"
                          type="button"
                          variant="ghost"
                          onClick={() => setConfirming("")}
                        >
                          Cancelar
                        </Button>
                      </form>
                    ) : (
                      <Button
                        size="sm"
                        type="button"
                        variant="outline"
                        onClick={() => setConfirming(r.id)}
                      >
                        <Trash2 size={14} />
                        Eliminar
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="px-6 py-10 text-center text-sm text-muted-foreground">
          {visible.length
            ? "No hay borradores con esos filtros."
            : "No hay borradores para eliminar. Los registros publicados se despublican primero desde su registro."}
        </p>
      )}
    </div>
  );
}
