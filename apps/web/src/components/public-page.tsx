import type { ReactNode } from "react";
import { VisualMotion } from "@/components/visual-motion";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";

/** Estructura común de las ventanas públicas: menú, contenido y pie. */
export function PublicPage({
  current,
  children,
}: {
  current?: string;
  children: ReactNode;
}) {
  return (
    <VisualMotion>
      <div className="school-home min-h-screen text-[#102e57]">
        <a
          href="#contenido"
          className="sr-only z-50 rounded bg-white p-3 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Saltar al contenido
        </a>
        <PublicHeader current={current} />
        <main id="contenido">{children}</main>
        <PublicFooter />
      </div>
    </VisualMotion>
  );
}

/** Banda superior de cada ventana, . */
export function PageHero({
  eyebrow,
  title,
  accent,
  lead,
}: {
  eyebrow?: string;
  title: string;
  accent?: string;
  lead: string;
}) {
  return (
    <section className="public-hero">
      <div className="hero-orb hero-orb-one" aria-hidden="true" />
      <div className="hero-orb hero-orb-two" aria-hidden="true" />
      <div className="hero-layout mx-auto max-w-7xl px-6 pb-14 pt-8 sm:px-10 sm:pb-20">
        {eyebrow && <p className="hero-eyebrow">{eyebrow}</p>}
        <h1 className="max-w-3xl text-4xl font-semibold leading-[1.06] tracking-[-.045em] sm:text-6xl">
          {title}
          {accent && (
            <>
              <br />
              <span>{accent}</span>
            </>
          )}
        </h1>
        <p className="page-hero-lead mt-6 max-w-xl text-lg leading-8">{lead}</p>
      </div>
    </section>
  );
}
