import { test, expect, type Page } from "@playwright/test";
const login = async (page: Page, email = "director@example.invalid") => {
  await page.goto("/login");
  await page.getByLabel("Correo electrónico").fill(email);
  await page
    .getByLabel("Contraseña", { exact: true })
    .fill("ContraseñaFicticia!");
  await page
    .getByRole("button", { name: "Iniciar sesión", exact: true })
    .click();
  await expect(page).toHaveURL(/\/panel$/);
};
const createStudent = async (page: Page, name: string, rude: string) => {
  await page.goto("/panel/gestion/estudiantes?nuevo=1");
  await page.getByLabel("Nombres *", { exact: true }).fill(name);
  await page.getByLabel("Apellido paterno", { exact: true }).fill("Prueba");
  await page.getByLabel("RUDE", { exact: true }).fill(rude);
  await page.getByLabel("Fecha de nacimiento").fill("2019-01-01");
  await page.getByRole("button", { name: "Registrar", exact: true }).click();
  await expect(
    page.getByRole("status").filter({ hasText: "Registro guardado" }),
  ).toBeVisible();
  const savedUrl = new URL(page.url());
  const id = savedUrl.searchParams.get("registro")!;
  await page.goto(`${savedUrl.pathname}?id=${id}`);
  return id;
};
const createCourse = async (page: Page, parallel: string) => {
  await page.goto("/panel/gestion/cursos?nuevo=1");
  await page.getByLabel("Grado de primaria").selectOption("1");
  await page.getByLabel("Paralelo *", { exact: true }).fill(parallel);
  await page.getByRole("button", { name: "Registrar", exact: true }).click();
  await expect(
    page.getByRole("status").filter({ hasText: "Registro guardado" }),
  ).toBeVisible();
  const savedUrl = new URL(page.url());
  const id = savedUrl.searchParams.get("registro")!;
  await page.goto(`${savedUrl.pathname}?id=${id}`);
  return id;
};

test("Secretaría registra y edita estudiantes; la búsqueda consulta toda la lista", async ({
  page,
}) => {
  await login(page, "secretaria@example.invalid");
  const id = await createStudent(page, "Nora navegador", "RUDE-NAVEGADOR-1");
  await page.getByLabel("Teléfono", { exact: true }).fill("70000001");
  await page
    .getByRole("button", { name: "Guardar cambios", exact: true })
    .click();
  await page.reload();
  await expect(page.getByLabel("Teléfono", { exact: true })).toHaveValue(
    "70000001",
  );
  await page.goto("/panel/gestion/estudiantes");
  await page.getByRole("textbox", { name: "Buscar registros" }).fill("Nora");
  await page.getByRole("button", { name: "Buscar", exact: true }).click();
  await expect(page.getByRole("table")).toContainText("Nora navegador");
  await expect(page.getByRole("link", { name: /Editar Nora/ })).toHaveAttribute(
    "href",
    `/panel/gestion/estudiantes?id=${id}`,
  );
});

test("RUDE duplicado muestra error y conserva lo escrito", async ({ page }) => {
  await login(page);
  await createStudent(page, "Ficha original", "RUDE-NAVEGADOR-2");
  await page.goto("/panel/gestion/estudiantes?nuevo=1");
  await page.getByLabel("Nombres *", { exact: true }).fill("Ficha duplicada");
  await page.getByLabel("RUDE", { exact: true }).fill("RUDE-NAVEGADOR-2");
  await page.getByRole("button", { name: "Registrar", exact: true }).click();
  await expect(
    page.getByRole("alert").filter({ hasText: "Ya existe" }),
  ).toBeVisible();
  await expect(page.getByLabel("Nombres *", { exact: true })).toHaveValue(
    "Ficha duplicada",
  );
  await page.goto("/panel/gestion/estudiantes?q=duplicada");
  await expect(page.getByRole("table")).not.toContainText("Ficha duplicada");
});

