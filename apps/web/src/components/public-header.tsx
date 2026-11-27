import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

export const publicNav = [
  { href: "/el-colegio", label: "El colegio" },
  { href: "/galeria", label: "Galería" },
  { href: "/historia", label: "Historia" },
  { href: "/contacto", label: "Contacto" },
] as const;

/** Menú público compartido por la portada, sus páginas y el inicio de sesión. */
export function PublicHeader({ current }: { current?: string }) {
  return (
    <header className="public-header">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-5 sm:px-10">
        <Link
          href="/"
          aria-label="Iberdrola A, página principal"
          className="flex items-center gap-3"
        >
          <Image
            src="/colegio/iberdrola_escudo.jpg"
            loading="eager"
            alt="Escudo de la Unidad Educativa Iberdrola A"
            width={436}
            height={458}
            className="h-14 w-14 rounded-lg bg-white object-contain"
          />
          <span>
            <span className="block text-lg font-bold tracking-tight">
              Iberdrola A.
            </span>
            <span className="block text-[10px] uppercase tracking-[.18em]">
              Unidad Educativa
            </span>
          </span>
        </Link>
        <nav
          aria-label="Navegación pública"
          className="order-3 flex w-full gap-6 overflow-x-auto text-sm sm:order-none sm:w-auto"
        >
          {publicNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={current === item.href ? "page" : undefined}
              className="py-2 hover:underline"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/login"
          aria-current={current === "/login" ? "page" : undefined}
          className="inline-flex items-center gap-2 rounded-full bg-[#102e57] px-5 py-3 text-sm font-semibold text-white hover:bg-[#1c487e]"
        >
          Iniciar sesión <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </div>
    </header>
  );
}
