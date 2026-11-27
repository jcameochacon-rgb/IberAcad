import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  ArrowUpRight,
  ArrowRight,
  Building2,
  Images,
  History,
  MapPin,
} from "lucide-react";
import { PublicPage } from "@/components/public-page";

export const metadata: Metadata = {
  title: "Unidad Educativa Iberdrola A · El Alto",
  description:
    "Conoce la Unidad Educativa Iberdrola A, su historia y ubicación en El Alto. Accede al sistema académico de Primaria.",
};

const windows = [
  [
    Building2,
    "/el-colegio",
    "El colegio",
    "Datos de la institución y el sistema académico.",
  ],
  [Images, "/galeria", "Galería", "Fotografías de nuestra vida escolar."],
  [
    History,
    "/historia",
    "Historia",
    "Los orígenes de la unidad educativa en Senkata.",
  ],
  [
    MapPin,
    "/contacto",
    "Contacto",
    "Dirección, teléfono y redes de la escuela.",
  ],
] as const;

export default function Home() {
  return (
    <PublicPage current="/">
      <section className="public-hero">
        <div className="hero-orb hero-orb-one" aria-hidden="true" />
        <div className="hero-orb hero-orb-two" aria-hidden="true" />
        <div className="hero-layout mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 sm:px-10 sm:py-24 lg:grid-cols-[1.08fr_1fr]">
          <div>
            <p className="mb-7 flex items-center gap-2 text-xs font-semibold uppercase tracking-[.2em]">
              <span className="size-2 rounded-full bg-[#267cc2]" />
              El Alto · La Paz · Bolivia
            </p>
            <p className="hero-eyebrow">ESTUDIO · PATRIA · LIBERTAD</p>
            <h1 className="text-5xl font-semibold leading-[1.04] tracking-[-.055em] sm:text-7xl xl:text-[86px]">
              Unidad Educativa
              <br />
              <span className="text-[#2169a3]">Iberdrola A.</span>
            </h1>
            <p className="mt-7 max-w-md text-lg leading-8 text-[#586b80]">
              Un espacio para aprender, crecer y mantener cerca a nuestra
              comunidad educativa.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/el-colegio"
                className="inline-flex items-center gap-3 rounded-full bg-[#102e57] px-6 py-4 text-sm font-semibold text-white hover:bg-[#1c487e]"
              >
                Conoce el colegio <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
            <p className="mt-5 max-w-md text-xs leading-5 text-[#586b80]">
              La información del colegio es pública. Para consultar datos
              académicos necesitas una cuenta institucional.
            </p>
          </div>
          <div className="hero-photography relative pb-10 lg:pl-4">
            <div className="hero-photo-frame relative aspect-[4/4.1] overflow-hidden rounded-[2rem] bg-slate-200 shadow-2xl shadow-blue-950/15">
              <Image
                src="/colegio/colegio2.jpg"
                alt="Celebración del Día del Niño en el patio de Iberdrola A"
                fill
                preload
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-[58%_center]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#082553]/85 via-transparent to-transparent" />
              <div className="absolute bottom-28 left-7 right-7 text-white">
                <p className="mb-3 text-xs uppercase tracking-[.2em] text-blue-100">
                  La vida en nuestra escuela
                </p>
                <p className="text-3xl font-semibold tracking-tight">
                  Grandes momentos.
                  <br />
                  Recuerdos compartidos.
                </p>
              </div>
            </div>
            <div className="hero-floating-card absolute -bottom-1 left-3 flex max-w-[90%] items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-xl sm:left-[-12px]">
              <Image
                src="/colegio/colegio.jpg"
                alt="Estudiantes reunidos en el patio cubierto"
                width={516}
                height={387}
                className="h-20 w-24 rounded-xl object-cover"
              />
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">
                  Nuestra comunidad
                </p>
                <p className="mt-1 font-semibold">Aprender nos acerca.</p>
                <a
                  href="/galeria"
                  className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-blue-800"
                >
                  Ver fotografías <ArrowUpRight size={14} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section data-reveal className="texture-dots">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-blue-700">
            Explora la escuela
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Todo en un solo lugar.
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {windows.map(([Icon, href, title, body]) => (
              <Link
                key={href}
                href={href}
                className="window-card group flex flex-col rounded-3xl bg-white p-7"
              >
                <span className="flex size-12 items-center justify-center rounded-2xl bg-[#102e57] text-white">
                  <Icon size={22} aria-hidden="true" />
                </span>
                <h3 className="mt-6 text-xl font-semibold">{title}</h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-[#586b80]">
                  {body}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-800">
                  Abrir <ArrowRight size={16} aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PublicPage>
  );
}
