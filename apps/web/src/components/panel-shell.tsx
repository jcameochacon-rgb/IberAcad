"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Users,
  BookOpen,
  ClipboardCheck,
  ChartNoAxesCombined,
  CalendarDays,
  ShieldCheck,
  GraduationCap,
  Award,
  ChevronDown,
  LogOut,
  Menu,
  X,
  ChevronRight,
  FlaskConical,
  ArrowUpRight,
  House,
  KeyRound,
  Megaphone,
} from "lucide-react";
import { Brand } from "@/components/brand";
import { logout } from "@/app/actions";
import {
  roleLabels,
  roleScope,
  roles,
  moduleLabels,
  type Module,
} from "@iberdrola/shared";
import type { PanelModel } from "@/lib/data/model";
import { cn } from "@/lib/utils";
import {
  resolveNav,
  activeNav,
  panelHref,
  type NavIcon,
} from "@/lib/navigation";
import { ActiveNavLabel } from "@/components/page-title";
const icons: Record<NavIcon, typeof Users> = {
  inicio: House,
  cuenta: KeyRound,
  comunicados: Megaphone,
  usuarios: ShieldCheck,
  estudiantes: GraduationCap,
  docentes: Users,
  asignaturas: BookOpen,
  horarios: CalendarDays,
  asistencia: ClipboardCheck,
  calificaciones: Award,
  reportes: ChartNoAxesCombined,
};
export function PanelShell({
  model,
  current,
  children,
}: {
  model: PanelModel;
  current?: Module | "gestion" | "informes";
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const groups = resolveNav(model);
  const active = activeNav(groups, pathname);
  const [toggled, setToggled] = useState<Record<string, boolean>>({});

  return (
    <div className="academic-shell min-h-screen lg:grid lg:grid-cols-[242px_minmax(0,1fr)]">
      {open && (
        <button
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          aria-label="Cerrar menú"
          onClick={() => setOpen(false)}
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-[242px] flex-col overflow-y-auto academic-sidebar p-5 transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-1 pt-3">
          <Link
            href={panelHref(model)}
            onClick={() => setOpen(false)}
            aria-label="IberAcad, ir al inicio del panel"
          >
            <Brand />
          </Link>
          <button
            className="rounded p-1 text-slate-600 lg:hidden"
            onClick={() => setOpen(false)}
            aria-label="Cerrar menú"
          >
            <X size={18} />
          </button>
        </div>
        <p className="mb-3 mt-12 px-3 text-[10px] font-semibold uppercase tracking-[.18em] text-slate-400">
          Mi espacio académico
        </p>
        <nav className="space-y-1" aria-label="Navegación principal">
          {groups.map((group) => {
            const Icon = icons[group.icon];
            const isActiveGroup = active?.group.id === group.id;
            const expanded = toggled[group.id] ?? isActiveGroup;
            const panelId = `submenu-${group.id}`;
            if (group.direct) {
              const item = group.items[0];
              return (
                <Link
                  key={group.id}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActiveGroup ? "page" : undefined}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm transition-colors",
                    isActiveGroup
                      ? "bg-white font-semibold text-blue-800 shadow-sm"
                      : "text-slate-600 hover:bg-white/70",
                  )}
                >
                  <Icon size={18} className="shrink-0" />
                  <span className="min-w-0 flex-1">{group.label}</span>
                </Link>
              );
            }
            return (
              <div key={group.id}>
                <button
                  type="button"
                  aria-expanded={expanded}
                  aria-controls={panelId}
                  onClick={() =>
                    setToggled((previous) => ({
                      ...previous,
                      [group.id]: !expanded,
                    }))
                  }
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm transition-colors",
                    isActiveGroup
                      ? "bg-white font-semibold text-blue-800 shadow-sm"
                      : "text-slate-600 hover:bg-white/70",
                  )}
                >
                  <Icon size={18} className="shrink-0" />
                  <span className="min-w-0 flex-1">{group.label}</span>
                  <ChevronDown
                    size={15}
                    aria-hidden="true"
                    className={cn(
                      "shrink-0 transition-transform",
                      expanded && "rotate-180",
                    )}
                  />
                </button>
                {expanded && (
                  <ul
                    id={panelId}
                    className="ml-[26px] mt-1 space-y-0.5 border-l border-blue-200 pl-3"
                  >
                    {group.items.map((item) => {
                      const isActive =
                        active?.group.id === group.id &&
                        active.item.path === item.path;
                      return (
                        <li key={item.path}>
                          <Link
                            href={item.href}
                            onClick={() => setOpen(false)}
                            aria-current={isActive ? "page" : undefined}
                            className={cn(
                              "block rounded-md px-3 py-2 text-[13px] transition-colors",
                              isActive
                                ? "bg-blue-600/10 font-semibold text-blue-800"
                                : "text-slate-600 hover:bg-white/70",
                            )}
                          >
                            {item.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </nav>
        <div className="mt-auto space-y-5 pt-10">
          <div className="rounded-xl border border-white/80 bg-white/50 p-4">
            <p className="text-xs font-semibold text-slate-700">
              Primaria · Turno tarde
            </p>
            <p className="mt-1 text-xs text-slate-400">14:00 a 18:05</p>
            <div className="mt-3 flex items-center gap-2 text-[10px] text-blue-700">
              <span className="size-1.5 rounded-full bg-blue-500" />
              Gestión {model.year || "por configurar"}
            </div>
          </div>
        </div>
      </aside>
      <div className="min-w-0">
        <header className="academic-topbar sticky top-0 z-30 flex min-h-20 items-center justify-between gap-4 border-b border-border bg-white px-5 lg:px-9">
          <div className="flex items-center gap-3">
            <button
              className="rounded p-2 lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Abrir menú"
            >
              <Menu size={21} />
            </button>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Iberdrola A</span>
              <ChevronRight size={12} />
              <span className="font-medium text-foreground">
                {active
                  ? active.group.direct
                    ? active.group.label
                    : `${active.group.label} · ${active.item.label}`
                  : current === "informes"
                    ? "Informes"
                    : current === "gestion"
                      ? "Gestión académica"
                      : current
                        ? moduleLabels[current]
                        : pathname.startsWith("/panel/cuenta")
                          ? "Mi cuenta · Cambiar contraseña"
                          : "Inicio"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <p className="max-w-[190px] truncate text-xs font-semibold">
                {model.name}
              </p>
              <p className="mt-1 text-[10px] text-muted-foreground">
                {roleLabels[model.role]}
              </p>
            </div>
            {model.demo ? (
              <Link
                href="/login"
                className="ml-1 inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted"
              >
                <LogOut size={15} aria-hidden="true" />
                <span className="hidden sm:inline">Salir de la demo</span>
                <span className="sr-only sm:hidden">Salir de la demo</span>
              </Link>
            ) : (
              <form action={logout}>
                <button
                  type="submit"
                  className="ml-1 inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted"
                >
                  <LogOut size={15} aria-hidden="true" />
                  <span className="hidden sm:inline">Cerrar sesión</span>
                  <span className="sr-only sm:hidden">Cerrar sesión</span>
                </button>
              </form>
            )}
          </div>
        </header>
        {model.demo && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200 bg-amber-50 px-5 py-3 text-xs text-amber-950 lg:px-9">
            <p className="flex items-center gap-2">
              <FlaskConical size={15} />
              <span>
                <strong>Demostración visual.</strong> Datos ficticios; no es una
                sesión real.
              </span>
            </p>
            <div className="flex items-center gap-2">
              <label htmlFor="demo-role" className="font-medium">
                Ver como
              </label>
              <select
                id="demo-role"
                value={model.role}
                onChange={(e) => {
                  router.push(
                    `/demo${current ? `/${current}` : ""}?rol=${encodeURIComponent(e.target.value)}`,
                  );
                }}
                className="rounded-md border border-amber-300 bg-white px-2 py-1"
              >
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {roleLabels[r]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
        <main className="academic-content mx-auto max-w-[1460px] px-5 py-7 lg:px-9 lg:py-9">
          <ActiveNavLabel.Provider
            value={active && !active.group.direct ? active.item.label : null}
          >
            {children}
          </ActiveNavLabel.Provider>
        </main>
        <footer className="flex flex-wrap justify-between gap-2 px-5 pb-6 text-[10px] text-muted-foreground lg:px-9">
          <p>U.E. Iberdrola A · Primaria</p>
          <p className="flex items-center gap-1">
            {roleScope[model.role]}
            <ArrowUpRight size={11} />
          </p>
        </footer>
      </div>
    </div>
  );
}
