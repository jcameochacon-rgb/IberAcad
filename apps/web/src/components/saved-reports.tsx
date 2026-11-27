"use client";
import Link from "next/link";
import { useActionState, useState } from "react";
import { Bookmark, LoaderCircle, Pencil, Trash2 } from "lucide-react";
import {
  saveReport,
  type SavedReportState,
} from "@/app/panel/informes/saved-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type SavedReport = {
  id: string;
  nombre: string;
  parametros: string;
  detalle: string;
  fecha: string;
};

function Feedback({ state }: { state: SavedReportState }) {
  if (state.error)
    return (
      <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
        {state.error}
      </p>
    );
  if (state.ok)
    return (
      <p
        role="status"
        className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800"
      >
        {state.ok}
      </p>
    );
  return null;
}

/** Guardar el informe actual o actualizar el informe guardado abierto. */
export function SaveCurrentReport({
  params,
  openId,
  openName,
}: {
  params: string;
  openId?: string;
  openName?: string;
}) {
  const [state, action, pending] = useActionState(
    saveReport,
    {} as SavedReportState,
  );
  return (
    <form action={action} className="flex flex-wrap items-end gap-3">
      <input type="hidden" name="parametros" value={params} />
      {openId ? (
        <>
          <input type="hidden" name="op" value="actualizar" />
          <input type="hidden" name="id" value={openId} />
          <p className="text-sm">
            Informe guardado abierto: <strong>{openName}</strong>
          </p>
          <Button variant="outline" disabled={pending}>
            {pending ? (
              <LoaderCircle size={16} className="animate-spin" />
            ) : (
              <Bookmark size={16} />
            )}
            Guardar estos filtros en él
          </Button>
        </>
      ) : (
        <>
          <input type="hidden" name="op" value="crear" />
          <label className="text-sm">
            Guardar este informe como
            <Input
              name="nombre"
              required
              maxLength={150}
              placeholder="Ej.: Notas 3° A – 1er trimestre"
              className="mt-2 w-72"
            />
          </label>
          <Button variant="outline" disabled={pending}>
            {pending ? (
              <LoaderCircle size={16} className="animate-spin" />
            ) : (
              <Bookmark size={16} />
            )}
            Guardar informe
          </Button>
        </>
      )}
      <div className="basis-full">
        <Feedback state={state} />
      </div>
    </form>
  );
}

/** Lista de informes guardados: abrir, renombrar y eliminar, con buscador y filtro. */
export function SavedReportList({
  reports,
  mode = "consultar",
}: {
  reports: SavedReport[];
  /** consultar: abrir · editar: renombrar o abrir para cambiar filtros · eliminar */
  mode?: "consultar" | "editar" | "eliminar";
}) {
  const [state, action, pending] = useActionState(
    saveReport,
    {} as SavedReportState,
  );
  const [editing, setEditing] = useState("");
  const [confirming, setConfirming] = useState("");
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const shown = reports.filter(
    (r) =>
      (!type || new URLSearchParams(r.parametros).get("tipo") === type) &&
      `${r.nombre} ${r.detalle}`
        .toLocaleLowerCase("es")
        .includes(search.toLocaleLowerCase("es")),
  );
  if (!reports.length)
    return (
      <p className="text-sm text-muted-foreground">
        Aún no guardaste informes. Genera uno y usa «Guardar informe» para
        volver a abrirlo con los mismos filtros.
      </p>
    );
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Input
          aria-label="Buscar informes guardados"
          placeholder="Buscar por nombre o curso…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-11 max-w-xs"
        />
        <select
          aria-label="Filtrar por tipo"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="h-11 rounded-lg border border-input bg-background px-3 text-sm"
        >
          <option value="">Tipo: todos</option>
          <option value="calificaciones">Calificaciones</option>
          <option value="asistencia">Asistencia</option>
        </select>
      </div>
      <Feedback state={state} />
      <ul className="divide-y divide-border rounded-xl border border-border">
        {shown.map((r) => (
          <li key={r.id} className="flex flex-wrap items-center gap-3 p-4">
            <div className="min-w-0 flex-1">
              {editing === r.id ? (
                <form action={action} className="flex flex-wrap gap-2">
                  <input type="hidden" name="op" value="renombrar" />
                  <input type="hidden" name="id" value={r.id} />
                  <Input
                    name="nombre"
                    defaultValue={r.nombre}
                    required
                    maxLength={150}
                    aria-label="Nuevo nombre"
                    className="h-10 max-w-xs"
                  />
                  <Button size="sm" disabled={pending}>
                    Guardar
                  </Button>
                  <Button
                    size="sm"
                    type="button"
                    variant="ghost"
                    onClick={() => setEditing("")}
                  >
                    Cancelar
                  </Button>
                </form>
              ) : (
                <>
                  <p className="font-medium">{r.nombre}</p>
                  <p className="text-xs text-muted-foreground">
                    {r.detalle} · Actualizado {r.fecha}
                  </p>
                </>
              )}
            </div>
            {mode !== "eliminar" && (
              <Button
                asChild
                size="sm"
                variant={mode === "consultar" ? "default" : "outline"}
              >
                <Link href={`/panel/informes?${r.parametros}&guardado=${r.id}`}>
                  {mode === "editar" ? "Cambiar filtros" : "Abrir"}
                </Link>
              </Button>
            )}
            {mode === "editar" && (
              <Button
                size="sm"
                variant="outline"
                type="button"
                onClick={() => setEditing(r.id)}
              >
                <Pencil size={14} /> Renombrar
              </Button>
            )}
            {mode === "eliminar" &&
              (confirming === r.id ? (
                <form action={action} className="inline-flex gap-2">
                  <input type="hidden" name="op" value="eliminar" />
                  <input type="hidden" name="id" value={r.id} />
                  <Button size="sm" variant="destructive" disabled={pending}>
                    <Trash2 size={14} /> Confirmar
                  </Button>
                  <Button
                    size="sm"
                    type="button"
                    variant="ghost"
                    onClick={() => setConfirming("")}
                  >
                    Cancelar
                  </Button>
                </form>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  type="button"
                  onClick={() => setConfirming(r.id)}
                >
                  <Trash2 size={14} /> Eliminar
                </Button>
              ))}
          </li>
        ))}
        {!shown.length && (
          <li className="p-4 text-sm text-muted-foreground">
            No hay informes con esos filtros.
          </li>
        )}
      </ul>
    </div>
  );
}
