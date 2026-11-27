import type { ReactNode } from "react";
import { ArrowUpRight, BookOpen, ShieldCheck, Users } from "lucide-react";
import { Brand } from "@/components/brand";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";

const features: [typeof BookOpen, string][] = [
  [BookOpen, "Calificaciones y asistencia"],
  [Users, "Escuela y familias conectadas"],
  [ShieldCheck, "Acceso según tu rol"],
];

/**
 * Ventana de acceso: tarjeta azul con el mensaje del colegio a la izquierda y
 * tarjeta de ingreso a la derecha. Ocupa la pantalla; el pie queda debajo.
 */
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="school-home auth-page text-[#102e57]">
      <div className="auth-screen">
        <PublicHeader current="/login" />
        <main id="contenido" className="auth2-layout">
          <aside className="auth2-art">
            <span className="auth2-ring auth2-ring-lg" aria-hidden="true" />
            <span className="auth2-ring auth2-ring-sm" aria-hidden="true" />
            <div className="auth2-brand">
              <Brand />
            </div>
            <div className="relative">
              <p className="auth2-eyebrow">Primaria comunitaria vocacional</p>
              <p className="auth2-title">
                Cada estudiante.
                <br />
                Cada avance.
                <br />
                <span>Un mismo lugar.</span>
              </p>
              <p className="auth2-lead">
                Información académica organizada para acompañar el aprendizaje y
                acercar a la escuela con las familias.
              </p>
              <ul className="auth2-features">
                {features.map(([Icon, label]) => (
                  <li key={label}>
                    <Icon size={19} aria-hidden="true" />
                    {label}
                  </li>
                ))}
              </ul>
            </div>
            <p className="auth2-note">
              U.E. Iberdrola A · Turno tarde{" "}
              <ArrowUpRight size={14} aria-hidden="true" />
            </p>
          </aside>
          <section className="auth2-side">
            <div className="auth-card auth2-card">
              <div className="auth2-mobile-brand">
                <Brand />
              </div>
              {children}
            </div>
          </section>
        </main>
      </div>
      <PublicFooter />
    </div>
  );
}
