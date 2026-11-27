import Link from "next/link";
import { KeyRound } from "lucide-react";
import { loadUnlinkedPeople } from "@/lib/data/users";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

/** Fichas de un tipo que aún no tienen cuenta de acceso, con botón para crearla. */
export async function UnlinkedPeople({
  kind,
  title,
  lead,
}: {
  kind: "DOCENTE" | "PADRE" | "ESTUDIANTE";
  title: string;
  lead: string;
}) {
  const people = (await loadUnlinkedPeople()).filter((p) =>
    p.kinds.includes(kind),
  );
  return (
    <Card className="mt-8 overflow-hidden">
      <div className="border-b border-border p-5">
        <h2 className="text-lg font-semibold">
          {title}{" "}
          <span className="text-muted-foreground">({people.length})</span>
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{lead}</p>
      </div>
      {people.length ? (
        <ul className="divide-y divide-border">
          {people.map((p) => (
            <li
              key={p.id}
              className="flex flex-wrap items-center gap-3 px-5 py-3"
            >
              <span className="flex-1 text-sm font-medium">{p.label}</span>
              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs text-amber-800">
                Sin cuenta
              </span>
              <Button asChild size="sm" variant="outline">
                <Link href={`/panel/usuarios/nuevo?persona=${p.id}`}>
                  <KeyRound size={14} /> Crear acceso
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="px-5 py-6 text-sm text-muted-foreground">
          Todas las fichas ya tienen cuenta.
        </p>
      )}
    </Card>
  );
}
