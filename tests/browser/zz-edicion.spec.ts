import { test, expect, type Page } from "@playwright/test";
// Se ejecuta al final (workers: 1, orden alfabético): usa las jornadas y
// calificaciones que registran las pruebas de asistencia y calificaciones.
async function login(page: Page) {
  await page.goto("/login");
  await page.getByLabel("Correo electrónico").fill("director@example.invalid");
  await page
    .getByLabel("Contraseña", { exact: true })
    .fill("ContraseñaFicticia!");
  await page
    .getByRole("button", { name: "Iniciar sesión", exact: true })
    .click();
  await expect(page).toHaveURL(/\/panel$/);
}

test("edición: las planillas registradas se listan, filtran y reabren", async ({
  page,
}) => {
  await login(page);
  for (const [path, target] of [
    [
      "/panel/asistencia/editar",
      /\/panel\/asistencia\/registro\?curso=.+&fecha=\d{4}-\d{2}-\d{2}/,
    ],
    [
      "/panel/calificaciones/editar",
      /\/panel\/calificaciones\/registro\?asignacion=.+&trimestre=.+/,
    ],
  ] as const) {
    await page.goto(path);
    const edit = page.getByRole("link", { name: "Editar", exact: true });
    test.skip(
      (await edit.count()) === 0,
      "Ejecutar junto con las pruebas de asistencia y calificaciones.",
    );
    const status = page.getByRole("combobox", { name: "Filtrar por Estado" });
    if (await status.count()) {
      await status.selectOption({ index: 1 });
      await expect(edit.first()).toBeVisible();
      await page.getByRole("button", { name: "Limpiar filtros" }).click();
    }
    await edit.first().click();
    await expect(page).toHaveURL(target);
  }
});

test("docentes: carga académica y horario muestran las clases asignadas", async ({
  page,
}) => {
  await login(page);
  await page.goto("/panel/docentes");
  await expect(
    page.getByRole("heading", { name: "Consultar docentes." }),
  ).toBeVisible();
  await page.goto("/panel/docentes/carga");
  const rows = page.locator("tbody tr");
  test.skip(
    (await rows.count()) === 0,
    "Ejecutar junto con las pruebas que asignan materias.",
  );
  await page.goto("/panel/docentes/horario");
  const select = page.getByLabel("Docente");
  const options = await select
    .locator("option")
    .evaluateAll((o) =>
      o.map((x) => (x as HTMLOptionElement).value).filter(Boolean),
    );
  let found = false;
  for (const value of options) {
    await select.selectOption(value);
    await page.getByRole("button", { name: "Ver horario" }).click();
    await page.waitForURL(/docente=/);
    if (
      (await page.getByText("periodos por semana").textContent())?.match(
        /^[1-9]/,
      )
    ) {
      found = true;
      await expect(page.locator("tbody td div").first()).toBeVisible();
      break;
    }
  }
  expect(found, "algún docente debe tener clases en el horario").toBe(true);
});
