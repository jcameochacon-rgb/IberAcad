import { Brand } from "./brand";
import { LoaderCircle, ShieldCheck } from "lucide-react";
export function AcademicLoading() {
  return (
    <main className="academic-loading" aria-busy="true">
      <div className="academic-loading-card" role="status" aria-live="polite">
        <Brand />
        <div className="academic-loading-orbit" aria-hidden="true">
          <LoaderCircle
            size={36}
            className="animate-spin motion-reduce:animate-none"
          />
        </div>
        <p className="text-xs font-semibold uppercase tracking-[.18em] text-blue-600">
          Tu espacio académico
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
          Preparando tu información
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Estamos cargando la página solicitada.
          <br />
          Un momento, por favor.
        </p>
        <div className="academic-loading-track" aria-hidden="true">
          <span />
        </div>
        <p className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
          <ShieldCheck size={15} />
          Acceso seguro según tu perfil
        </p>
      </div>
    </main>
  );
}
