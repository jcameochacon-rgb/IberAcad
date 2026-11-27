import { SocialIcon } from "@/components/social-icon";
import Image from "next/image";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { school, socialLinks } from "@/lib/school";

/** Pie común de todas las ventanas públicas: contacto, redes y mapa de Google. */
export function PublicFooter() {
  const socials = socialLinks();
  const head =
    "flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.16em] text-[#a8d6ff]";
  return (
    <footer className="bg-[#102247] px-6 pb-5 pt-8 text-white sm:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-[1.1fr_1fr_1.1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/colegio/iberdrola_escudo.jpg"
                alt="Escudo de la Unidad Educativa Iberdrola A"
                width={436}
                height={458}
                className="h-11 w-11 rounded-lg bg-white object-contain"
              />
              <div>
                <p className="font-bold tracking-tight">Iberdrola A.</p>
                <p className="text-[10px] uppercase tracking-[.18em] text-[#b9cbe6]">
                  Unidad Educativa
                </p>
              </div>
            </div>
            <p className="mt-3 text-xs leading-5 text-[#c7d7eb]">
              Primaria · Turno tarde · El Alto, La Paz, Bolivia.
            </p>
          </div>
          <div>
            <h3 className={head}>
              <MapPin size={14} aria-hidden="true" />
              Dirección
            </h3>
            <p className="mt-2 text-sm font-medium">{school.address}</p>
            <p className="text-xs text-[#c7d7eb]">El Alto, La Paz, Bolivia</p>
            <a
              href={school.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold underline underline-offset-4"
            >
              Abrir en Google Maps <ArrowUpRight size={13} aria-hidden="true" />
            </a>
          </div>
          <div>
            <h3 className={head}>
              <Phone size={14} aria-hidden="true" />
              Comunicación
            </h3>
            <a
              className="mt-2 inline-block text-lg font-medium hover:underline"
              href={`tel:+591${school.phone}`}
            >
              {school.phone}
            </a>
            {school.email && (
              <a
                className="mt-1 flex items-center gap-2 break-all text-xs hover:underline"
                href={`mailto:${school.email}`}
              >
                <Mail size={13} aria-hidden="true" className="shrink-0" />
                {school.email}
              </a>
            )}
            {socials.length > 0 && (
              <ul className="mt-2 flex flex-wrap gap-2">
                {socials.map(([name, url]) => (
                  <li key={name}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/30 px-3 py-1 text-xs font-semibold hover:bg-white hover:text-[#102247]"
                    >
                      <SocialIcon name={name} size={13} />
                      {name}
                      <ArrowUpRight size={12} aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="overflow-hidden rounded-xl border border-white/20 bg-[#0b1a38]">
            <iframe
              title="Mapa de Google: ubicación de la Unidad Educativa Iberdrola A"
              src={school.mapEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="block h-32 w-full border-0 lg:h-full lg:min-h-[8.5rem]"
            />
          </div>
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/15 pt-3 text-xs">
          <p className="font-semibold">U.E. Iberdrola A · El Alto</p>
        </div>
        <details className="mt-5 text-xs leading-6 text-[#b9cbe6]">
          <summary className="cursor-pointer font-medium">
            Fuentes de información y alcance
          </summary>
          <p className="mt-3">
            Información consultada el 9 de octubre de 2026. Las fuentes son
            referencias externas; su contenido no equivale a una validación
            institucional. Las fotografías fueron proporcionadas para esta
            portada; los registros académicos permanecen dentro del sistema.
          </p>
          <ul className="mt-2 list-inside list-disc">
            <li>
              <a
                href={school.directoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                UnidadEducativa.net: ficha de Iberdrola A
              </a>{" "}
              — identificación, niveles, dirección y teléfono.
            </li>
            <li>
              <a
                href={school.historyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                Blog: Historia de la Unidad Educativa Iberdrola
              </a>{" "}
              — reseña publicada el 24 de septiembre de 2023.
            </li>
          </ul>
          <p className="mt-2">
            El alcance de Primaria y el turno tarde corresponden a la
            configuración acordada para este proyecto. El escudo del colegio y
            el logo IberAcad son las imágenes facilitadas para este proyecto.
          </p>
        </details>
      </div>
    </footer>
  );
}
