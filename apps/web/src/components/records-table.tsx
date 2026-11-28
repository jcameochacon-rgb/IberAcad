"use client";
import { useMemo, useState } from "react";
import { FolderOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { TableToolbar, emptyTableFilters } from "./table-toolbar";
import { filterTableRows } from "@/lib/table-filters";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Listing } from "@/lib/data/model";
export function RecordsTable({
  listing,
  compact = false,
  showToolbar = true,
}: {
  listing: Listing;
  compact?: boolean;
  showToolbar?: boolean;
}) {
  const [filters, setFilters] = useState(emptyTableFilters);
  const [page, setPage] = useState(0);
  const filtered = useMemo(
    () => filterTableRows(listing.rows, filters),
    [listing.rows, filters],
  );
  const filterKeys = [
    "course",
    "subject",
    "term",
    "status",
    "state",
    "publication",
    "day",
    "period",
    "teacher",
    "materia",
    "situacion",
  ];
  const options = listing.columns
    .filter((c) => filterKeys.includes(c.key))
    .map((c) => ({
      ...c,
      options: Array.from(
        new Set(
          listing.rows.map((r) => String(r.cells[c.key] ?? "")).filter(Boolean),
        ),
      ).sort((a, b) => a.localeCompare(b, "es", { numeric: true })),
    }));
  const searching = !!(
    filters.search ||
    filters.from ||
    filters.to ||
    filters.min ||
    filters.max ||
    Object.values(filters.values).some(Boolean)
  );
  const size = compact ? 5 : 10;
  const pages = Math.max(1, Math.ceil(filtered.length / size));
  const current = Math.min(page, pages - 1);
  const rows = filtered.slice(current * size, (current + 1) * size);
  return (
    <div>
      {!compact && showToolbar && (
        <TableToolbar
          title={listing.title}
          filters={filters}
          options={options}
          dates={listing.columns.some((c) => c.key === "date")}
          grades={listing.columns.some(
            (c) => c.key === "grade" && c.label.includes("Nota"),
          )}
          count={filtered.length}
          onChange={(value) => {
            setFilters(value);
            setPage(0);
          }}
        />
      )}
      {rows.length ? (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">{listing.title}</caption>
              <thead className="bg-[#f9fbfb] text-[11px] text-muted-foreground">
                <tr>
                  {listing.columns.map((col) => (
                    <th
                      className="whitespace-nowrap px-5 py-3.5 font-medium"
                      key={col.key}
                      scope="col"
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    className="border-t border-border hover:bg-muted/30"
                    key={row.id}
                  >
                    {listing.columns.map((col, i) => (
                      <td
                        key={col.key}
                        className={cn(
                          "min-w-28 px-5 py-4 text-sm",
                          i === 0
                            ? "font-semibold text-foreground"
                            : "text-muted-foreground",
                        )}
                      >
                        {col.key === "status" ? (
                          <Badge
                            className={cn(
                              row.tone === "success"
                                ? "bg-emerald-50 text-emerald-700"
                                : row.tone === "danger"
                                  ? "bg-red-50 text-red-700"
                                  : "bg-amber-50 text-amber-800",
                            )}
                          >
                            {row.cells[col.key] || "Pendiente"}
                          </Badge>
                        ) : (
                          (row.cells[col.key] ?? "—")
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!compact && (
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-3.5 text-xs text-muted-foreground">
              <p>
                {filtered.length} resultados de {listing.rows.length} registros
                {listing.total > listing.rows.length
                  ? ` · Se muestran los últimos ${listing.rows.length} de ${listing.total}`
                  : ""}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Página anterior"
                  disabled={current === 0}
                  onClick={() => setPage(current - 1)}
                >
                  <ChevronLeft size={16} />
                </Button>
                <span>
                  {current + 1} / {pages}
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Página siguiente"
                  disabled={current + 1 >= pages}
                  onClick={() => setPage(current + 1)}
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="flex min-h-48 flex-col items-center justify-center px-6 py-10 text-center">
          <FolderOpen className="mb-3 text-muted-foreground/60" size={28} />
          <p className="text-sm font-semibold">
            {searching
              ? "No encontramos coincidencias"
              : "Aún no hay registros disponibles"}
          </p>
          <p className="mt-2 max-w-sm text-xs leading-5 text-muted-foreground">
            {searching
              ? "Prueba con otro nombre o dato."
              : "La información aparecerá cuando se registre y esté disponible para tu rol."}
          </p>
        </div>
      )}
    </div>
  );
}
