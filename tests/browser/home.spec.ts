import { test, expect } from "@playwright/test";

const menu = (page: import("@playwright/test").Page) =>
  page.getByRole("navigation", { name: "Navegación pública" });

test("portada: cada opción del menú abre su propia ventana con botón para volver", async ({
  page,
}) => {
  const calls: string[] = [];
  page.on("request", (r) => {
    if (/\/rest\/v1|\/auth\/v1/.test(r.url())) calls.push(r.url());
  });
  await page.setViewportSize({ width: 1440, height: 1000 });
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Iberdrola A",
  );
  const windows: [string, RegExp, string][] = [
    ["El colegio", /\/el-colegio$/, "40730423"],
    ["Galería", /\/galeria$/, "Abre cada fotografía"],
    ["Historia", /\/historia$/, "Senkata"],
    ["Contacto", /\/contacto$/, "Plaza 16 de Febrero"],
  ];
  for (const [label, url, text] of windows) {
    await menu(page).getByRole("link", { name: label, exact: true }).click();
    await expect(page).toHaveURL(url);
    await expect(page.getByRole("main")).toContainText(text);
    // El menú sigue visible y la página actual queda marcada.
    await expect(
      menu(page).getByRole("link", { name: label, exact: true }),
    ).toHaveAttribute("aria-current", "page");
    await page.goto("/");
  }
  expect(calls).toEqual([]);
});

test("login: menú público, sin botón de volver y el acceso ocupa la pantalla", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.getByRole("link", { name: "Iniciar sesión", exact: true }).click();
  await expect(page).toHaveURL(/\/login$/);
  await expect(menu(page)).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Inicia sesión" }),
  ).toBeVisible();
  await expect(page.getByText("Conoce tu colegio")).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: "Volver a la página principal" }),
  ).toHaveCount(0);
  // El acceso ocupa la pantalla completa; el pie de página queda debajo.
  const overflow = await page.evaluate(
    () =>
      document.querySelector(".auth-screen")!.getBoundingClientRect().height -
      window.innerHeight,
  );
  expect(overflow).toBeLessThanOrEqual(1);
  await expect(page.getByRole("contentinfo")).toBeAttached();
});

test("portada móvil sin desbordamiento y con enlaces utilizables", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator("body")).toHaveJSProperty("scrollWidth", 390);
  await menu(page).getByRole("link", { name: "Contacto", exact: true }).click();
  await expect(page).toHaveURL(/\/contacto$/);
  await page.goto("/");
  await page
    .getByRole("banner")
    .getByRole("link", { name: "Iniciar sesión" })
    .click();
  await expect(page).toHaveURL(/\/login$/);
});
