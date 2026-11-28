import { beforeEach, expect, it, vi } from "vitest";
const m = vi.hoisted(() => ({
  auth: vi.fn(),
  update: vi.fn(),
  upload: vi.fn(),
}));
vi.mock("@/lib/auth", () => ({ requireProfile: m.auth }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
import { saveProfile } from "./actions";
beforeEach(() => {
  vi.clearAllMocks();
  m.update.mockResolvedValue({ error: null });
  m.upload.mockResolvedValue({ error: null });
  m.auth.mockResolvedValue({
    user: { id: "own-id" },
    supabase: {
      auth: { updateUser: m.update },
      storage: { from: () => ({ upload: m.upload }) },
    },
  });
});
it("solo guarda contacto personal e ignora identidad, correo y rol enviados", async () => {
  const f = new FormData();
  f.set("telefono", "74075453");
  f.set("rol", "DIRECTOR");
  f.set("email", "otra@example.invalid");
  f.set("id", "otra-cuenta");
  expect(await saveProfile("", f)).toBe("Perfil actualizado.");
  expect(m.update).toHaveBeenCalledWith({
    data: { contacto_personal: { telefono: "74075453", direccion: "" } },
  });
});
it("rechaza un archivo que finge ser JPEG", async () => {
  const f = new FormData();
  f.set("foto", new File(["<svg/>"], "foto.jpg", { type: "image/jpeg" }));
  expect(await saveProfile("", f)).toContain("no es válida");
  expect(m.upload).not.toHaveBeenCalled();
  expect(m.update).not.toHaveBeenCalled();
});
it("si falla almacenamiento no anuncia que se guardó la foto", async () => {
  m.upload.mockResolvedValue({ error: { message: "bucket missing" } });
  const f = new FormData();
  f.set(
    "foto",
    new File([new Uint8Array([255, 216, 255, 1])], "foto.jpg", {
      type: "image/jpeg",
    }),
  );
  expect(await saveProfile("", f)).toContain("No se pudo guardar");
  expect(m.upload).toHaveBeenCalledWith(
    "own-id/avatar.jpg",
    expect.any(Uint8Array),
    expect.objectContaining({ upsert: true }),
  );
  expect(m.update).not.toHaveBeenCalled();
});
