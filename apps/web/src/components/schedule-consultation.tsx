"use client";
import { useState } from "react";
import { CalendarDays, List } from "lucide-react";
import { type ScheduleSheet, weekdays } from "@/lib/schedule-validation";
import { RecordsTable } from "./records-table";
import { TableToolbar, emptyTableFilters } from "./table-toolbar";
import { filterTableRows } from "@/lib/table-filters";
import type { TableRow } from "@/lib/data/model";
export function ScheduleConsultation({ sheet }: { sheet: ScheduleSheet }) {
  const [filters, setFilters] = useState(emptyTableFilters);
  const [view, setView] = useState("week");
  const columns = [
    { key: "day", label: "Día" },
    { key: "period", label: "Periodo" },
    { key: "time", label: "Horario" },
    { key: "subject", label: "Asignatura" },
    { key: "teacher", label: "Docente" },
  ];
  const rows: TableRow[] = sheet.horarios.map((h) => {
    const p = sheet.periodos.find((p) => p.id === h.periodo_id);
    const a = sheet.asignaciones.find((a) => a.id === h.asignacion_docente_id);
    return {
      id: h.id,
      cells: {
        day: weekdays[h.dia_semana - 1],
        period: p?.numero || "—",
        time:
          p?.hora_inicio && p.hora_fin
            ? `${p.hora_inicio.slice(0, 5)}–${p.hora_fin.slice(0, 5)}`
            : "Sin configurar",
        subject: a?.nombre || "Materia no visible para tu rol",
        teacher: a?.docente || "No disponible",
      },
    };
  });
  const visible = filterTableRows(rows, filters);
  const options = columns
    .filter((c) => c.key !== "time")
    .map((c) => ({
      ...c,
      options: Array.from(
        new Set(rows.map((r) => String(r.cells[c.key]))),
      ).sort((a, b) => a.localeCompare(b, "es", { numeric: true })),
    }));
  return (
    <div className="crud-surface mb-6">
      <div className="flex flex-wrap items-center justify-between gap-3 p-5">
        <h2 className="font-semibold">Horario del curso</h2>
        <div className="flex gap-2">
          {[
            ["week", "Semana", CalendarDays],
            ["list", "Lista", List],
          ].map(([key, label, Icon]) => {
            const I = Icon as typeof List;
            return (
              <button
                type="button"
                key={String(key)}
                aria-pressed={view === key}
                onClick={() => setView(String(key))}
                className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm ${view === key ? "border-blue-200 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-600"}`}
              >
                <I size={16} />
                {String(label)}
              </button>
            );
          })}
        </div>
      </div>
      <TableToolbar
        title="horario"
        filters={filters}
        onChange={setFilters}
        count={visible.length}
        options={options}
      />
      {view === "list" ? (
        <RecordsTable
          showToolbar={false}
          listing={{
            title: "Horario",
            description: "",
            rows: visible,
            columns,
            total: visible.length,
          }}
        />
      ) : (
        <div className="grid gap-3 p-4 lg:grid-cols-5">
          {weekdays
            .filter((day) => !filters.values.day || filters.values.day === day)
            .map((day) => (
              <section
                key={day}
                className="min-w-0 rounded-2xl border border-slate-100 bg-slate-50/70 p-3"
              >
                <h3 className="mb-4 border-b border-slate-200 pb-3 text-sm font-semibold">
                  {day}
                </h3>
                <ol className="space-y-3">
                  {visible
                    .filter((r) => r.cells.day === day)
                    .map((r) => (
                      <li
                        key={r.id}
                        className="rounded-xl border border-blue-100 bg-white p-3 shadow-sm"
                      >
                        <p className="text-xs text-blue-600">
                          {r.cells.period} · {r.cells.time}
                        </p>
                        <p className="mt-2 break-words text-sm font-semibold">
                          {r.cells.subject}
                        </p>
                        <p className="mt-2 break-words text-xs text-slate-500">
                          {r.cells.teacher}
                        </p>
                      </li>
                    ))}
                </ol>
                {!visible.some((r) => r.cells.day === day) && (
                  <p className="py-5 text-xs leading-5 text-slate-400">
                    Sin bloques que coincidan.
                  </p>
                )}
              </section>
            ))}
        </div>
      )}
    </div>
  );
}
