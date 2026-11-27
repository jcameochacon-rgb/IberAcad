import { describe, it, expect, vi } from "vitest";
vi.mock("server-only", () => ({}));
vi.mock("@/lib/auth", () => ({ requireProfile: vi.fn() }));
import { readAll } from "./live";
describe("consulta completa con permisos de sesión", () => {
  it("recupera registros después de la primera página de PostgREST", async () => {
    const data = Array.from({ length: 1205 }, (_, id) => ({ id }));
    const query = {
      range: vi.fn((from: number, to: number) =>
        Promise.resolve({ data: data.slice(from, to + 1), error: null }),
      ),
    };
    const result = await readAll(query);
    expect(result.data).toHaveLength(1205);
    expect(result.data[1204].id).toBe(1204);
    expect(query.range.mock.calls).toEqual([
      [0, 499],
      [500, 999],
      [1000, 1499],
    ]);
  });
  it("no presenta resultados parciales como completos ante un fallo", async () => {
    const query = {
      range: vi
        .fn()
        .mockResolvedValueOnce({
          data: Array(500).fill({ id: 1 }),
          error: null,
        })
        .mockResolvedValueOnce({ data: null, error: { message: "failure" } }),
    };
    await expect(readAll(query)).rejects.toThrow("No se pudo consultar");
  });
  it("rechaza explícitamente una lista excesiva", async () => {
    const query = {
      range: vi
        .fn()
        .mockResolvedValue({ data: Array(500).fill({ id: 1 }), error: null }),
    };
    await expect(readAll(query)).rejects.toThrow("10.000");
  });
});
