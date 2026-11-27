import { PublicNav } from "./public-nav";
import type { ReactNode } from "react";
import {
  Award,
  CalendarDays,
  ChartNoAxesCombined,
  ClipboardCheck,
  GraduationCap,
} from "lucide-react";
import { Brand } from "@/components/brand";
const features = [
  { icon: GraduationCap, title: "Estudiantes y cursos", body: "Fichas, tutores y matrículas" },
  { icon: CalendarDays, title: "Horarios", body: "Periodos y clases de cada curso" },
  { icon: ClipboardCheck, title: "Asistencia", body: "Pasar lista y consultar faltas" },
  { icon: Award, title: "Calificaciones", body: "Notas por materia y trimestre" },
  { icon: ChartNoAxesCombined, title: "Informes", body: "Reportes para imprimir o descargar" },
];

export function AuthShell({
  children,
  compact = false,
}: {
  children: ReactNode;
  compact?: boolean;
}) {
  return (
    <>
      <PublicNav />
      <main
        className={`auth-layout min-h-screen bg-background lg:grid lg:grid-cols-[1fr_1fr]${compact ? " auth-layout-compact" : ""}`}
      >
        <aside className="auth-art relative hidden overflow-hidden p-12 text-white lg:flex lg:flex-col lg:justify-center">
          <div className="absolute -right-32 top-28 size-[520px] rounded-full border border-white/5" />
          <div className="absolute -right-10 top-52 size-[330px] rounded-full border border-white/5" />
          <div className="relative">
            <div className="auth-logo-box">
              <Brand />
            </div>
            <div className="auth-art-copy">
              <p className="auth-art-eyebrow">Sistema de gestión académica</p>
              <h1 className="auth-art-title">
                Inicio de <span>sesión.</span>
              </h1>
              <p className="auth-art-lead">
                IberAcad organiza el trabajo diario de la escuela: Dirección y
                Secretaría administran, los docentes registran, y las familias
                y estudiantes consultan lo que les corresponde.
              </p>
              <ul className="auth-features">
                {features.map(({ icon: Icon, title, body }) => (
                  <li key={title}>
                    <span className="auth-feature-icon" aria-hidden="true">
                      <Icon size={20} />
                    </span>
                    <span>
                      <strong>{title}</strong>
                      <small>{body}</small>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
        <section className="flex min-h-screen flex-col justify-center px-6 py-10 sm:px-14">
          <div
            className={`auth-card mx-auto w-full max-w-md${compact ? " auth-card-compact" : ""}`}
          >
            <div
              className={
                compact ? "auth-mobile-brand lg:hidden" : "mb-12 lg:hidden"
              }
            >
              <Brand />
            </div>
            {children}
            <p className="mt-12 text-center text-xs text-muted-foreground">
              Primaria · 14:00 a 18:05 · La Paz, Bolivia
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
