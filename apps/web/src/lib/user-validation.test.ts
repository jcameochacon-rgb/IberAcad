import { describe, expect, it } from "vitest";
import { readUserForm, validateUser, fold } from "./user-validation";

const form = (o: Record<string, string>) => {
  const f = new FormData();
  Object.entries(o).forEach(([k, v]) => f.set(k, v));
  return f;
};
const base = {
  email: "Ana@Colegio.Edu",
  rol: "DOCENTE",
  nombres: "Ana",
  apellido_paterno: "Quispe",
};
describe("validación de usuarios", () => {
  it("normaliza el correo y acepta datos completos", () => {
    const v = readUserForm(form(base));
    expect(v.email).toBe("ana@colegio.edu");
    expect(validateUser(v, { needsEmail: true })).toBeNull();
  });
  it("rechaza correo, rol o apellidos faltantes", () => {
    expect(
      validateUser(readUserForm(form({ ...base, email: "x" })), {
        needsEmail: true,
      }),
    ).toMatch(/correo/);
    expect(
      validateUser(readUserForm(form({ ...base, rol: "ADMIN" })), {
        needsEmail: false,
      }),
    ).toMatch(/rol/);
    expect(
      validateUser(readUserForm(form({ ...base, apellido_paterno: "" })), {
        needsEmail: false,
      }),
    ).toMatch(/apellido/);
  });
  it("busca sin tildes ni mayúsculas", () => {
    expect(fold("Peña ÁLVAREZ")).toBe("pena alvarez");
  });
});
