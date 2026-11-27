import type { TableRow } from "./data/model";
export const normalizeSearch = (value: unknown) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es")
    .trim();
export type TableFilters = {
  search: string;
  values: Record<string, string>;
  from: string;
  to: string;
  min: string;
  max: string;
  sort: string;
};
export function filterTableRows(rows: TableRow[], filters: TableFilters) {
  const tokens = normalizeSearch(filters.search).split(/\s+/).filter(Boolean);
  return rows
    .filter((row) => {
      const text = normalizeSearch(Object.values(row.cells).join(" "));
      if (!tokens.every((token) => text.includes(token))) return false;
      if (
        !Object.entries(filters.values).every(
          ([key, value]) => !value || String(row.cells[key] ?? "") === value,
        )
      )
        return false;
      if (
        (filters.from || filters.to) &&
        (!row.date ||
          (filters.from && row.date < filters.from) ||
          (filters.to && row.date > filters.to))
      )
        return false;
      if (filters.min || filters.max) {
        const n = row.cells.grade;
        if (n == null || n === "" || !Number.isFinite(Number(n))) return false;
        if (filters.min && Number(n) < Number(filters.min)) return false;
        if (filters.max && Number(n) > Number(filters.max)) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (filters.sort === "recent")
        return (b.date || "").localeCompare(a.date || "");
      if (filters.sort === "oldest")
        return (a.date || "").localeCompare(b.date || "");
      if (filters.sort === "original") return 0;
      const name = (r: TableRow) =>
        String(
          r.cells.student ??
            r.cells.name ??
            r.cells.course ??
            Object.values(r.cells)[0] ??
            "",
        );
      return (
        (filters.sort === "desc" ? -1 : 1) *
        name(a).localeCompare(name(b), "es", {
          numeric: true,
          sensitivity: "base",
        })
      );
    });
}
