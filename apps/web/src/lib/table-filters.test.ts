import { describe, it, expect } from "vitest";
import { filterTableRows, type TableFilters } from "./table-filters";
const empty: TableFilters = {
  search: "",
  values: {},
  from: "",
  to: "",
  min: "",
  max: "",
  sort: "original",
};
const rows = [
  {
    id: "a",
    date: "2026-02-01",
    cells: {
      student: "María Pérez",
      ci: "123",
      course: "1° A",
      term: "1°",
      status: "APROBADO",
      grade: 78,
    },
  },
  {
    id: "b",
    date: "2026-03-03",
    cells: {
      student: "Mario Pérez",
      ci: "456",
      course: "2° B",
      term: "2°",
      status: "PENDIENTE",
      grade: null,
    },
  },
  {
    id: "c",
    date: "2026-03-10",
    cells: {
      student: "Ana Soto",
      ci: "789",
      course: "1° A",
      term: "1°",
      status: "REPROBADO",
      grade: 40,
    },
  },
];
describe("filtros académicos", () => {
  it("combina palabras sin tildes y CI", () =>
    expect(
      filterTableRows(rows, { ...empty, search: "perez MARIA 123" }).map(
        (r) => r.id,
      ),
    ).toEqual(["a"]));
  it("combina curso, trimestre y nota sin tratar un pendiente como cero", () =>
    expect(
      filterTableRows(rows, {
        ...empty,
        values: { course: "1° A", term: "1°" },
        min: "0",
        max: "50",
      }).map((r) => r.id),
    ).toEqual(["c"]));
  it("incluye ambos extremos de fecha y ordena sin mutar el origen", () => {
    expect(
      filterTableRows(rows, {
        ...empty,
        from: "2026-03-03",
        to: "2026-03-10",
        sort: "recent",
      }).map((r) => r.id),
    ).toEqual(["c", "b"]);
    expect(rows[0].id).toBe("a");
  });
  it("un filtro sin coincidencias no devuelve el listado completo", () =>
    expect(
      filterTableRows(rows, { ...empty, values: { course: "6° C" } }),
    ).toEqual([]));
  it("limpiar restituye todos los registros", () =>
    expect(filterTableRows(rows, empty)).toHaveLength(3));
});
