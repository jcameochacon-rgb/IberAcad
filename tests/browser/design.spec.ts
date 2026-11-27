import { test, expect } from "@playwright/test";

test("diseño: portada, login y panel adaptables con movimiento reducido", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of [
      "/",
      "/el-colegio",
      "/galeria",
      "/historia",
      "/contacto",
      "/login",
      "/demo",
    ]) {
      await page.goto(route);
      await expect(page.locator("main")).toBeVisible();
      await expect
        .poll(() =>
          page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        )
        .toBe(true);
      if (width !== 320)
        await page.screenshot({
          path: `docs/preview/diseno-${route === "/" ? "portada" : route.slice(1)}-${width}.png`,
          fullPage: true,
          animations: "disabled",
          style: "nextjs-portal { display:none; }",
        });
    }
  }
});

test("diseño: las ventanas públicas cargan y los enlaces siguen funcionando", async ({
  page,
}) => {
  await page.goto("/galeria");
  await expect(
    page.locator("main section.texture-dots").getByRole("link"),
  ).toHaveCount(3);
  await page
    .getByRole("banner")
    .getByRole("link", { name: "Iniciar sesión" })
    .click();
  await expect(page).toHaveURL(/\/login$/);
});
