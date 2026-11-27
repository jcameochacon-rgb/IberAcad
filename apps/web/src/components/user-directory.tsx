import Link from "next/link";
import { Search, Pencil } from "lucide-react";
import { roles, roleLabels, type Role } from "@iberdrola/shared";
import { searchUsers, type UserSearch } from "@/lib/data/users";
import { ActiveToggle } from "@/components/user-forms";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type DirectoryMode = "buscar" | "editar" | "desactivar";
const paths: Record<DirectoryMode, string> = {
  buscar: "/panel/usuarios",
  editar: "/panel/usuarios/editar",
  desactivar: "/panel/usuarios/desactivar",
};

export function parseSearch(
  params: Record<string, string | string[] | undefined>,
  mode: DirectoryMode,
): UserSearch {
  const s = (v: string | string[] | undefined) =>
    typeof v === "string" ? v : "";
  const estado = s(params.estado);
  return {
    q: s(params.q).slice(0, 100),
    rol: roles.includes(s(params.rol) as never) ? s(params.rol) : "",
    estado:
      estado === "activos" || estado === "inactivos" || estado === "todos"
        ? estado
        : mode === "desactivar"
          ? "activos"
          : "todos",
  };
}

const selectClass =
  "h-12 w-full rounded-lg border border-input bg-background px-3 text-sm";

export async function UserDirectory({
  mode,
  search,
  selfId,
  fixedRole,
  path,
  allowed = roles,
}: {
  /** Roles que la cuenta puede administrar (filtro de rol). */
  allowed?: readonly Role[];
  mode: DirectoryMode;
  search: UserSearch;
  selfId: string;
  /** Lista fija de un rol (Personal administrativo, Accesos de familias). */
  fixedRole?: string;
  path?: string;
}) {
  const { rows, emailsAvailable } = await searchUsers(
    fixedRole ? { ...search, rol: fixedRole } : search,
  );
  return (
    <>
      <Card className="mb-6 p-5">
        <form
          method="get"
          action={path ?? paths[mode]}
          className={
            fixedRole
              ? "grid items-end gap-3 md:grid-cols-[minmax(0,2fr)_1fr_auto]"
              : "grid items-end gap-3 md:grid-cols-[minmax(0,2fr)_1fr_1fr_auto]"
          }
        >
          <div>
            <label htmlFor="q" className="mb-2 block text-sm font-medium">
              Buscar por nombre, CI o correo
            </label>
            <Input
              id="q"
              name="q"
              defaultValue={search.q}
              placeholder="Ej.: María Quispe"
              maxLength={100}
            />
          </div>
          {!fixedRole && (
            <div>
              <label htmlFor="rol" className="mb-2 block text-sm font-medium">
                Rol
              </label>
              <select
                id="rol"
                name="rol"
                defaultValue={search.rol}
                className={selectClass}
              >
                <option value="">Todos</option>
                {allowed.map((r) => (
                  <option key={r} value={r}>
                    {roleLabels[r]}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label htmlFor="estado" className="mb-2 block text-sm font-medium">
              Estado
            </label>
            <select
              id="estado"
              name="estado"
              defaultValue={search.estado}
              className={selectClass}
            >
              <option value="todos">Todos</option>
              <option value="activos">Activos</option>
              <option value="inactivos">Inactivos</option>
            </select>
          </div>
          <Button>
            <Search size={16} /> Buscar
          </Button>
        </form>
        {!emailsAvailable && (
          <p className="mt-3 text-xs text-amber-800">
            Los correos no se muestran porque falta{" "}
            <code>SUPABASE_SERVICE_ROLE_KEY</code> en el servidor.
          </p>
        )}
      </Card>
      <p className="mb-3 text-sm text-muted-foreground" aria-live="polite">
        {rows.length} {rows.length === 1 ? "usuario" : "usuarios"}
      </p>
      <Card className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-5 py-3">Usuario</th>
              <th className="px-5 py-3">Rol</th>
              <th className="px-5 py-3">Estado</th>
              <th className="px-5 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => (
              <tr key={u.id} className="border-t border-border align-middle">
                <td className="px-5 py-3">
                  <p className="font-medium">{u.fullName || "Sin nombre"}</p>
                  <p className="text-xs text-muted-foreground">
                    {[u.email, u.ci && `CI ${u.ci}`]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </td>
                <td className="px-5 py-3">{roleLabels[u.rol]}</td>
                <td className="px-5 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${u.activo ? "bg-emerald-50 text-emerald-800" : "bg-slate-100 text-slate-600"}`}
                  >
                    {u.activo ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-2">
                    {!allowed.includes(u.rol) ? (
                      <span className="text-xs text-muted-foreground">
                        Solo Dirección
                      </span>
                    ) : null}
                    {allowed.includes(u.rol) && mode !== "desactivar" && (
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/panel/usuarios/editar?id=${u.id}`}>
                          <Pencil size={14} /> Editar
                        </Link>
                      </Button>
                    )}
                    {allowed.includes(u.rol) && mode !== "editar" && (
                      <ActiveToggle user={u} self={u.id === selfId} compact />
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td
                  colSpan={4}
                  className="px-5 py-10 text-center text-muted-foreground"
                >
                  No hay usuarios con esos criterios.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </>
  );
}
