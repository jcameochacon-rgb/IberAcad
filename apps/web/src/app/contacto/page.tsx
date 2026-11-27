import type { Metadata } from "next";
import { SocialIcon } from "@/components/social-icon";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { PublicPage, PageHero } from "@/components/public-page";
import { school, socialLinks } from "@/lib/school";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Dirección, teléfono y redes de la Unidad Educativa Iberdrola A.",
};

export default function Contacto() {
  const socials = socialLinks();
  return (
    <PublicPage current="/contacto">
      <PageHero
        title="Contacto"
        lead="Encuentra dónde estamos y cómo comunicarte con la unidad educativa."
      />
      <section className="texture-dots">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-16 sm:px-10 md:grid-cols-3">
          <article className="school-card rounded-3xl bg-white p-8 shadow-lg shadow-blue-950/10">
            <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[.18em] text-blue-700">
              <MapPin size={16} aria-hidden="true" /> Dirección
            </h2>
            <p className="mt-5 text-xl font-semibold">{school.address}</p>
            <p className="mt-1 text-sm text-[#586b80]">
              El Alto, La Paz, Bolivia
            </p>
            <a
              href={school.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#102e57] px-5 py-3 text-sm font-semibold text-white hover:bg-[#1c487e]"
            >
              Ver en Maps <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </article>
          <article className="school-card rounded-3xl bg-white p-8 shadow-lg shadow-blue-950/10">
            <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[.18em] text-blue-700">
              <Phone size={16} aria-hidden="true" /> Comunicación
            </h2>
            <a
              className="mt-5 inline-block text-3xl font-semibold hover:underline"
              href={`tel:+591${school.phone}`}
            >
              {school.phone}
            </a>
            {school.email && (
              <a
                className="mt-3 flex items-center gap-2 break-all text-sm hover:underline"
                href={`mailto:${school.email}`}
              >
                <Mail size={15} aria-hidden="true" className="shrink-0" />
                {school.email}
              </a>
            )}
            <p className="mt-5 text-xs leading-5 text-[#586b80]">
              Datos del directorio, no verificados directamente con el colegio.
              Confirma su vigencia al comunicarte.
            </p>
          </article>
          {socials.length > 0 && (
            <article className="school-card rounded-3xl bg-white p-8 shadow-lg shadow-blue-950/10">
              <h2 className="text-xs font-semibold uppercase tracking-[.18em] text-blue-700">
                Redes sociales
              </h2>
              <ul className="mt-5 flex flex-wrap gap-2">
                {socials.map(([name, url]) => (
                  <li key={name}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-[#102e57]/25 px-4 py-2 text-sm font-semibold hover:bg-[#102e57] hover:text-white"
                    >
                      <SocialIcon name={name} size={16} />
                      {name} <ArrowUpRight size={14} aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </article>
          )}
        </div>
      </section>
    </PublicPage>
  );
}
