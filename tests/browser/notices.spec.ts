import { test, expect, type Page } from "@playwright/test";
async function login(page: Page, email = "director@example.invalid") {
  await page.goto("/login");
  await page.getByLabel("Correo electrónico").fill(email);
  await page
    .getByLabel("Contraseña", { exact: true })
    .fill("ContraseñaFicticia!");
  await page
    .getByRole("button", { name: "Iniciar sesión", exact: true })
    .click();
  await expect(page).toHaveURL(/\/panel$/);
}
test("borrador, publicación institucional, familia y retiro", async ({
  page,
  browser,
}) => {
  await login(page);
  await page.goto("/panel/comunicados/bandeja?nuevo=1");
  await page
    .getByLabel("Título", { exact: true })
    .fill("Encuentro con familias");
  await page
    .getByLabel("Contenido", { exact: true })
    .fill("Aviso ficticio de prueba.\nRevisaremos las actividades del curso.");
  await page.getByLabel("Institucional:", { exact: false }).check();
  await page.getByRole("button", { name: "Guardar borrador" }).click();
  await expect(page.getByRole("status")).toContainText("Borrador guardado");
  const url = page.url().split("&resultado")[0];
  const family = await browser.newContext();
  const p = await family.newPage();
  await login(p, "padre@example.invalid");
  await p.goto(url);
  await expect(p.getByRole("main").getByRole("alert")).toContainText(
    "no está disponible",
  );
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Publicar comunicado" }).click();
  await expect(page.getByRole("status")).toContainText("Comunicado publicado");
  await p.reload();
  await expect(
    p
      .getByRole("heading", { name: "Encuentro con familias", exact: true })
      .first(),
  ).toBeVisible();
  await expect(
    p.getByRole("button", { name: "Retirar publicación" }),
  ).toHaveCount(0);
  await page.screenshot({
    path: "docs/preview/comunicados-escritorio.png",
    fullPage: true,
  });
  await p.setViewportSize({ width: 390, height: 844 });
  await p.screenshot({
    path: "docs/preview/comunicados-movil.png",
    fullPage: true,
    animations: "disabled",
  });
  expect(
    await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
  ).toBe(true);
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Retirar publicación" }).click();
  await expect(page.getByRole("status")).toContainText("Publicación retirada");
  await p.reload();
  await expect(p.getByRole("main").getByRole("alert")).toContainText(
    "no está disponible",
  );
  await family.close();
});
test("conflicto entre dos ediciones conserva el texto", async ({ page }) => {
  await login(page);
  await page.goto("/panel/comunicados/bandeja?nuevo=1");
  await page.getByLabel("Título", { exact: true }).fill("Borrador concurrente");
  await page.getByLabel("Contenido", { exact: true }).fill("Contenido inicial");
  await page.getByLabel("Institucional:", { exact: false }).check();
  await page.getByRole("button", { name: "Guardar borrador" }).click();
  await expect(page.getByRole("status")).toContainText("Borrador guardado");
  await page.getByRole("link", { name: "Editar borrador" }).click();
  await expect(page.getByLabel("Título", { exact: true })).toBeVisible();
  await page
    .getByLabel("Contenido", { exact: true })
    .fill("Texto que debo conservar");
  const other = await page.context().newPage();
  await other.goto(page.url());
  await other.getByLabel("Título", { exact: true }).fill("Cambio guardado");
  await other.getByRole("button", { name: "Guardar borrador" }).click();
  await expect(other.getByRole("status")).toContainText("Borrador guardado");
  await page.bringToFront();
  await page.getByRole("button", { name: "Guardar borrador" }).click();
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    "Otra persona",
  );
  await expect(page.getByLabel("Contenido", { exact: true })).toHaveValue(
    "Texto que debo conservar",
  );
  await other.close();
});
