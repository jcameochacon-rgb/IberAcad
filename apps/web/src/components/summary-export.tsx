"use client";
import type { PanelModel } from "@/lib/data/model";
import { Download } from "lucide-react";
export function SummaryExport({ model }: { model: PanelModel }) {
  return (
    <button
      className="summary-export portal-button"
      onClick={() => {
        if (window.ReactNativeWebView) {
          const rows = [
            [
              model.role === "PADRE"
                ? "Hijos vinculados"
                : model.role === "ESTUDIANTE"
                  ? "Ficha personal"
                  : "Estudiantes visibles",
              String(model.studentCount),
            ],
            [
              model.role === "PADRE" || model.role === "ESTUDIANTE"
                ? "Cursos vinculados"
                : "Cursos visibles",
              String(model.courseCount),
            ],
            ["Calificaciones publicadas", String(model.publishedGrades)],
            ["Registros de asistencia", String(model.attendanceCount)],
          ];
          for (const list of [
            model.listings.asistencia,
            model.listings.calificaciones,
            model.listings.horarios,
          ]) {
            rows.push([
              list.title,
              `${list.rows.length} registros cargados de ${list.total}`,
            ]);
            for (const r of list.rows.slice(0, 5))
              rows.push([
                list.title,
                list.columns
                  .map((c) => `${c.label}: ${r.cells[c.key] ?? "—"}`)
                  .join(" · "),
              ]);
          }
          window.ReactNativeWebView.postMessage(
            JSON.stringify({
              type: "iberacad.report.pdf",
              title: "Resumen académico",
              subtitle: `${model.name} · Gestión ${model.year} · ${new Date().toLocaleDateString("es-BO")}`,
              columns: ["Indicador / sección", "Información"],
              rows,
            }),
          );
        } else window.print();
      }}
    >
      <Download size={17} />
      Generar PDF del resumen
    </button>
  );
}
