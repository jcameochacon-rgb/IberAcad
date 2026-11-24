import { test, expect } from "@playwright/test";

test("diseño: portada, login y panel adaptables con movimiento reducido", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of ["/", "/login", "/demo"]) {
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

test("diseño: las secciones aparecen al desplazarse y los enlaces siguen funcionando", async ({
  page,
}) => {
  await page.goto("/");
  const gallery = page.locator("#galeria");
  await gallery.scrollIntoViewIfNeeded();
  await expect(gallery).toHaveCSS("opacity", "1");
  await expect(gallery.getByRole("link")).toHaveCount(3);
  await page.locator("#contacto").scrollIntoViewIfNeeded();
  await expect(page.locator("#contacto")).toHaveCSS("opacity", "1");
  await page.getByRole("link", { name: "Ingresar con mi cuenta" }).click();
  await expect(page).toHaveURL(/\/login$/);
});
