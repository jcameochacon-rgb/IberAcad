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

test("ampliación: nuevas ventanas y filtros para Dirección", async ({
  page,
}) => {
  await login(page);
  for (const [path, title] of [
    ["/panel/gestion/asignaturas", "Gestionar asignaturas."],
    ["/panel/asignaturas", "Consultar asignaturas."],
    ["/panel/asistencia/editar", "Editar asistencia."],
    ["/panel/calificaciones/editar", "Editar calificaciones."],
    ["/panel/informes/guardados", "Consultar informes/reportes."],
    ["/panel/informes/editar", "Editar parámetros."],
    ["/panel/informes/eliminar", "Eliminar reporte."],
    ["/panel/usuarios/personal", "Personal administrativo."],
    ["/panel/usuarios/familias", "Accesos de familias."],
    ["/panel/asistencia/borradores", "Eliminar asistencia."],
    ["/panel/calificaciones/borradores", "Eliminar calificaciones."],
  ]) {
    await page.goto(path);
    await expect(page.getByRole("heading", { name: title })).toBeVisible();
  }
  await page.goto("/panel/gestion/asignaciones");
  for (const label of ["Gestión", "Curso", "Docente", "Materia", "Estado"])
    await expect(
      page.getByRole("combobox", { name: `Filtrar por ${label}` }),
    ).toBeVisible();
  await page.goto("/panel/gestion/matriculas?estado=RETIRADA");
  await expect(
    page.getByRole("combobox", { name: "Filtrar por Estado" }),
  ).toHaveValue("RETIRADA");
  await expect(
    page.getByRole("link", { name: "Limpiar filtros" }),
  ).toBeVisible();
  await page.goto("/panel/usuarios/nuevo");
  await page.getByLabel("Vincular a una ficha existente").check();
  await expect(page.getByLabel("Ficha registrada sin cuenta *")).toBeVisible();
  await expect(page.getByLabel("Nombres *")).toHaveCount(0);
});

test("ampliación: Secretaría administra cuentas no administrativas", async ({
  page,
}) => {
  await login(page, "secretaria@example.invalid");
  await page.goto("/panel/usuarios/personal");
  await expect(
    page.getByText("Solo Dirección puede administrar estas cuentas."),
  ).toBeVisible();
  await page.goto("/panel/usuarios/nuevo");
  const roles = await page
    .getByLabel("Rol *")
    .locator("option")
    .allTextContents();
  expect(roles).not.toContain("Dirección");
  expect(roles).not.toContain("Secretaría");
  expect(roles).toContain("Docente");
  await page.goto("/panel/usuarios");
  await expect(
    page.getByRole("heading", { name: "Buscar usuarios." }),
  ).toBeVisible();
});

test("ampliación: docente edita sus planillas y consulta sus materias", async ({
  page,
}) => {
  await login(page, "docente@example.invalid");
  // El grupo del menú de la página abierta queda desplegado.
  for (const [path, names] of [
    [
      "/panel/asistencia/editar",
      [
        "Registrar asistencia",
        "Consultar asistencia",
        "Editar asistencia",
        "Eliminar asistencia",
      ],
    ],
    [
      "/panel/calificaciones/editar",
      [
        "Registrar calificaciones",
        "Consultar calificaciones",
        "Editar calificaciones",
        "Eliminar calificaciones",
      ],
    ],
  ] as const) {
    await page.goto(path);
    for (const name of names)
      await expect(
        page
          .getByRole("navigation", { name: "Navegación principal" })
          .getByRole("link", { name, exact: true }),
      ).toBeVisible();
  }
  await expect(
    page.getByRole("heading", { name: "Editar calificaciones." }),
  ).toBeVisible();
  await page.goto("/panel/asignaturas");
  await expect(
    page.getByRole("heading", { name: "Consultar asignaturas." }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Gestionar asignaturas", exact: true }),
  ).toHaveCount(0);
});

test("gestión de docentes: cinco opciones para Dirección y dos para el docente", async ({
  page,
}) => {
  await login(page);
  for (const [path, title] of [
    ["/panel/docentes", "Consultar docentes."],
    ["/panel/gestion/docentes", "Fichas de docentes."],
    ["/panel/docentes/carga", "Carga académica."],
    ["/panel/docentes/horario", "Horario del docente."],
    ["/panel/usuarios/docentes", "Cuentas de docentes."],
  ]) {
    await page.goto(path);
    await expect(page.getByRole("heading", { name: title })).toBeVisible();
  }
  await page.goto("/panel/docentes");
  const nav = page.getByRole("navigation", { name: "Navegación principal" });
  for (const name of [
    "Consultar docentes",
    "Fichas de docentes",
    "Carga académica",
    "Horario del docente",
    "Cuentas de docentes",
  ])
    await expect(nav.getByRole("link", { name, exact: true })).toBeVisible();
  await page
    .getByRole("button", { name: "Cerrar sesión", exact: true })
    .click();
  await login(page, "docente@example.invalid");
  await page.goto("/panel/docentes/carga");
  await expect(
    page.getByRole("heading", { name: "Carga académica." }),
  ).toBeVisible();
  await expect(
    nav.getByRole("link", { name: "Horario del docente", exact: true }),
  ).toBeVisible();
  await expect(
    nav.getByRole("link", { name: "Consultar docentes", exact: true }),
  ).toHaveCount(0);
  await page.goto("/panel/docentes/horario");
  await expect(
    page.getByRole("heading", { name: "Horario del docente." }),
  ).toBeVisible();
  await page.goto("/panel/docentes");
  await expect(
    page.getByText(
      "Solo Dirección y Secretaría pueden consultar el plantel docente.",
    ),
  ).toBeVisible();
});

test("cuentas de docentes: lista las fichas sin cuenta y prepara su acceso", async ({
  page,
}) => {
  await login(page);
  await page.goto("/panel/gestion/docentes?nuevo=1");
  await page.getByLabel("Nombres *", { exact: true }).fill("Sincuenta");
  await page.getByLabel("Apellido paterno", { exact: true }).fill("Prueba");
  await page.getByLabel("CI", { exact: true }).fill("88001122");
  await page.getByRole("button", { name: "Registrar", exact: true }).click();
  await expect(
    page.getByRole("status").filter({ hasText: "Registro guardado" }),
  ).toBeVisible();
  await page.goto("/panel/usuarios/docentes");
  const row = page.getByRole("listitem").filter({ hasText: "Sincuenta" });
  await expect(row).toContainText("Sin cuenta");
  await row.getByRole("link", { name: "Crear acceso" }).click();
  await expect(page).toHaveURL(/\/panel\/usuarios\/nuevo\?persona=/);
  await expect(page.getByLabel("Vincular a una ficha existente")).toBeChecked();
  await expect(page.getByLabel("Ficha registrada sin cuenta *")).toHaveValue(
    /.+/,
  );
  await expect(page.getByLabel("Rol *")).toHaveValue("DOCENTE");
});
