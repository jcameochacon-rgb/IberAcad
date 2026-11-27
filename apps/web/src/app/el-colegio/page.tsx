import type { Metadata } from "next";
import { Clock3, GraduationCap, ShieldCheck } from "lucide-react";
import { Brand } from "@/components/brand";
import { PublicPage, PageHero } from "@/components/public-page";
import { school } from "@/lib/school";

export const metadata: Metadata = {
  title: "El colegio",
  description:
    "Datos de la Unidad Educativa Iberdrola A en El Alto: identificación, niveles y acceso al sistema académico de Primaria.",
};

export default function ElColegio() {
  return (
    <PublicPage current="/el-colegio">
      <PageHero
        title="El colegio"
        lead="Una unidad educativa fiscal de El Alto, pensada para aprender, crecer y mantener cerca a las familias."
      />
      <section className="school-facts border-y border-[#102e57]/10 bg-white/60">
        <div className="mx-auto grid max-w-7xl gap-7 px-6 py-10 sm:grid-cols-3 sm:px-10">
          {[
            ["01 / Institución", "Educación fiscal", "Iberdrola A · El Alto"],
            [
              "02 / Identificación",
              `RUE ${school.rue}`,
              "Código publicado en el directorio",
            ],
            [
              "03 / Niveles",
              "Inicial y Primaria",
              "Niveles indicados por el directorio",
            ],
          ].map(([tag, title, detail]) => (
            <div key={tag}>
              <p className="text-[10px] font-semibold uppercase tracking-[.16em] text-[#586b80]">
                {tag}
              </p>
              <h2 className="mt-3 text-xl font-semibold">{title}</h2>
              <p className="mt-2 text-sm text-[#586b80]">{detail}</p>
            </div>
          ))}
        </div>
      </section>
      <section
        data-reveal
        className="platform-section mx-4 my-12 rounded-[2rem] bg-[#102e57] text-[#f7f9fc] sm:mx-6"
      >
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:px-10 lg:grid-cols-2">
          <div>
            <div className="mb-8">
              <Brand dark />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#a8d6ff]">
              Un vínculo con las familias
            </p>
            <h2 className="mt-5 text-4xl font-medium leading-tight tracking-tight">
              La escuela, también
              <br />a un clic de distancia.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-[#c7d7eb]">
              El sistema de Primaria reúne calificaciones, asistencia y
              horarios. Cada cuenta consulta únicamente la información que le
              corresponde.
            </p>
          </div>
          <div className="space-y-6 lg:pt-4">
            {[
              [
                GraduationCap,
                "Primaria",
                "El alcance de esta plataforma académica es Primaria.",
              ],
              [
                Clock3,
                "Turno tarde",
                "Horario de referencia del proyecto: 14:00 a 18:05.",
              ],
              [
                ShieldCheck,
                "Acceso institucional",
                "Las cuentas y permisos son administrados por la institución.",
              ],
            ].map(([Icon, title, body]) => {
              const I = Icon as typeof GraduationCap;
              return (
                <div
                  key={String(title)}
                  className="flex gap-4 border-b border-white/15 pb-6"
                >
                  <I
                    className="mt-1 shrink-0 text-[#deeeff]"
                    size={23}
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="font-semibold">{String(title)}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#c7d7eb]">
                      {String(body)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </PublicPage>
  );
}
