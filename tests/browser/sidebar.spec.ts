import { test, expect } from "@playwright/test";

test("un acordeón principal abierto, CRUD y navegación conservada", async ({ page }) => {
  await page.goto("/demo?rol=DIRECTOR");
  const nav = page.getByRole("navigation", { name: "Módulos académicos" });
  const users = nav.getByRole("button", { name: "Gestión de usuarios", exact: true });
  const students = nav.getByRole("button", { name: "Registro de estudiantes", exact: true });
  await users.click();
  await expect(users).toHaveAttribute("aria-expanded", "true");
  await students.click();
  await expect(users).toHaveAttribute("aria-expanded", "false");
  await nav.getByRole("button", { name: "Gestionar estudiantes", exact: true }).click();
  await nav.getByRole("link", { name: "Registrar", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Registrar estudiantes", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Guardar ejemplo" })).toBeVisible();
  await expect(students).toHaveAttribute("aria-expanded", "true");
  const schedules = nav.getByRole("button", { name: "Control de horarios", exact: true });
  await schedules.click();
  await expect(students).toHaveAttribute("aria-expanded", "false");
  await expect(schedules).toHaveAttribute("aria-expanded", "true");
  await expect(nav.getByRole("link", { name: "Consultar", exact: true })).toBeVisible();
});

const academic = ["Control de horarios", "Control de asistencia", "Gestión de calificaciones"];
const admin = ["Gestión de usuarios", "Registro de estudiantes", "Gestión de docentes", "Administración de asignaturas", ...academic, "Informes y reportes"];
for (const [role, labels] of [
  ["DIRECTOR", admin],
  ["SECRETARIA", admin],
  ["DOCENTE", ["Administración de asignaturas", ...academic, "Informes y reportes"]],
  ["PADRE", ["Registro de estudiantes", ...academic]],
  ["ESTUDIANTE", academic],
] as const) {
  test(`módulos principales de ${role}`, async ({ page }) => {
    await page.goto(`/demo?rol=${role}`);
    const nav = page.getByRole("navigation", { name: "Módulos académicos" });
    await expect(nav.locator(".nav-main span")).toHaveText(labels);
    await expect(nav.getByRole("link", { name: "Resumen", exact: true })).toHaveCount(0);
    const logo = page.getByRole("link", { name: "IberAcad: volver al resumen", exact: true });
    await expect(logo).toHaveAttribute("href", `/demo?rol=${role}`);
    await page.goto(`/demo/operaciones?modulo=asistencia&accion=consultar&rol=${role}`);
    await expect(page.getByRole("heading", { name: "Consultar asistencia", exact: true })).toBeVisible();
    await logo.click();
    await expect(page).toHaveURL(new RegExp(`/demo\\?rol=${role}$`));
    await expect(page.locator(".dashboard-eyebrow")).toContainText("MI RESUMEN");
  });
}

test("docente, padre y estudiante conservan las consultas reubicadas", async ({ page }) => {
  await page.goto("/demo?rol=DOCENTE");
  const nav = page.getByRole("navigation", { name: "Módulos académicos" });
  await nav.getByRole("button", { name: "Administración de asignaturas", exact: true }).click();
  await nav.getByRole("button", { name: "Consultar estudiantes", exact: true }).click();
  await expect(nav.getByRole("link", { name: "Consultar", exact: true })).toHaveAttribute("href", "/demo/operaciones?modulo=estudiantes&accion=consultar&rol=DOCENTE");
  await expect(nav.getByRole("link", { name: "Registrar", exact: true })).toHaveCount(0);
  for (const role of ["ESTUDIANTE", "PADRE"]) {
    await page.goto(`/demo?rol=${role}`);
    await nav.getByRole("button", { name: "Control de horarios", exact: true }).click();
    await nav.getByRole("button", { name: "Consultar asignaturas", exact: true }).click();
    await expect(nav.getByRole("link", { name: "Consultar", exact: true })).toHaveAttribute("href", `/demo/operaciones?modulo=asignaturas&accion=consultar&rol=${role}`);
    await nav.getByRole("button", { name: "Gestión de calificaciones", exact: true }).click();
    await nav.getByRole("button", { name: "Informes y reportes", exact: true }).click();
    await expect(nav.getByRole("link", { name: "Consultar informes/reportes", exact: true })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Generar informe/reporte", exact: true })).toHaveCount(0);
    await nav.getByRole("button", { name: "Control de asistencia", exact: true }).click();
    await expect(nav.getByRole("link", { name: "Consultar asistencia", exact: true })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Registrar asistencia", exact: true })).toHaveCount(0);
  }
});

test("menú móvil deslizable, Escape y contenido sin desbordamiento", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/demo?rol=DIRECTOR");
  const open = page.getByRole("button", { name: "Abrir menú", exact: true });
  await open.click();
  await expect(open).toHaveAttribute("aria-expanded", "true");
  await page
    .getByRole("button", { name: "Control de asistencia", exact: true })
    .click();
  await page
    .getByRole("link", { name: "Consultar asistencia", exact: true })
    .click();
  await expect(open).toHaveAttribute("aria-expanded", "false");
  await expect(
    page.getByRole("heading", { name: "Consultar asistencia", exact: true }),
  ).toBeVisible();
  await open.click();
  await page.keyboard.press("Escape");
  await expect(open).toBeFocused();
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      )
      .toBe(true);
  }
});


test("el encabezado y la barra superior reflejan cada acción seleccionada", async ({ page }) => {
  await page.goto("/demo?rol=DIRECTOR");
  const nav = page.getByRole("navigation", { name: "Módulos académicos" });
  await nav.getByRole("button", { name: "Gestión de usuarios", exact: true }).click();
  await nav.getByRole("button", { name: "Gestionar usuarios", exact: true }).click();
  for (const action of ["Consultar", "Registrar", "Editar", "Eliminar"]) {
    await nav.getByRole("link", { name: action, exact: true }).click();
    await expect(page.locator("main h1")).toHaveText(`${action} usuarios`);
    await expect(page.locator(".workspace-heading")).toContainText(`${action} usuarios`);
    await expect(nav.getByRole("link", { name: action, exact: true })).toHaveAttribute("aria-current", "page");
  }
});
