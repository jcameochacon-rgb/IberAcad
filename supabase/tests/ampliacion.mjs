/** Ampliación de módulos: informes guardados y eliminación de borradores bajo RLS. */
import { PGlite } from "@electric-sql/pglite";
import { readFileSync, readdirSync } from "node:fs";
import assert from "node:assert/strict";
const db = new PGlite();
let passed = 0;
const uid = (n) => `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`;
const scalar = async (sql, args = []) => (await db.query(sql, args)).rows[0];
const count = async (sql, args = []) => Number((await scalar(sql, args)).n);
const check = async (name, fn) => {
  await fn();
  console.log(`OK ampliación ${++passed}: ${name}`);
};
async function role(n, fn) {
  await db.exec("set role authenticated");
  await db.query("select set_config('request.jwt.claim.sub',$1,false)", [
    uid(n),
  ]);
  try {
    return await fn();
  } finally {
    await db.exec("reset role");
    await db.query("select set_config('request.jwt.claim.sub','',false)");
  }
}
async function rejects(fn, pattern) {
  await db.exec("begin");
  let error;
  try {
    await fn();
  } catch (e) {
    error = e;
  } finally {
    await db.exec("rollback");
  }
  assert.ok(error, "Debía rechazarse");
  if (pattern) assert.match(error.message, pattern);
}

await db.exec(`create role anon;create role authenticated;create role service_role bypassrls;
 create schema auth;create table auth.users(id uuid primary key);
 create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
 grant usage on schema auth to authenticated;grant execute on function auth.uid() to authenticated;`);
const dir = new URL("../migrations/", import.meta.url);
for (const file of readdirSync(dir)
  .filter((f) => f.endsWith(".sql"))
  .sort())
  await db.exec(readFileSync(new URL(file, dir), "utf8"));

// Datos ficticios: Dirección (1), docente asignado (3), docente de otro curso (4).
for (const n of [1, 3, 4, 6, 7, 8]) {
  await db.query("insert into auth.users values($1)", [uid(n)]);
  await db.query(
    "insert into public.personas(id,nombres,apellido_paterno) values($1,'Ficticio','Prueba')",
    [uid(100 + n)],
  );
}
await db.query(
  "insert into public.docentes(id,persona_id) values($1,$2),($3,$4)",
  [uid(203), uid(103), uid(204), uid(104)],
);
await db.query("insert into public.estudiantes(id,persona_id) values($1,$2)", [
  uid(206),
  uid(106),
]);
for (const [n, r] of [
  [1, "DIRECTOR"],
  [3, "DOCENTE"],
  [4, "DOCENTE"],
  [7, "SECRETARIA"],
])
  await db.query(
    "insert into public.perfiles(id,persona_id,rol) values($1,$2,$3)",
    [uid(n), uid(100 + n), r],
  );
const g = (await scalar("select id from public.gestiones where anio=2026")).id;
const term = (
  await scalar(
    "select id from public.trimestres where gestion_id=$1 and numero=1",
    [g],
  )
).id;
await db.query(
  "update public.trimestres set fecha_inicio='2026-01-01',fecha_fin='2026-04-30',estado='ABIERTO' where id=$1",
  [term],
);
const course = uid(301),
  other = uid(302);
await db.query(
  "insert into public.cursos(id,gestion_id,grado_id,paralelo) values($1,$3,1,'A'),($2,$3,1,'B')",
  [course, other, g],
);
const subject = (
  await scalar("select id from public.asignaturas order by nombre limit 1")
).id;
await db.query(
  "insert into public.asignaciones_docente(id,docente_id,curso_id,gestion_id,asignatura_id) values($1,$2,$3,$4,$5),($6,$7,$8,$4,$5)",
  [uid(501), uid(203), course, g, subject, uid(502), uid(204), other],
);
await db.query(
  "insert into public.matriculas(id,estudiante_id,curso_id,gestion_id,fecha_ingreso) values($1,$2,$3,$4,'2026-01-01')",
  [uid(401), uid(206), course, g],
);
await db.query(
  "insert into public.jornadas_asistencia(id,curso_id,gestion_id,fecha) values($1,$2,$3,'2026-02-02'),($4,$2,$3,'2026-02-03')",
  [uid(601), course, g, uid(602)],
);
await db.query(
  "insert into public.asistencias(id,jornada_id,matricula_id,curso_id,gestion_id,estado) values($1,$2,$3,$4,$5,'A'),($6,$7,$3,$4,$5,'F')",
  [uid(701), uid(601), uid(401), course, g, uid(702), uid(602)],
);
await db.query(
  "update public.jornadas_asistencia set estado='PUBLICADO' where id=$1",
  [uid(602)],
);
await db.query(
  "insert into public.calificaciones_trimestrales(id,asignacion_docente_id,matricula_id,curso_id,gestion_id,trimestre_id) values($1,$2,$3,$4,$5,$6)",
  [uid(801), uid(501), uid(401), course, g, term],
);

