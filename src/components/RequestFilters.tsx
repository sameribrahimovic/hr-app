import Link from "next/link";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { leaveTypes, requestStatuses } from "@/lib/labels";
import { queryHref, type FilterParams } from "@/lib/filters";
export function RequestFilters({ base, params, admin = false }: { base: string; params: FilterParams; admin?: boolean }) {
  return <div className="space-y-4">
    <nav aria-label="Filter po statusu" className="flex flex-wrap gap-2">{[["", "Svi zahtevi"], ...Object.entries(requestStatuses)].map(([value, label]) => <Link key={value} href={queryHref(base, params, { status: value, page: "" })} aria-current={(params.status || "") === value ? "page" : undefined} className={"inline-flex min-h-11 items-center rounded-xl border px-3.5 text-sm font-medium " + ((params.status || "") === value ? "border-primary bg-secondary text-primary" : "border-transparent bg-card text-muted-foreground hover:border-border")}>{label}</Link>)}</nav>
    <form action={base} method="get" className="surface p-4">
      {params.status && <input type="hidden" name="status" value={params.status} />}
      <div className="flex flex-col gap-3 sm:flex-row"><div className="relative flex-1"><label htmlFor="request-search" className="sr-only">Pretraži zahteve</label><Search className="absolute left-3 top-4 size-4 text-muted-foreground" /><Input id="request-search" name="search" defaultValue={params.search} placeholder={admin ? "Ime zaposlenog ili napomena..." : "Pretraži svoje napomene..."} className="pl-10" /></div><Button type="submit" variant="outline">Pretraži</Button></div>
      <details className="mt-2" open={!!(params.from || params.to || params.type)}><summary className="flex min-h-11 w-fit cursor-pointer items-center gap-2 text-sm text-muted-foreground"><SlidersHorizontal className="size-4" />Vrsta odsustva i period</summary><div className="grid items-end gap-3 pt-2 sm:grid-cols-2 xl:grid-cols-4"><div><label htmlFor="request-type" className="field-label">Vrsta odsustva</label><select id="request-type" name="type" defaultValue={params.type || ""} className="h-12 w-full rounded-xl border border-input bg-card px-3 text-base"><option value="">Sve vrste</option>{Object.entries(leaveTypes).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div><div><label htmlFor="request-from" className="field-label">Od datuma</label><Input type="date" id="request-from" name="from" defaultValue={params.from} /></div><div><label htmlFor="request-to" className="field-label">Do datuma</label><Input type="date" id="request-to" name="to" defaultValue={params.to} /></div><Button type="submit">Primeni filtere</Button></div></details>
      {(params.search || params.from || params.to || params.type) && <Link href={queryHref(base, { status: params.status })} className="mt-2 inline-flex min-h-11 items-center text-sm text-primary">Ukloni dodatne filtere</Link>}
    </form>
  </div>;
}
