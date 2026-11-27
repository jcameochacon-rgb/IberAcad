import Link from "next/link";
import { PageTitle } from "@/components/page-title";
import { requireProfile } from "@/lib/auth";
import { loadPanel } from "@/lib/data/live";
import { loadScheduleCourses } from "@/lib/data/schedule";
import { canManage, uuidPattern } from "@/lib/management-validation";
import { canWriteNotice, type Notice } from "@/lib/notices";
import { PanelShell } from "@/components/panel-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NoticeForm, NoticePublishForm } from "@/components/notice-forms";
export default async function NoticePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams,
    { supabase, profile } = await requireProfile(),
    model = await loadPanel();
  const page = Math.floor(
    Math.min(100000, Math.max(1, Number(params.pagina) || 1)),
  );
  const { data, error } = await supabase.rpc("consultar_comunicados", {
    p_pagina: page,
  });
  const list = data as unknown as { total: number; items: Notice[] } | null;
  const id = typeof params.id === "string" ? params.id : "";
  const detail =
    id && uuidPattern.test(id)
      ? await supabase.rpc("consultar_comunicado", { p_id: id })
      : null;
  const notice = detail?.data as unknown as Notice | undefined;
  const write = canWriteNotice(profile.rol),
    editing = params.editar === "1",
    fresh = params.nuevo === "1";
  const courses =
    write && (fresh || editing) ? await loadScheduleCourses() : [];
  const individual = notice?.destinatarios.some((d) => d.perfil_id);
  const messages: Record<string, string> = {
    guardar: "Borrador guardado. Revisa el contenido antes de publicar.",
    publicar:
      "Comunicado publicado. Ya está disponible para sus destinatarios.",
    retirar: "Publicación retirada. El aviso vuelve a ser un borrador.",
  };
  return (
    <PanelShell model={model} current="comunicados">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs text-muted-foreground">
            Comunidad educativa
          </p>
          <PageTitle fallback="Tablón de comunicados" />
          <p className="mt-3 text-sm text-muted-foreground">
            Avisos institucionales y de tus cursos, en un solo lugar.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href="/panel/comunicados">Consultar comunicados</Link>
          </Button>
          {write && (
            <Button asChild>
              <Link href="/panel/comunicados/bandeja?nuevo=1">
                Nuevo comunicado
              </Link>
            </Button>
          )}
        </div>
      </div>
      {typeof params.resultado === "string" && messages[params.resultado] && (
        <p role="status" className="mb-5 rounded-xl bg-primary/10 p-4 text-sm">
          {messages[params.resultado]}
        </p>
      )}
      {error ? (
        <p role="alert">
          {["42883", "PGRST202"].includes(error.code)
            ? "Instala 202610120001_comunicados.sql en Supabase para habilitar esta fase."
            : "No se pudieron cargar los comunicados. Comprueba la conexión."}
        </p>
      ) : (
        <>
          {id && (!notice || detail?.error) && (
            <p role="alert" className="mb-5">
              El comunicado no está disponible para tu cuenta.
            </p>
          )}
          {write &&
          (fresh ||
            (editing &&
              notice?.puede_editar &&
              notice.estado === "BORRADOR" &&
              !individual)) ? (
            <Card className="mb-7 max-w-3xl p-6">
              <h2 className="mb-5 text-xl font-semibold">
                {fresh ? "Redactar comunicado" : "Editar borrador"}
              </h2>
              <NoticeForm
                key={fresh ? "new" : `${notice?.id}-${notice?.updated_at}`}
                notice={fresh ? undefined : notice}
                courses={courses}
                admin={canManage(profile.rol)}
              />
            </Card>
          ) : (
            notice && (
              <Card className="mb-7 max-w-3xl p-6">
                <div className="mb-4 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full bg-primary/10 px-3 py-1">
                    {notice.estado === "BORRADOR"
                      ? "Borrador · Vista previa"
                      : "Publicado"}
                  </span>
                  <span className="rounded-full border px-3 py-1">
                    {notice.institucional
                      ? "Institucional"
                      : "Por destinatarios"}
                  </span>
                </div>
                <h2 className="break-words text-2xl font-semibold">
                  {notice.titulo}
                </h2>
                <p className="mt-5 whitespace-pre-wrap break-words text-sm leading-7">
                  {notice.contenido}
                </p>
                <div className="mt-6 border-t pt-4 text-xs leading-6 text-muted-foreground">
                  <p>
                    Destinatarios:{" "}
                    {notice.institucional
                      ? "todas las cuentas activas del sistema"
                      : notice.destinatarios
                          .map((d) =>
                            d.perfil_id ? "Destinatario individual" : d.nombre,
                          )
                          .join(", ") || "según los permisos de tu cuenta"}
                    .
                  </p>
                  {notice.publicado_at && (
                    <p>
                      Publicado:{" "}
                      {new Date(notice.publicado_at).toLocaleString("es-BO", {
                        timeZone: "America/La_Paz",
                      })}{" "}
                      (Bolivia).
                    </p>
                  )}
                </div>
                {notice.puede_editar && (
                  <>
                    <p className="mt-4 text-xs leading-6 text-muted-foreground">
                      {notice.estado === "PUBLICADO"
                        ? "Retira la publicación para editar. Una copia ya leída o descargada por otra persona no se puede retirar."
                        : "Publicar hace visible este aviso dentro del sistema. No envía correos ni notificaciones push."}
                    </p>
                    {notice.estado === "BORRADOR" && !individual && (
                      <Button asChild variant="outline" className="mt-4">
                        <Link href={`?id=${notice.id}&editar=1`}>
                          Editar borrador
                        </Link>
                      </Button>
                    )}
                    {individual && (
                      <p className="mt-4 text-sm">
                        Este aviso usa destinatarios individuales. Su edición y
                        publicación no están disponibles en esta fase.
                      </p>
                    )}
                    {(!individual || notice.estado === "PUBLICADO") && (
                      <NoticePublishForm
                        key={notice.updated_at}
                        notice={notice}
                      />
                    )}
                  </>
                )}
              </Card>
            )
          )}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Avisos disponibles</h2>
            <span className="text-xs text-muted-foreground">
              {list?.total ?? 0} registros
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {list?.items.map((n) => (
              <Card key={n.id} className="min-w-0 p-5">
                <p className="mb-3 text-xs text-muted-foreground">
                  {n.estado === "BORRADOR" ? "Borrador" : "Publicado"} ·{" "}
                  {n.institucional ? "Institucional" : "Por destinatarios"}
                </p>
                <h3 className="break-words font-semibold">{n.titulo}</h3>
                <Link
                  className="mt-4 inline-block text-sm font-medium text-primary underline underline-offset-4"
                  href={`?id=${n.id}&pagina=${page}`}
                >
                  Abrir comunicado
                </Link>
              </Card>
            ))}
          </div>
          {!list?.items.length && (
            <Card className="p-8 text-sm text-muted-foreground">
              No hay comunicados disponibles en esta página.
            </Card>
          )}
          <nav
            aria-label="Páginas de comunicados"
            className="mt-6 flex gap-5 text-sm"
          >
            {page > 1 && <Link href={`?pagina=${page - 1}`}>Anterior</Link>}
            <span>Página {page}</span>
            {page * 20 < (list?.total ?? 0) && (
              <Link href={`?pagina=${page + 1}`}>Siguiente</Link>
            )}
          </nav>
        </>
      )}
    </PanelShell>
  );
}