await check("un docente de otro curso no elimina el borrador", () =>
  role(4, () =>
    rejects(
      () =>
        db.query("select public.eliminar_registro_academico('asistencia',$1)", [
          uid(701),
        ]),
      /Sin permiso/,
    ),
  ),
);
await check("no se elimina una asistencia de jornada publicada", () =>
  role(3, () =>
    rejects(
      () =>
        db.query("select public.eliminar_registro_academico('asistencia',$1)", [
          uid(702),
        ]),
      /Retira la publicación/,
    ),
  ),
);
await check(
  "el docente asignado elimina su borrador de asistencia",
  async () => {
    await role(3, () =>
      db.query("select public.eliminar_registro_academico('asistencia',$1)", [
        uid(701),
      ]),
    );
    assert.equal(
      await count("select count(*) n from public.asistencias where id=$1", [
        uid(701),
      ]),
      0,
    );
    assert.equal(
      await count("select count(*) n from public.asistencias where id=$1", [
        uid(702),
      ]),
      1,
    );
  },
);
await check("Dirección elimina una calificación en borrador", async () => {
  await role(1, () =>
    db.query("select public.eliminar_registro_academico('calificaciones',$1)", [
      uid(801),
    ]),
  );
  assert.equal(
    await count(
      "select count(*) n from public.calificaciones_trimestrales where id=$1",
      [uid(801)],
    ),
    0,
  );
});
await check("tipo inválido rechazado", () =>
  role(1, () =>
    rejects(
      () =>
        db.query("select public.eliminar_registro_academico('otro',$1)", [
          uid(801),
        ]),
      /Tipo inválido/,
    ),
  ),
);
await check(
  "cada cuenta ve y administra solo sus informes guardados",
  async () => {
    await role(3, () =>
      db.query(
        "insert into public.reportes_guardados(propietario_id,nombre,parametros) values($1,'Mi informe','tipo=asistencia')",
        [uid(3)],
      ),
    );
    assert.equal(
      await role(4, () =>
        count("select count(*) n from public.reportes_guardados"),
      ),
      0,
    );
    assert.equal(
      await role(3, () =>
        count("select count(*) n from public.reportes_guardados"),
      ),
      1,
    );
    await role(4, () =>
      rejects(() =>
        db.query(
          "insert into public.reportes_guardados(propietario_id,nombre,parametros) values($1,'Ajeno','x')",
          [uid(3)],
        ),
      ),
    );
    await role(4, () => db.query("delete from public.reportes_guardados"));
    assert.equal(
      await count("select count(*) n from public.reportes_guardados"),
      1,
    );
  },
);
await check(
  "catálogo de asignaturas: Dirección crea y edita, docente no",
  async () => {
    const created = await role(1, () =>
      scalar(
        "insert into public.asignaturas(nombre,descripcion) values('Robótica escolar','Taller') returning id,updated_at",
      ),
    );
    const changed = await role(1, () =>
      db.query(
        "update public.asignaturas set activo=false,updated_at=now() where id=$1 and updated_at=$2 returning id",
        [created.id, created.updated_at],
      ),
    );
    assert.equal(changed.rows.length, 1);
    const stale = await role(1, () =>
      db.query(
        "update public.asignaturas set nombre='Otra' where id=$1 and updated_at=$2 returning id",
        [created.id, created.updated_at],
      ),
    );
    assert.equal(
      stale.rows.length,
      0,
      "una versión vieja no debe sobrescribir",
    );
    await role(1, () =>
      rejects(
        () =>
          db.query(
            "insert into public.asignaturas(nombre) values('Robótica escolar')",
          ),
        /duplicate|unique/,
      ),
    );
    await role(3, () =>
      rejects(() =>
        db.query("insert into public.asignaturas(nombre) values('Ajena')"),
      ),
    );
  },
);
await check(
  "Secretaría ve y administra solo cuentas no administrativas",
  async () => {
    const visible = await role(7, () =>
      db.query("select rol from public.perfiles order by rol"),
    );
    const roles = visible.rows.map((r) => r.rol);
    assert.ok(roles.includes("DOCENTE"));
    assert.ok(!roles.includes("DIRECTOR"), "no debe ver a Dirección");
    const updated = await role(7, () =>
      db.query(
        "update public.perfiles set activo=false where id=$1 returning id",
        [uid(4)],
      ),
    );
    assert.equal(updated.rows.length, 1);
    const director = await role(7, () =>
      db.query(
        "update public.perfiles set activo=false where id=$1 returning id",
        [uid(1)],
      ),
    );
    assert.equal(director.rows.length, 0, "no modifica a Dirección");
    await role(7, () =>
      rejects(() =>
        db.query("update public.perfiles set rol='DIRECTOR' where id=$1", [
          uid(4),
        ]),
      ),
    );
    await role(7, () =>
      rejects(() =>
        db.query(
          "insert into public.perfiles(id,persona_id,rol) values($1,$2,'SECRETARIA')",
          [uid(8), uid(108)],
        ),
      ),
    );
    await role(7, () =>
      db.query(
        "insert into public.perfiles(id,persona_id,rol) values($1,$2,'ESTUDIANTE')",
        [uid(6), uid(106)],
      ),
    );
    assert.equal(
      await count("select count(*) n from public.perfiles where id=$1", [
        uid(6),
      ]),
      1,
    );
  },
);
await check("Dirección conserva el acceso a todas las cuentas", async () => {
  assert.equal(
    await role(1, () => count("select count(*) n from public.perfiles")),
    await count("select count(*) n from public.perfiles"),
  );
});
await check("la migración se puede volver a ejecutar sin errores", async () => {
  await db.exec(
    readFileSync(new URL("202611270001_ampliacion_modulos.sql", dir), "utf8"),
  );
  assert.equal(
    await count("select count(*) n from public.reportes_guardados"),
    1,
  );
});
console.log(`${passed} pruebas de ampliación aprobadas`);
