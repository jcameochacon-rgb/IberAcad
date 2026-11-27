"use client";
import { useActionState, useState } from "react";
import { saveNotice } from "@/app/panel/comunicados/bandeja/actions";
import type { Notice } from "@/lib/notices";
import { Button } from "@/components/ui/button";
const field =
  "mt-2 w-full rounded-lg border border-input bg-background p-3 text-sm";
export function NoticeForm({
  notice,
  courses,
  admin,
}: {
  notice?: Notice;
  courses: { id: string; label: string }[];
  admin: boolean;
}) {
  const [state, action, pending] = useActionState(saveNotice, {});
  const [institutional, setInstitutional] = useState(
    notice?.institucional ?? false,
  );
  return (
    <form
      action={action}
      onReset={(e) => e.preventDefault()}
      className="space-y-5"
    >
      <input type="hidden" name="accion" value="guardar" />
      <input type="hidden" name="id" value={notice?.id ?? ""} />
      <input type="hidden" name="version" value={notice?.updated_at ?? ""} />
      <label className="block text-sm">
        Título
        <input
          className={field}
          name="titulo"
          required
          maxLength={160}
          defaultValue={notice?.titulo}
        />
      </label>
      <div>
        <label htmlFor="notice-content" className="block text-sm">
          Contenido
        </label>
        <textarea
          id="notice-content"
          className={field}
          rows={9}
          name="contenido"
          required
          maxLength={10000}
          defaultValue={notice?.contenido}
        />
      </div>
      {admin && (
        <label className="flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            name="institucional"
            checked={institutional}
            onChange={(e) => setInstitutional(e.target.checked)}
          />
          Institucional: todas las cuentas activas del sistema
        </label>
      )}
      {!institutional && (
        <fieldset className="rounded-xl border p-4">
          <legend className="px-2 text-sm font-medium">
            Cursos destinatarios
          </legend>
          <p className="mb-3 text-xs text-muted-foreground">
            Visible para docentes, estudiantes y tutores con acceso a los cursos
            seleccionados.
          </p>
          <div className="max-h-64 space-y-3 overflow-y-auto">
            {courses.map((c) => (
              <label key={c.id} className="flex gap-3 text-sm">
                <input
                  name="curso"
                  value={c.id}
                  type="checkbox"
                  defaultChecked={notice?.destinatarios.some(
                    (d) => d.curso_id === c.id,
                  )}
                />
                {c.label}
              </label>
            ))}
            {!courses.length && (
              <p className="text-sm">No hay cursos disponibles.</p>
            )}
          </div>
        </fieldset>
      )}
      <p className="text-xs leading-6 text-muted-foreground">
        Guarda el borrador y revisa la vista previa antes de publicar. Guarda
        antes de salir.
      </p>
      {state.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}
      <Button disabled={pending}>
        {pending ? "Guardando…" : "Guardar borrador"}
      </Button>
    </form>
  );
}
export function NoticePublishForm({ notice }: { notice: Notice }) {
  const [state, action, pending] = useActionState(saveNotice, {});
  const publish = notice.estado === "BORRADOR";
  return (
    <form action={action} className="mt-5 space-y-4">
      <input
        type="hidden"
        name="accion"
        value={publish ? "publicar" : "retirar"}
      />
      <input type="hidden" name="id" value={notice.id} />
      <input type="hidden" name="version" value={notice.updated_at} />
      <label className="flex items-start gap-3 text-sm">
        <input name="confirmar" type="checkbox" required />
        {publish
          ? "Confirmo el contenido y los destinatarios; quiero publicar este aviso."
          : "Confirmo que el aviso dejará de estar disponible para sus destinatarios."}
      </label>
      {state.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}
      <Button disabled={pending} variant={publish ? "default" : "outline"}>
        {pending
          ? "Guardando…"
          : publish
            ? "Publicar comunicado"
            : "Retirar publicación"}
      </Button>
    </form>
  );
}
