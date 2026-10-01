import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { queryHref, type FilterParams } from "@/lib/filters";
export function Pagination({ base, params, page, total, size = 10 }: { base: string; params: FilterParams; page: number; total: number; size?: number }) {
  if (total <= size) return null;
  const pages = Math.ceil(total / size);
  return <nav aria-label="Stranice rezultata" className="flex flex-wrap items-center justify-between gap-3 border-t p-4"><p className="text-xs text-muted-foreground">{(page - 1) * size + 1}–{Math.min(page * size, total)} od {total}</p><div className="flex items-center gap-2">{page > 1 ? <Button asChild variant="outline" size="icon"><Link aria-label="Prethodna stranica" href={queryHref(base, params, { page: String(page - 1) })}><ChevronLeft className="size-4" /></Link></Button> : <Button variant="outline" size="icon" disabled aria-label="Prethodna stranica"><ChevronLeft className="size-4" /></Button>}<span className="px-1 text-xs text-muted-foreground">{page} / {pages}</span>{page < pages ? <Button asChild variant="outline" size="icon"><Link aria-label="Sledeća stranica" href={queryHref(base, params, { page: String(page + 1) })}><ChevronRight className="size-4" /></Link></Button> : <Button variant="outline" size="icon" disabled aria-label="Sledeća stranica"><ChevronRight className="size-4" /></Button>}</div></nav>;
}
