"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Users,
  UsersRound,
  GraduationCap,
  UserRound,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  ChartNoAxesCombined,
  FileChartColumn,
  ChevronDown,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Brand } from "./brand";
import { logout } from "@/app/actions";
import { roleLabels, roles, type Module } from "@iberdrola/shared";
import type { PanelModel } from "@/lib/data/model";
import {
  sectionsForRole,
  sectionTitles,
  titles,
  allowedActions,
  actionLabel,
  workspaceHref,
  moduleAt,
  readAction,
  type WorkspaceModule,
} from "@/lib/workspace-navigation";
const icons = {
  usuarios: Users,
  estudiantes: GraduationCap,
  docentes: UserRound,
  tutores: UserRound,
  familias: Users,
  personal: UserRound,
  cursos: BookOpen,
  asignaciones: ClipboardCheck,
  matriculas: UsersRound,
  asignaturas: BookOpen,
  horarios: CalendarDays,
  asistencia: ClipboardCheck,
  calificaciones: ChartNoAxesCombined,
  informes: FileChartColumn,
};
export function PanelShell(props: {
  model: PanelModel;
  current?: Module | "gestion" | "informes";
  children: React.ReactNode;
}) {
  const pathname = usePathname(),
    search = useSearchParams();
  return (
    <WorkspaceContent key={`${pathname}?${search.toString()}`} {...props} />
  );
}
function WorkspaceContent({
  model,
  children,
}: {
  model: PanelModel;
  current?: Module | "gestion" | "informes";
  children: React.ReactNode;
}) {
  const pathname = usePathname(),
    search = useSearchParams(),
    router = useRouter();
  const active = moduleAt(pathname, search.get("modulo")),
    action = readAction(
      search.get("accion"),
      pathname.endsWith("/registro")
        ? "registrar"
        : pathname.startsWith("/panel/gestion/") && search.has("id")
          ? "editar"
          : "consultar",
    );
  const roleSections = sectionsForRole(model.role);
  const selected = roleSections.find(
    (s) => active && s.children.includes(active),
  )?.id;
  const [openGroup, setGroup] = useState<string | null>(selected || null),
    [openSub, setSub] = useState<string | null>(active),
    [mobile, setMobile] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null),
    aside = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!mobile) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    aside.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobile(false);
        menuButton.current?.focus();
      }
      if (e.key === "Tab") {
        const nodes = Array.from(
          aside.current?.querySelectorAll<HTMLElement>(
            "a[href],button,select",
          ) || [],
        ).filter((n) => n.offsetParent !== null);
        const first = nodes[0],
          last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", key);
    };
  }, [mobile]);
  const actions = (module: WorkspaceModule) => (
    <div className="nav-actions">
      {allowedActions(model.role, module).map((a) => (
        <Link
          key={a}
          href={workspaceHref(model.role, module, a, model.demo)}
          aria-current={active === module && action === a ? "page" : undefined}
          onClick={() => setMobile(false)}
        >
          {actionLabel(module, a)}
        </Link>
      ))}
    </div>
  );
  return (
    <div className="workspace-shell">
      {mobile && (
        <button
          className="workspace-overlay"
          aria-label="Cerrar navegación"
          onClick={() => {
            setMobile(false);
            menuButton.current?.focus();
          }}
        />
      )}
      <aside
        ref={aside}
        className={`workspace-sidebar ${mobile ? "is-open" : ""}`}
        aria-label="Menú lateral"
      >
        <div className="sidebar-brand">
          <Link
            className="sidebar-brand-link"
            href={model.demo ? `/demo?rol=${model.role}` : "/panel"}
            aria-label="IberAcad: volver al resumen"
            aria-current={!active ? "page" : undefined}
            onClick={() => {
              setMobile(false);
              setGroup(null);
              setSub(null);
            }}
          >
            <Brand />
          </Link>
          <button
            className="mobile-only icon-button"
            aria-label="Cerrar menú"
            onClick={() => setMobile(false)}
          >
            <X size={21} />
          </button>
        </div>
        <div className="sidebar-caption">MI ESPACIO ACADÉMICO</div>
        <nav aria-label="Módulos académicos">
          {roleSections.map((s) => {
            const Icon = icons[s.id],
              expanded = openGroup === s.id;
            return (
              <section key={s.id} className="nav-section">
                <button
                  className={`nav-main ${selected === s.id ? "is-active" : ""}`}
                  aria-expanded={expanded}
                  aria-controls={`nav-${s.id}`}
                  onClick={() => {
                    setGroup(expanded ? null : s.id);
                    setSub(null);
                  }}
                >
                  <Icon size={20} />
                  <span>{sectionTitles[s.id]}</span>
                  <ChevronDown className={expanded ? "turned" : ""} size={16} />
                </button>
                <NavDisclosure id={`nav-${s.id}`} open={expanded}>
                  {s.children.length === 1 ? (
                    actions(s.children[0])
                  ) : (
                    <div className="nav-branches">
                      {s.children.map((m) => {
                        if (s.id === "usuarios" && m === "usuarios")
                          return (
                            <div key={m} className="nav-direct-actions">
                              {actions(m)}
                            </div>
                          );
                        const Child = icons[m];
                        const label =
                          m === "usuarios"
                            ? "Gestionar usuarios"
                            : m === "tutores"
                              ? "Vinculación familiar"
                              : m === "familias"
                                ? "Cuentas familiares"
                                : m === "asignaturas" && s.id === "asignaturas"
                                  ? "Gestionar asignaturas"
                                  : m === "asignaturas"
                                    ? "Consultar asignaturas"
                                    : m === "estudiantes" &&
                                        s.id === "estudiantes"
                                      ? "Gestionar estudiantes"
                                      : m === "estudiantes"
                                        ? "Consultar estudiantes"
                                        : m === "horarios"
                                          ? "Consultar horarios"
                                          : m === "calificaciones"
                                            ? "Consultar notas"
                                            : titles[m];
                        return (
                          <div key={m}>
                            <button
                              className="nav-sub"
                              aria-expanded={openSub === m}
                              aria-controls={`sub-${m}`}
                              onClick={() => setSub(openSub === m ? null : m)}
                            >
                              <Child size={17} />
                              <span>{label}</span>
                              <ChevronDown
                                size={14}
                                className={openSub === m ? "turned" : ""}
                              />
                            </button>
                            <NavDisclosure id={`sub-${m}`} open={openSub === m}>
                              {actions(m)}
                            </NavDisclosure>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </NavDisclosure>
              </section>
            );
          })}
        </nav>
        <div className="sidebar-end">
          <div className="sidebar-term">
            Primaria · Turno tarde
            <span>Gestión {model.year || "por configurar"}</span>
          </div>
        </div>
      </aside>
      <div className="workspace-body">
        <header className="workspace-topbar">
          <div className="workspace-account">
            {model.demo ? (
              <Link className="workspace-logout" href="/login">
                <LogOut size={17} />
                <span>Salir de la demo</span>
              </Link>
            ) : (
              <form action={logout} className="workspace-logout-form">
                <button className="workspace-logout" aria-label="Cerrar sesión">
                  <LogOut size={17} />
                  <span>Cerrar sesión</span>
                </button>
              </form>
            )}
            <div
              className="profile-dropdown"
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setProfileOpen(false);
                  e.currentTarget.querySelector("button")?.focus();
                }
              }}
              onMouseEnter={() => {
                if (matchMedia("(hover: hover)").matches) setProfileOpen(true);
              }}
              onMouseLeave={() => setProfileOpen(false)}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget))
                  setProfileOpen(false);
              }}
            >
              <button
                type="button"
                className="workspace-profile"
                aria-expanded={profileOpen}
                aria-controls="profile-menu"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                {model.avatarUrl ? (
                  <Image
                    unoptimized
                    width={42}
                    height={42}
                    src={model.avatarUrl}
                    alt="Mi foto de perfil"
                    className="profile-avatar profile-photo"
                  />
                ) : (
                  <span className="profile-avatar">
                    {model.name
                      .split(" ")
                      .slice(0, 2)
                      .map((n) => n[0])
                      .join("")}
                  </span>
                )}
                <div>
                  <strong>{model.name}</strong>
                  <small>{roleLabels[model.role]}</small>
                </div>
              </button>
              {!model.demo && (
                <div
                  id="profile-menu"
                  className="profile-dropdown-menu"
                  style={{ display: profileOpen ? "block" : "none" }}
                >
                  <Link href="/panel/perfil">Mi perfil →</Link>
                </div>
              )}
            </div>
          </div>
          <div className="workspace-heading">
            <button
              ref={menuButton}
              className="mobile-only icon-button"
              aria-label="Abrir menú"
              aria-expanded={mobile}
              onClick={() => setMobile(true)}
            >
              <Menu size={23} />
            </button>
          </div>
        </header>
        {model.demo && (
          <div className="demo-toolbar">
            <p>Demostración · Datos ficticios, sin acceso a cuentas reales</p>
            <label>
              Ver como
              <select
                value={model.role}
                onChange={(e) => router.push(`/demo?rol=${e.target.value}`)}
              >
                {roles
                  .filter((r) => r !== "PADRE")
                  .map((r) => (
                    <option key={r} value={r}>
                      {roleLabels[r]}
                    </option>
                  ))}
              </select>
            </label>
          </div>
        )}
        <main className="workspace-content">{children}</main>
      </div>
    </div>
  );
}

function NavDisclosure({
  id,
  open,
  children,
}: {
  id: string;
  open: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      id={id}
      className="nav-collapse"
      data-open={open}
      aria-hidden={!open}
      inert={!open}
    >
      <div className="nav-collapse-inner">{children}</div>
    </div>
  );
}
