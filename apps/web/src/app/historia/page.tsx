import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { PublicPage, PageHero } from "@/components/public-page";
import { school } from "@/lib/school";

export const metadata: Metadata = {
  title: "Historia",
  description:
    "Reseña histórica de la Unidad Educativa Iberdrola en Senkata, El Alto.",
};

export default function Historia() {
  return (
    <PublicPage current="/historia">
      <PageHero
        title="Historia"
        lead="Un recorrido por los orígenes de la unidad educativa en Senkata, El Alto."
      />
      <section className="texture-lines">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-6 py-16 sm:px-10 sm:py-24 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
          <div>
            <p className="text-lg leading-8">
              Una reseña publicada en 2023 sitúa el origen de la Unidad
              Educativa Iberdrola en Senkata el 1 de marzo de 2002. Describe su
              crecimiento y la posterior organización en las secciones A y B.
            </p>
            <p className="mt-5 text-base leading-7 text-[#586b80]">
              La misma reseña recuerda la participación de su comunidad en
              actividades deportivas, musicales y artísticas.
            </p>
            <div className="mt-7 border-l-2 border-[#6b9ac9] pl-5">
              <p className="text-xs leading-6 text-[#586b80]">
                Referencia histórica del blog sobre Iberdrola B, no una
                certificación de la fecha de creación independiente de Iberdrola
                A. Los logros específicos de la sección B no se atribuyen aquí a
                la sección A.
              </p>
              <a
                href={school.historyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 text-sm font-semibold underline underline-offset-4"
              >
                Leer la reseña histórica{" "}
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </div>
          </div>
          <figure className="history-photo overflow-hidden rounded-[1.75rem] border border-white bg-white shadow-xl shadow-blue-950/10">
            <div className="flex items-center justify-center bg-gradient-to-br from-[#dce9fb] to-[#f3f7ff] p-6 sm:p-10">
              <Image
                src="/colegio/edificio.jpg"
                alt="Edificio de la unidad educativa con banderas"
                width={400}
                height={200}
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="h-auto w-full max-w-[640px] rounded-xl object-contain"
              />
            </div>
            <figcaption className="px-6 py-5 sm:px-10">
              <p className="text-xs uppercase tracking-widest text-blue-700">
                Senkata · El Alto
              </p>
              <p className="mt-1.5 text-xl font-semibold">
                Un lugar en nuestra historia.
              </p>
            </figcaption>
          </figure>
        </div>
      </section>
    </PublicPage>
  );
}
