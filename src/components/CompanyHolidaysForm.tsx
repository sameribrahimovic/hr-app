"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CompanyHoliday } from "@prisma/client";
import { Plus, Pencil, Trash2, Repeat2, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { PageHeader } from "@/components/PageHeader";
import { SettingsNav } from "@/components/SettingsNav";
import { EmptyState } from "@/components/EmptyState";
import { addCompanyHoliday, updateCompanyHoliday, deleteCompanyHoliday } from "@/lib/actions/admin-actions";
import { formatDate } from "@/lib/utils";
import { dateKey } from "@/lib/time-off";
import { toast } from "sonner";
export default function CompanyHolidaysForm({ initialHolidays }: { initialHolidays: CompanyHoliday[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<CompanyHoliday | "new" | null>(null);
  const [deleting, setDeleting] = useState<CompanyHoliday | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  function open(holiday: CompanyHoliday | "new") { setEditing(holiday); setError(""); }
  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setPending(true); setError("");
    const values = new FormData(event.currentTarget);
    const data = { name: String(values.get("name")), date: new Date(String(values.get("date")) + "T00:00:00.000Z"), isRecurring: values.get("recurring") === "on" };
    try {
      if (editing && editing !== "new") await updateCompanyHoliday({ ...data, id: editing.id }); else await addCompanyHoliday(data);
      toast.success("Praznik je sačuvan."); setEditing(null); router.refresh();
    } catch { setError("Praznik nije sačuvan. Proverite podatke i pokušajte ponovo."); } finally { setPending(false); }
  }
  async function remove() {
    if (!deleting) return; setPending(true); setError("");
    try { await deleteCompanyHoliday(deleting.id); toast.success("Praznik je uklonjen."); setDeleting(null); router.refresh(); }
    catch { setError("Praznik nije uklonjen. Pokušajte ponovo."); } finally { setPending(false); }
  }
  const current = editing && editing !== "new" ? editing : null;
  const holidays = [...initialHolidays].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  return <div className="page-stack">
    <PageHeader title="Praznici i neradni dani" description="Ovi dani se automatski izuzimaju iz novih zahteva za odsustvo." action={<Button onClick={() => open("new")}><Plus className="size-4" />Dodaj praznik</Button>} /><SettingsNav active="/admin/company-settings/holidays" />
    <section className="surface">{holidays.length ? <ul className="divide-y">{holidays.map(holiday => <li key={holiday.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex min-w-0 gap-3"><span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary"><CalendarDays className="size-5" /></span><div><h2 className="break-words text-sm font-semibold">{holiday.name}</h2><p className="mt-1 text-sm text-muted-foreground">{formatDate(holiday.date)}</p>{holiday.isRecurring && <p className="mt-2 flex items-center gap-1 text-xs text-primary"><Repeat2 className="size-3.5" />Ponavlja se svake godine</p>}</div></div><div className="flex gap-2"><Button variant="outline" size="sm" onClick={() => open(holiday)} aria-label={"Uredi praznik " + holiday.name}><Pencil className="size-4" />Uredi</Button><Button variant="ghost" size="icon" onClick={() => { setDeleting(holiday); setError(""); }} aria-label={"Ukloni praznik " + holiday.name}><Trash2 className="size-4 text-destructive" /></Button></div></li>)}</ul> : <EmptyState title="Dodajte prvi neradni dan." description="Unesite praznike i druge neradne dane koje vaš tim ne troši kao dane odsustva." action={<Button variant="outline" onClick={() => open("new")}>Dodaj praznik</Button>} />}</section>
    <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">Za praznike sa fiksnim datumom uključite godišnje ponavljanje. Praznike čiji se datum menja dodajte zasebno za svaku godinu.</p>
    <Dialog open={!!editing} onOpenChange={value => { if (!value && !pending) setEditing(null); }}><DialogContent><DialogHeader><DialogTitle>{current ? "Uredite praznik" : "Dodajte neradni dan"}</DialogTitle><DialogDescription>Podešavanje važi za sve članove firme.</DialogDescription></DialogHeader><form key={current?.id || "new"} onSubmit={save} className="space-y-5"><fieldset disabled={pending} className="space-y-5"><div><label htmlFor="holiday-name" className="field-label">Naziv praznika</label><Input id="holiday-name" name="name" defaultValue={current?.name} required maxLength={100} placeholder="Npr. Nova godina" /></div><div><label htmlFor="holiday-date" className="field-label">Datum</label><Input id="holiday-date" type="date" name="date" defaultValue={current ? dateKey(current.date) : ""} required /></div><label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm"><input type="checkbox" name="recurring" defaultChecked={current?.isRecurring} className="size-5 accent-primary" />Ponavlja se na isti datum svake godine</label></fieldset>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}<DialogFooter><Button type="button" variant="outline" disabled={pending} onClick={() => setEditing(null)}>Odustani</Button><Button type="submit" disabled={pending}>{pending ? "Čuvanje..." : "Sačuvaj praznik"}</Button></DialogFooter></form></DialogContent></Dialog>
    <Dialog open={!!deleting} onOpenChange={value => { if (!value && !pending) setDeleting(null); }}><DialogContent><DialogHeader><DialogTitle>Ukloniti praznik?</DialogTitle><DialogDescription>{deleting?.name} više neće biti izuzet iz obračuna novih zahteva. Ranije poslati zahtevi ostaju nepromenjeni.</DialogDescription></DialogHeader>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}<DialogFooter><Button variant="outline" disabled={pending} onClick={() => setDeleting(null)}>Odustani</Button><Button variant="destructive" disabled={pending} onClick={remove}>{pending ? "Uklanjanje..." : "Ukloni praznik"}</Button></DialogFooter></DialogContent></Dialog>
  </div>;
}
