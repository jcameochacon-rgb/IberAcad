import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { PublicPage, PageHero } from "@/components/public-page";

export const metadata: Metadata = {
  title: "Galería",
  description:
    "Fotografías de la vida escolar en la Unidad Educativa Iberdrola A.",
};

const photos = [
  [
    "colegio5.jpg",
    "Un patio lleno de vida",
    "Vista del patio cubierto durante una actividad escolar",
    "01",
    "md:col-span-2 md:row-span-2",
    "(max-width: 768px) 100vw, 66vw",
  ],
  [
    "colegio3.jpg",
    "Cultura que nos une",
    "Encuentro de la comunidad con vestimenta tradicional",
    "02",
    "",
    "(max-width: 768px) 100vw, 33vw",
  ],
  [
    "colegio4.jpg",
    "Momentos para compartir",
    "Estudiantes y familias reunidos en el patio",
    "03",
    "",
    "(max-width: 768px) 100vw, 33vw",
  ],
];

export default function Galeria() {
  return (
    <PublicPage current="/galeria">
      <PageHero
        title="Galería"
        lead="Encuentros, cultura y espacios que forman parte de nuestra comunidad. Abre cada fotografía para verla completa."
      />
      <section className="texture-dots">
        <div className="mx-auto max-w-[1400px] px-6 py-16 sm:px-10 sm:py-20">
          <div className="grid gap-5 md:h-[640px] md:grid-cols-3 md:grid-rows-2">
            {photos.map(([file, title, alt, number, span, sizes]) => (
              <a
                key={file}
                href={`/colegio/${file}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${title}: abrir fotografía completa en otra pestaña`}
                className={`photo-card group relative block aspect-[4/3] overflow-hidden bg-slate-200 transition-shadow hover:shadow-xl md:aspect-auto md:h-full ${span}`}
              >
                <Image
                  src={`/colegio/${file}`}
                  alt={alt}
                  fill
                  sizes={sizes}
                  className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-[#06193d]/90 via-[#06193d]/50 to-transparent p-5 pt-16 text-white sm:p-7 sm:pt-20">
                  <div>
                    <p className="mb-1.5 text-xs tracking-wider text-blue-100">
                      {number} / IBERDROLA A
                    </p>
                    <h3 className="text-lg font-semibold sm:text-xl">
                      {title}
                    </h3>
                  </div>
                  <ArrowUpRight
                    size={22}
                    aria-hidden="true"
                    className="shrink-0"
                  />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </PublicPage>
  );
}
