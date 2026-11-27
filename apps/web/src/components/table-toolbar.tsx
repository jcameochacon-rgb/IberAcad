"use client";
import { Search, SlidersHorizontal, X, ArrowDownUp } from "lucide-react";
import type { TableFilters } from "@/lib/table-filters";
export const emptyTableFilters: TableFilters = {
  search: "",
  values: {},
  from: "",
  to: "",
  min: "",
  max: "",
  sort: "original",
};
export type FilterOption = { key: string; label: string; options: string[] };
export function TableToolbar({
  title,
  filters,
  onChange,
  options = [],
  dates = false,
  grades = false,
  count,
}: {
  title: string;
  filters: TableFilters;
  onChange: (value: TableFilters) => void;
  options?: FilterOption[];
  dates?: boolean;
  grades?: boolean;
  count: number;
}) {
  const active =
    Object.values(filters.values).filter(Boolean).length +
    [filters.search, filters.from, filters.to, filters.min, filters.max].filter(
      Boolean,
    ).length;
  const update = (patch: Partial<TableFilters>) =>
    onChange({ ...filters, ...patch });
  return (
    <div className="query-toolbar">
      <div className="query-toolbar-heading">
        <span>
          <SlidersHorizontal size={16} />
          Buscar y filtrar
        </span>
        <span aria-live="polite">{count} {count === 1 ? "resultado" : "resultados"}</span>
      </div>
      <div className="query-toolbar-top">
        <label className="query-search">
          <span className="sr-only">Buscar en {title}</span>
          <Search size={18} aria-hidden="true" />
          <input
            type="search"
            placeholder={title === "horario" ? "Buscar asignatura o docente…" : title === "lista del curso" ? "Buscar estudiante por nombre…" : "Buscar en los registros…"}
            value={filters.search}
            onChange={(e) => update({ search: e.target.value })}
          />
        </label>
        <label className="query-sort">
          <ArrowDownUp size={16} aria-hidden="true" />
          <span className="sr-only">Ordenar resultados</span>
          <select
            value={filters.sort}
            onChange={(e) => update({ sort: e.target.value })}
          >
            <option value="original">Orden original</option>
            <option value="asc">Nombre: A–Z</option>
            <option value="desc">Nombre: Z–A</option>
            {dates && (
              <>
                <option value="recent">Fecha: recientes primero</option>
                <option value="oldest">Fecha: antiguas primero</option>
              </>
            )}
          </select>
        </label>
      </div>
      <div className="query-filter-grid">
        {options.map((filter) => (
          <label key={filter.key}>
            {filter.label}
            <select
              value={filters.values[filter.key] || ""}
              onChange={(e) =>
                update({
                  values: { ...filters.values, [filter.key]: e.target.value },
                })
              }
            >
              <option value="">Todos</option>
              {filter.options.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
        ))}
        {dates && (
          <>
            <label>
              Desde
              <input
                type="date"
                value={filters.from}
                max={filters.to || undefined}
                onChange={(e) => update({ from: e.target.value })}
              />
            </label>
            <label>
              Hasta
              <input
                type="date"
                value={filters.to}
                min={filters.from || undefined}
                onChange={(e) => update({ to: e.target.value })}
              />
            </label>
          </>
        )}
        {grades && (
          <>
            <label>
              Nota mínima
              <input
                type="number"
                min="0"
                max="100"
                placeholder="0"
                value={filters.min}
                onChange={(e) => update({ min: e.target.value })}
              />
            </label>
            <label>
              Nota máxima
              <input
                type="number"
                min="0"
                max="100"
                placeholder="100"
                value={filters.max}
                onChange={(e) => update({ max: e.target.value })}
              />
            </label>
          </>
        )}
      </div>
      {!!active && (
        <button
          type="button"
          className="query-reset"
          onClick={() => onChange(emptyTableFilters)}
        >
          <X size={14} />
          Limpiar filtros <span>{active}</span>
        </button>
      )}
    </div>
  );
}