test("tutor vinculado y matrícula sobreviven a una recarga; el retiro conserva el historial", async ({
  page,
}) => {
  await login(page);
  await createCourse(page, "Z");
  await page.goto("/panel/gestion/tutores?nuevo=1");
  await page
    .getByLabel("Nombres *", { exact: true })
    .fill("Responsable navegador");
  await page.getByRole("button", { name: "Registrar", exact: true }).click();
  await expect(
    page.getByRole("status").filter({ hasText: "Registro guardado" }),
  ).toBeVisible();
  const tutor = new URL(page.url()).searchParams.get("registro")!;
  await page.goto(`${new URL(page.url()).pathname}?id=${tutor}`);
  const student = await createStudent(
    page,
    "Estudiante vinculado",
    "RUDE-NAVEGADOR-3",
  );
  await page
    .getByRole("textbox", { name: "Buscar tutor", exact: true })
    .fill("Responsable");
  await page.getByRole("button", { name: "Buscar", exact: true }).click();
  await expect(page.getByLabel("Tutor *", { exact: true })).toContainText(
    "Responsable navegador",
  );
  await page.getByLabel("Tutor *", { exact: true }).selectOption(tutor);
  await page.getByLabel("Parentesco").fill("Madre");
  await page.getByLabel("Contacto principal").check();
  await page.getByRole("button", { name: "Vincular tutor" }).click();
  await expect(
    page.getByText("Madre · Consulta autorizada · Contacto principal", {
      exact: true,
    }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Matricular", exact: true }).click();
  await page
    .getByRole("textbox", { name: "Buscar curso", exact: true })
    .fill("Z");
  await page.getByRole("button", { name: "Buscar", exact: true }).click();
  await page
    .getByLabel("Curso *", { exact: true })
    .selectOption({ label: "1° Z · 2026" });
  await page.getByLabel("Fecha de ingreso").fill("2026-02-01");
  await page.getByRole("button", { name: "Registrar", exact: true }).click();
  await expect(
    page.getByRole("status").filter({ hasText: "Registro guardado" }),
  ).toBeVisible();
  const enrollment = new URL(page.url()).searchParams.get("registro")!;
  await page.goto(`/panel/gestion/matriculas?id=${enrollment}`);
  await page.getByLabel("Estado de matrícula").selectOption("RETIRADA");
  await page.getByLabel("Fecha de salida").fill("2026-05-01");
  await page
    .getByRole("button", { name: "Guardar cambios", exact: true })
    .click();
  await page.goto(`/panel/gestion/estudiantes?id=${student}`);
  await expect(
    page.getByText("RETIRADA · Ingreso 2026-02-01 · Salida 2026-05-01", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByText("Madre · Consulta autorizada · Contacto principal", {
      exact: true,
    }),
  ).toBeVisible();
});

test("edición simultánea no sobrescribe una ficha actualizada", async ({
  page,
  context,
}) => {
  await login(page);
  const id = await createStudent(page, "Ficha simultánea", "RUDE-NAVEGADOR-4");
  const other = await context.newPage();
  await other.goto(`/panel/gestion/estudiantes?id=${id}`);
  await page.getByLabel("Nombres *", { exact: true }).fill("Cambio primero");
  await page
    .getByRole("button", { name: "Guardar cambios", exact: true })
    .click();
  await expect(
    page.getByRole("status").filter({ hasText: "Registro guardado" }),
  ).toBeVisible();
  await other.getByLabel("Nombres *", { exact: true }).fill("Cambio antiguo");
  await other
    .getByRole("button", { name: "Guardar cambios", exact: true })
    .click();
  await expect(
    other.getByRole("alert").filter({ hasText: "Otra persona modificó" }),
  ).toBeVisible();
  await other.reload();
  await expect(other.getByLabel("Nombres *", { exact: true })).toHaveValue(
    "Cambio primero",
  );
  await other.close();
});

test("Docente y Padre no ven gestión ni abren sus formularios por URL", async ({
  page,
}) => {
  for (const email of ["docente@example.invalid", "padre@example.invalid"]) {
    await login(page, email);
    await expect(
      page.getByRole("link", { name: "Gestión académica", exact: true }),
    ).toHaveCount(0);
    await page.goto("/panel/gestion/estudiantes?nuevo=1");
    await expect(
      page.getByRole("heading", { name: "Acceso restringido" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Registrar", exact: true }),
    ).toHaveCount(0);
    await page.getByRole("button", { name: "Cerrar sesión" }).click();
  }
});

test("formulario y vínculos funcionan a 390 px; desactivar conserva la ficha", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await login(page);
  const id = await createStudent(page, "Ficha móvil", "RUDE-NAVEGADOR-5");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.getByLabel("Ficha activa").uncheck();
  await page
    .getByRole("button", { name: "Guardar cambios", exact: true })
    .click();
  await page.reload();
  await expect(page.getByLabel("Ficha activa")).not.toBeChecked();
  await page.goto("/panel/gestion/estudiantes?q=móvil");
  await expect(page.getByRole("table")).toContainText("Inactivo");
  await expect(
    page.getByRole("link", { name: /Editar Ficha móvil/ }),
  ).toHaveAttribute("href", `/panel/gestion/estudiantes?id=${id}`);
});
