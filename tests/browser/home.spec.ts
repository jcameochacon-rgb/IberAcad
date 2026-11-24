import { test, expect } from "@playwright/test";
test("portada pública con fuentes, navegación y acceso al login sin consultar datos privados", async ({
  page,
}) => {
  const calls: string[] = [];
  page.on("request", (r) => {
    if (/\/rest\/v1|\/auth\/v1/.test(r.url())) calls.push(r.url());
  });
  await page.setViewportSize({ width: 1440, height: 1000 });
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Iberdrola A",
  );
  await expect(page.getByRole("main")).toContainText("40730423");
  await expect(page.getByRole("main")).toContainText("Plaza 16 de Febrero");
  await expect(page.getByRole("main")).toContainText("Inicial y Primaria");
  await expect(page.getByRole("main")).not.toContainText("385");
  await expect(
    page.getByRole("link", { name: "72576322", exact: true }),
  ).toHaveAttribute("href", "tel:+59172576322");
  await page
    .getByText("Fuentes de información y alcance", { exact: true })
    .click();
  await expect(
    page.getByRole("link", {
      name: "UnidadEducativa.net: ficha de Iberdrola A",
    }),
  ).toHaveAttribute("href", /40730423/);
  await expect(
    page.getByRole("link", { name: "Leer la reseña histórica" }),
  ).toHaveAttribute("href", /blogspot/);
  expect(calls).toEqual([]);
  const images = page.locator("main img, header img");
  await expect(images).toHaveCount(8);
  for (const img of await images.all()) {
    await img.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        img.evaluate(
          (element: HTMLImageElement) =>
            element.complete && element.naturalWidth > 0,
        ),
      )
      .toBe(true);
  }
  await page
    .getByText("Fuentes de información y alcance", { exact: true })
    .click();
  await page.evaluate(async () => {
    await document.fonts.ready;
    window.scrollTo(0, 0);
  });
  await page.screenshot({
    path: "docs/preview/portada-escritorio.png",
    fullPage: true,
    style: "nextjs-portal { display:none; }",
  });
  await page.getByRole("link", { name: "Iniciar sesión", exact: true }).click();
  await expect(page).toHaveURL(/\/login$/);
  await expect(
    page.getByRole("link", { name: "Volver a la página principal" }),
  ).toHaveCount(0);
});
test("portada móvil sin desbordamiento, anclas y enlaces utilizables", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator("body")).toHaveJSProperty("scrollWidth", 390);
  await page
    .getByRole("navigation", { name: "Navegación pública" })
    .getByRole("link", { name: "Contacto", exact: true })
    .click();
  await expect(page).toHaveURL(/#contacto$/);
  await expect(
    page.getByRole("heading", { name: "Estamos en El Alto." }),
  ).toBeInViewport();
  await page.evaluate(async () => {
    await document.fonts.ready;
    window.scrollTo(0, 0);
    await new Promise((r) =>
      requestAnimationFrame(() => requestAnimationFrame(r)),
    );
  });
  await page.screenshot({
    path: "docs/preview/portada-movil.png",
    fullPage: true,
    style: "nextjs-portal { display:none; }",
  });
  await page
    .getByRole("link", { name: "Ingresar al sistema", exact: true })
    .click();
  await expect(page).toHaveURL(/\/login$/);
});
