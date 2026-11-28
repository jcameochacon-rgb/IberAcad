import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { school } from "@/lib/school";
import { PublicNav } from "@/components/public-nav";
export const metadata = { title: "Trayectoria institucional" };
export default function Page() {
  return (
    <>
      <PublicNav />
      <main>
        <h1 className="mx-auto max-w-7xl px-6 pt-16 text-4xl font-semibold">
          Trayectoria institucional
        </h1>
        <section
          id="historia"
          className="mx-auto grid max-w-7xl scroll-mt-8 gap-10 px-6 py-16 sm:px-10 sm:py-24 lg:grid-cols-[.8fr_1.2fr]"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#586b80]">
              Nuestra historia
            </p>
            <h2 className="mt-5 text-4xl font-medium leading-tight tracking-[-.04em] sm:text-5xl">
              Una comunidad
              <br />
              que crece
              <br />
              <span className="text-[#2169a3]">con su escuela.</span>
            </h2>
          </div>
          <div>
            <div className="mb-7 flex items-center gap-5 rounded-2xl border border-blue-100 bg-white p-4">
              <Image
                src="/colegio/edificio.jpg"
                alt="Edificio de la unidad educativa con banderas"
                width={400}
                height={200}
                className="w-1/2 rounded-lg object-contain"
              />
              <div>
                <p className="text-xs uppercase tracking-widest text-blue-700">
                  Senkata · El Alto
                </p>
                <p className="mt-2 text-lg font-semibold">
                  Un lugar en nuestra historia.
                </p>
              </div>
            </div>
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
        </section>
        <section className="editorial-section">
          <p className="eyebrow">MEMORIA DE NUESTRA COMUNIDAD</p>
          <h2>De los primeros pasos a nuevos capítulos.</h2>
          <div className="history-timeline">
            <article>
              <span>01 MAR 2002</span>
              <h3>Los primeros pasos en Senkata</h3>
              <p>
                La historia facilitada por la comunidad sitúa la fundación de
                Iberdrola el 1 de marzo de 2002. Recuerda una escuela pequeña,
                con pocos estudiantes y recursos limitados, que comenzó a
                hacerse un lugar en el distrito.
              </p>
            </article>
            <article>
              <span>CRECIMIENTO</span>
              <h3>Más aulas, más oportunidades</h3>
              <p>
                Con la llegada de más estudiantes se ampliaron los espacios y el
                equipamiento. La reseña describe la organización en las
                secciones A y B, conservando el nombre Iberdrola.
              </p>
            </article>
            <article>
              <span>ARTE Y DEPORTE</span>
              <h3>Talentos que dejan huella</h3>
              <p>
                Las actividades deportivas, musicales y artísticas forman parte
                de la memoria compartida. La reseña destaca la participación de
                estudiantes de primaria y secundaria en encuentros del distrito
                y de El Alto.
              </p>
            </article>
            <article>
              <span>2022 · IBERDROLA B</span>
              <h3>Una referencia musical de la comunidad</h3>
              <p>
                El documento relata que la banda de Iberdrola B obtuvo el primer
                lugar en un encuentro nacional en Cochabamba. Este logro
                corresponde a la sección B y se presenta como parte de la
                historia compartida, sin atribuirlo a Iberdrola A.
              </p>
            </article>
            <article>
              <span>HOY</span>
              <h3>Un nuevo capítulo con IberAcad</h3>
              <p>
                La información académica conecta a estudiantes, familias,
                docentes y administración. Una herramienta para acompañar el
                aprendizaje y conservar el camino recorrido.
              </p>
            </article>
          </div>
          <p className="text-sm text-slate-500">
            Fuente: Historia IberdrolaA, documento facilitado por la comunidad.
            Los relatos de tradición oral se distinguen de los hechos históricos
            documentados.
          </p>
        </section>
        <section className="editorial-section">
          <h2>Imágenes de nuestra memoria.</h2>
          <div className="editorial-grid">
            <figure>
              <Image
                src="/colegio/historia-image2.jpeg"
                width={700}
                height={500}
                alt="Fotografía incluida en la reseña histórica de Iberdrola"
                className="aspect-[4/3] w-full rounded-2xl object-cover"
              />
              <figcaption className="mt-3 text-sm text-slate-500">
                Archivo de la reseña compartida por la comunidad.
              </figcaption>
            </figure>
            <figure>
              <Image
                src="/colegio/historia-image3.jpeg"
                width={700}
                height={500}
                alt="Fotografía incluida en la reseña histórica de Iberdrola"
                className="aspect-[4/3] w-full rounded-2xl object-cover"
              />
              <figcaption className="mt-3 text-sm text-slate-500">
                Archivo de la reseña compartida por la comunidad.
              </figcaption>
            </figure>
            <figure>
              <Image
                src="/colegio/historia-image7.jpeg"
                width={700}
                height={500}
                alt="Fotografía incluida en la reseña histórica de Iberdrola"
                className="aspect-[4/3] w-full rounded-2xl object-cover"
              />
              <figcaption className="mt-3 text-sm text-slate-500">
                Archivo de la reseña compartida por la comunidad.
              </figcaption>
            </figure>
            <figure>
              <Image
                src="/colegio/historia-image8.jpeg"
                width={700}
                height={500}
                alt="Fotografía incluida en la reseña histórica de Iberdrola"
                className="aspect-[4/3] w-full rounded-2xl object-cover"
              />
              <figcaption className="mt-3 text-sm text-slate-500">
                Archivo de la reseña compartida por la comunidad.
              </figcaption>
            </figure>
          </div>
        </section>
      </main>
    </>
  );
}
