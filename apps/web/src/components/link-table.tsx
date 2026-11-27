"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type LinkRow = {
  id: string;
  cells: Record<string, string>;
  href?: string;
};

/**
 * Tabla con buscador y filtros desplegables por columna. Cada fila puede
 * llevar un enlace de acción (por ejemplo, abrir la planilla para editarla).
 */
export function LinkTable({
  columns,
  rows,
  action,
  searchLabel = "Buscar…",
  empty,
}: {
  columns: { key: string; label: string; filter?: boolean }[];
  rows: LinkRow[];
  action?: string;
  searchLabel?: string;
  empty: string;
}) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Record<string, string>>({});
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
  const shown = rows.filter(
    (r) =>
      Object.entries(selected).every(([k, v]) => !v || r.cells[k] === v) &&
      Object.values(r.cells)
        .join(" ")
        .toLocaleLowerCase("es")
        .includes(search.toLocaleLowerCase("es")),
  );
  const active = search || Object.values(selected).some(Boolean);
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 border-b border-border p-5">
        <Input
          aria-label="Buscar"
          placeholder={searchLabel}
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
            className={`h-11 rounded-lg border bg-background px-3 text-sm ${
              selected[f.key] ? "border-primary text-primary" : "border-input"
            }`}
          >
            <option value="">{f.label}: todos</option>
            {f.values.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        ))}
        {active && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearch("");
              setSelected({});
            }}
          >
            Limpiar filtros
          </Button>
        )}
        <span className="ml-auto text-xs text-muted-foreground">
          {shown.length} de {rows.length} registros
        </span>
      </div>
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
                {action && (
                  <th scope="col" className="px-5 py-3 text-right">
                    Acción
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {shown.map((r) => (
                <tr key={r.id} className="border-t border-border">
                  {columns.map((c, i) => (
                    <td
                      key={c.key}
                      className={`px-5 py-3 text-xs ${i === 0 ? "font-semibold" : ""}`}
                    >
                      {r.cells[c.key] || "—"}
                    </td>
                  ))}
                  {action && (
                    <td className="px-5 py-3 text-right">
                      {r.href && (
                        <Button asChild size="sm" variant="outline">
                          <Link href={r.href}>{action}</Link>
                        </Button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="px-6 py-10 text-center text-sm text-muted-foreground">
          {rows.length ? "No hay registros con esos filtros." : empty}
        </p>
      )}
    </div>
  );
}
