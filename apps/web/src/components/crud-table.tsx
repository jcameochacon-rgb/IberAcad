"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { TableToolbar } from "./table-toolbar";
export type CrudRow = {
  id: string;
  name: string;
  detail: string;
  status: string;
  info?: Record<string, string>;
  category?: string;
  href?: string;
};
export function CrudTable({
  rows,
  base,
  action = "consultar",
  idKey = "id",
}: {
  rows: CrudRow[];
  base: string;
  action?: string;
  idKey?: string;
}) {
  const [q, setQ] = useState(""),
    [status, setStatus] = useState(""),
    [category, setCategory] = useState(""),
    [sort, setSort] = useState("asc"),
    [page, setPage] = useState(0);
  const normalize = (value: string) =>
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase("es")
      .trim();
  const columns = Array.from(
    new Set(rows.flatMap((r) => Object.keys(r.info || {}))),
  );
  const categories = Array.from(
    new Set(rows.map((r) => r.category).filter((v): v is string => Boolean(v))),
  );
  const visible = useMemo(
    () =>
      rows
        .filter(
          (r) =>
            (!status || r.status === status) &&
            (!category || r.category === category) &&
            normalize(q)
              .split(/\s+/)
              .every((token) =>
                normalize(
                  `${r.name} ${r.detail} ${Object.values(r.info || {}).join(" ")}`,
                ).includes(token),
              ),
        )
        .sort(
          (a, b) =>
            (sort === "asc" ? 1 : -1) * a.name.localeCompare(b.name, "es"),
        ),
    [rows, q, status, category, sort],
  );
  const pages = Math.max(1, Math.ceil(visible.length / 12));
  const current = Math.min(page, pages - 1);
  return (
    <div className="crud-surface">
      <TableToolbar
        title="registros"
        count={visible.length}
        filters={{
          search: q,
          values: { status, category },
          sort,
          from: "",
          to: "",
          min: "",
          max: "",
        }}
        options={[
          {
            key: "status",
            label: "Estado",
            options: Array.from(new Set(rows.map((r) => r.status))),
          },
          ...(categories.length
            ? [
                {
                  key: "category",
                  label: "Rol / categoría",
                  options: categories,
                },
              ]
            : []),
        ]}
        onChange={(f) => {
          setQ(f.search);
          setStatus(f.values.status || "");
          setCategory(f.values.category || "");
          setSort(f.sort === "desc" ? "desc" : "asc");
          setPage(0);
        }}
      />
      {visible.length ? (
        <div className="crud-table-wrap">
          <table className="crud-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Detalle</th>
                {columns.map((c) => (
                  <th key={c}>{c}</th>
                ))}
                <th>Estado</th>
                {action !== "consultar" && <th>Acción</th>}
              </tr>
            </thead>
            <tbody>
              {visible.slice(current * 12, current * 12 + 12).map((r) => (
                <tr key={r.id}>
                  <td className="font-medium">
                    {r.href ? (
                      <Link
                        href={r.href}
                        className="text-blue-700 underline-offset-4 hover:underline"
                      >
                        {r.name}
                      </Link>
                    ) : (
                      r.name
                    )}
                  </td>
                  <td className="text-slate-500">{r.detail}</td>
                  {columns.map((c) => (
                    <td key={c}>{r.info?.[c] || "—"}</td>
                  ))}
                  <td>
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700">
                      {r.status}
                    </span>
                  </td>
                  {action !== "consultar" && (
                    <td>
                      <Link
                        className="crud-row-action"
                        href={`${base}${base.includes("?") ? "&" : "?"}accion=${action}&${idKey}=${encodeURIComponent(r.id)}`}
                      >
                        {action === "eliminar"
                          ? "Seleccionar para eliminar"
                          : "Editar"}
                      </Link>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="crud-empty">
          No hay registros que coincidan con tu búsqueda.
        </p>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3 p-5 text-sm text-slate-500">
        <span>
          {visible.length} registros · Página {current + 1} de {pages}
        </span>
        <div className="flex gap-2">
          <button
            className="crud-row-action disabled:opacity-40"
            disabled={!current}
            onClick={() => setPage(current - 1)}
          >
            Anterior
          </button>
          <button
            className="crud-row-action disabled:opacity-40"
            disabled={current + 1 >= pages}
            onClick={() => setPage(current + 1)}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
