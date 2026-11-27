import Link from "next/link";
import type { Module } from "@iberdrola/shared";
import { loadPanel } from "@/lib/data/live";
import { PanelShell } from "@/components/panel-shell";
import { PageTitle } from "@/components/page-title";
import { LinkTable, type LinkRow } from "@/components/link-table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/** Ventana del panel con una tabla filtrable de registros y su acción. */
export async function ListPage({
  current,
  eyebrow,
  title,
  lead,
  columns,
  load,
  action,
  empty,
  searchLabel,
  denied,
  extra,
}: {
  current?: Module;
  eyebrow: string;
  title: string;
  lead: string;
  columns: { key: string; label: string; filter?: boolean }[];
  load: () => Promise<LinkRow[] | null>;
  action?: string;
  empty: string;
  searchLabel?: string;
  denied?: string;
  extra?: { href: string; label: string };
}) {
  const model = await loadPanel();
  const rows = await load();
  return (
    <PanelShell model={model} current={current}>
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs text-muted-foreground">{eyebrow}</p>
          <PageTitle fallback={title} />
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            {lead}
          </p>
        </div>
        {extra && (
          <Button asChild variant="outline">
            <Link href={extra.href}>{extra.label}</Link>
          </Button>
        )}
      </div>
      {rows ? (
        <Card className="overflow-hidden">
          <LinkTable
            columns={columns}
            rows={rows}
            action={action}
            empty={empty}
            searchLabel={searchLabel}
          />
        </Card>
      ) : (
        <Card className="p-6 text-sm text-muted-foreground">{denied}</Card>
      )}
    </PanelShell>
  );
}
