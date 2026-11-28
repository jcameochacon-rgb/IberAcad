import { ScrollExperience } from "@/components/scroll-experience";

import { school } from "@/lib/school";
import { PublicNav } from "@/components/public-nav";
export const metadata = { title: "Nuestra institución" };
export default function Page() {
  return (
    <>
      <PublicNav />
      <main>
        <ScrollExperience scene="institucion" title="Nuestra institución" />
        <h1 className="mx-auto max-w-7xl px-6 pt-16 text-4xl font-semibold">
          Nuestra institución
        </h1>
        <section
          id="colegio"
          className="school-facts scroll-mt-6 border-y border-[#102e57]/10 bg-white/60"
        >
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
        <section className="editorial-section">
          <p className="eyebrow">UNA ESCUELA, MUCHAS POSIBILIDADES</p>
          <h2>Aprender con sentido de comunidad.</h2>
          <div className="editorial-grid">
            <article>
              <h3>Estudiantes protagonistas</h3>
              <p>
                Cada aprendizaje se construye con participación, curiosidad y
                esfuerzo. Nuestra comunidad es el punto de encuentro entre el
                aula y la familia.
              </p>
            </article>
            <article>
              <h3>Acompañamiento familiar</h3>
              <p>
                La escuela y el hogar comparten el compromiso de acompañar a los
                estudiantes. IberAcad facilita la consulta de información
                académica autorizada.
              </p>
            </article>
            <article>
              <h3>Una gestión cercana</h3>
              <p>
                Docentes y personal administrativo organizan horarios,
                asistencia y calificaciones para dar continuidad al trabajo
                escolar.
              </p>
            </article>
          </div>
        </section>
      </main>
    </>
  );
}
