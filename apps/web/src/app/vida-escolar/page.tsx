import { ScrollExperience } from "@/components/scroll-experience";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { PublicNav } from "@/components/public-nav";
export const metadata = { title: "Vida escolar" };
export default function Page() {
  return (
    <>
      <PublicNav />
      <main>
        <ScrollExperience
          scene="vida-escolar"
          title="La vida que compartimos"
        />
        <h1 className="mx-auto max-w-7xl px-6 pt-16 text-4xl font-semibold">
          Vida escolar
        </h1>
        <section
          id="galeria"
          className="mx-auto max-w-7xl scroll-mt-8 px-6 py-16 sm:px-10 sm:py-24"
        >
          <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.2em] text-blue-700">
                Nuestra vida escolar
              </p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                Una escuela que se vive.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-slate-500">
              Encuentros, cultura y espacios que forman parte de nuestra
              comunidad. Abre cada fotografía para verla completa.
            </p>
          </div>
          <div className="grid items-start gap-5 md:grid-cols-3">
            {[
              [
                "colegio.jpg",
                "Nuestra escuela",
                "Espacios de Iberdrola A",
                "04",
              ],
              ["colegio2.jpg", "Somos comunidad", "Encuentro escolar", "05"],
              [
                "edificio.jpg",
                "Un lugar para aprender",
                "Edificio de la institución",
                "06",
              ],
              [
                "colegio3.jpg",
                "Cultura que nos une",
                "Encuentro de la comunidad con vestimenta tradicional",
                "01",
              ],
              [
                "colegio4.jpg",
                "Momentos para compartir",
                "Estudiantes y familias reunidos en el patio",
                "02",
              ],
              [
                "colegio5.jpg",
                "Un patio lleno de vida",
                "Vista del patio cubierto durante una actividad escolar",
                "03",
              ],
            ].map(([file, title, alt, number]) => (
              <a
                key={file}
                href={`/colegio/${file}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${title}: abrir fotografía completa en otra pestaña`}
                className="photo-card group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-shadow hover:shadow-xl"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={`/colegio/${file}`}
                    alt={alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-105"
                  />
                </div>
                <div className="flex items-center justify-between gap-3 p-5">
                  <div>
                    <p className="mb-2 text-xs text-blue-600">
                      {number} / IBERDROLA A
                    </p>
                    <h3 className="font-semibold">{title}</h3>
                  </div>
                  <ArrowUpRight size={20} aria-hidden="true" />
                </div>
              </a>
            ))}
          </div>
        </section>
        <section className="editorial-section">
          <p className="eyebrow">APRENDER TAMBIÉN ES COMPARTIR</p>
          <h2>Talentos que crecen juntos.</h2>
          <div className="editorial-grid">
            <article>
              <h3>Cultura e identidad</h3>
              <p>
                La vestimenta, la música y los encuentros escolares acercan a
                las familias a la vida de la escuela.
              </p>
            </article>
            <article>
              <h3>Deporte y convivencia</h3>
              <p>
                El juego en equipo invita a colaborar, respetar las reglas y
                celebrar el esfuerzo de cada estudiante.
              </p>
            </article>
            <article>
              <h3>Familias presentes</h3>
              <p>
                Con IberAcad puedes acompañar el aprendizaje, consultar la
                asistencia y conocer el avance académico según tu vínculo y tus
                permisos.
              </p>
            </article>
          </div>
        </section>
      </main>
    </>
  );
}
