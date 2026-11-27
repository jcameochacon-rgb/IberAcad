import Link from "next/link";
import {
  Users,
  BookOpen,
  ClipboardCheck,
  ChartNoAxesCombined,
  ArrowRight,
  CalendarDays,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import { PanelShell } from "@/components/panel-shell";
import { panelHref } from "@/lib/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RecordsTable } from "@/components/records-table";
import { roleScope, type Module } from "@iberdrola/shared";
import type { PanelModel } from "@/lib/data/model";
export function Dashboard({ model }: { model: PanelModel }) {
  const stats = [
    {
      label:
        model.role === "PADRE"
          ? "Hijos vinculados"
          : model.role === "ESTUDIANTE"
            ? "Ficha personal"
            : "Estudiantes registrados",
      value: model.studentCount,
      icon: Users,
      detail: "Fichas activas visibles",
      color: "bg-blue-100 text-blue-800",
    },
    {
      label: "Cursos disponibles",
      value: model.courseCount,
      icon: BookOpen,
      detail: "En la gestión seleccionada",
      color: "bg-blue-50 text-blue-700",
    },
    {
      label: "Notas publicadas",
      value: model.publishedGrades,
      icon: ChartNoAxesCombined,
      detail: "Calificaciones trimestrales",
      color: "bg-violet-50 text-violet-700",
    },
    {
      label: "Marcas de asistencia",
      value: model.attendanceCount,
      icon: ClipboardCheck,
      detail: "Registros visibles en la gestión",
      color: "bg-amber-50 text-amber-700",
    },
  ];
  return (
    <PanelShell model={model}>
      <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-xs text-muted-foreground">
            {roleScope[model.role]}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Tu escuela, en perspectiva<span className="text-primary">.</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Una mirada al aprendizaje y a la actividad académica.
          </p>
        </div>
        <Badge className="gap-2 border border-border bg-white px-3 py-2 text-muted-foreground">
          <CalendarDays size={14} />
          Gestión {model.year || "sin configurar"}
        </Badge>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card className="stat-card p-5" key={stat.label}>
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-medium text-muted-foreground">
                {stat.label}
              </p>
              <span
                className={`flex size-9 items-center justify-center rounded-xl ${stat.color}`}
              >
                <stat.icon size={17} />
              </span>
            </div>
            <p className="mt-4 text-3xl font-semibold tracking-tight">
              {stat.value}
            </p>
            <p className="mt-3 text-[10px] text-muted-foreground">
              {stat.detail}
            </p>
          </Card>
        ))}
      </div>
      <section className="learning-banner relative mt-6 overflow-hidden rounded-2xl bg-[#e5edff] p-6 lg:p-7">
        <div className="absolute -right-12 -top-14 hidden size-64 rounded-full border-[35px] border-[#d1ddf9] sm:block" />
        <div className="relative max-w-xl">
          <p className="text-[10px] font-bold uppercase tracking-[.18em] text-primary">
            Acompañamos cada paso
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight">
            El aprendizaje también se cuida con información.
          </h2>
          <p className="mt-3 max-w-lg text-xs leading-6 text-[#52688e]">
            Consulta calificaciones y asistencia para seguir el avance de los
            estudiantes y acompañarlos a tiempo.
          </p>
          <Link
            className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-primary"
            href={panelHref(model, "calificaciones")}
          >
            Consultar calificaciones
            <ArrowRight size={15} />
          </Link>
        </div>
      </section>
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-6">
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between gap-3 p-5">
              <div>
                <h2 className="text-sm font-semibold">
                  Calificaciones recientes
                </h2>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Resultados y evaluaciones pendientes
                </p>
              </div>
              <Link
                className="flex items-center gap-1 text-xs font-semibold text-primary"
                href={panelHref(model, "calificaciones")}
              >
                Ver todas
                <ArrowUpRight size={14} />
              </Link>
            </div>
            <RecordsTable listing={model.listings.calificaciones} compact />
          </Card>
          <div>
            <h2 className="mb-4 text-sm font-semibold">Accesos rápidos</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {(
                [
                  {
                    module: "estudiantes",
                    icon: Users,
                    text:
                      model.role === "PADRE"
                        ? "Consultar mis hijos"
                        : "Ver estudiantes",
                  },
                  {
                    module: "asistencia",
                    icon: ClipboardCheck,
                    text: "Consultar asistencia",
                  },
                  {
                    module: "horarios",
                    icon: CalendarDays,
                    text: "Ver horarios",
                  },
                ] satisfies {
                  module: Module;
                  icon: typeof Users;
                  text: string;
                }[]
              ).map((item) => (
                <Link
                  href={panelHref(model, item.module)}
                  key={item.module}
                  className="group flex items-center gap-3 rounded-xl border border-border bg-white p-4 text-xs font-semibold hover:border-primary/40"
                >
                  <item.icon className="text-primary" size={19} />
                  {item.text}
                  <ArrowUpRight
                    className="ml-auto text-muted-foreground group-hover:text-primary"
                    size={15}
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="min-w-0 space-y-6">
          <Card className="p-5">
            <h2 className="text-sm font-semibold">Periodos de evaluación</h2>
            <div className="mt-4 space-y-3">
              {model.terms.map((term) => (
                <div
                  key={term.number}
                  className="flex items-center justify-between text-xs"
                >
                  <span>{term.number}° trimestre</span>
                  <Badge
                    className={
                      term.state === "ABIERTO"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-muted text-muted-foreground"
                    }
                  >
                    {term.state === "ABIERTO"
                      ? "Abierto"
                      : term.state === "CERRADO"
                        ? "Cerrado"
                        : "Planificado"}
                  </Badge>
                </div>
              ))}
              {!model.terms.length && (
                <p className="text-xs text-muted-foreground">
                  No hay trimestres configurados.
                </p>
              )}
            </div>
          </Card>
          <p className="flex items-start gap-2 px-1 text-[10px] leading-5 text-muted-foreground">
            <ShieldCheck size={14} className="mt-0.5 shrink-0" />
            {model.demo
              ? "Esta demo muestra ejemplos ficticios de cada rol."
              : "Solo se muestra información autorizada para tu cuenta."}
          </p>
        </div>
      </div>
    </PanelShell>
  );
}
