"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { TimeOffRequest, CompanyHoliday, TimeOffType } from "@prisma/client";
import { CalendarDays, Info, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/PageHeader";
import { createTimeOffRequest } from "@/lib/actions/employee-actions";
import { leaveTypes, daysLabel } from "@/lib/labels";
import { hasOverlap, leaveSummary, todayKey, weekdays } from "@/lib/time-off";
import { toast } from "sonner";
export default function TimeOffRequestForm({ existingRequests, companyHolidays, workingDays, availableDays }: { existingRequests: TimeOffRequest[]; companyHolidays: CompanyHoliday[]; workingDays: string[]; availableDays: number }) {
  const router = useRouter();
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [type, setType] = useState<TimeOffType>("VACATION");
  const [reason, setReason] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const summary = start && end ? leaveSummary(start, end, workingDays, companyHolidays) : null;
  const validation = summary?.error || (start && end && hasOverlap(start, end, existingRequests) ? "Ovaj period se preklapa sa vašim zahtevom na čekanju ili odobrenim odsustvom." : "") || (summary && summary.workingDays === 0 ? "Izabrani period ne sadrži radne dane prema pravilima firme." : "") || (summary && summary.workingDays > availableDays ? "Nemate dovoljno raspoloživih dana za izabrani period." : "");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (validation || !summary) return;
    setPending(true); setError("");
    const data = new FormData();
    data.set("startDate", start); data.set("endDate", end); data.set("type", type); data.set("reason", reason);
    try {
      const result = await createTimeOffRequest(data);
      if (!result.success) { setError(result.error); return; }
      toast.success("Zahtev je poslat na odobrenje.");
      router.push("/employee/my-requests"); router.refresh();
    } catch { setError("Zahtev nije poslat. Proverite vezu i pokušajte ponovo."); }
    finally { setPending(false); }
  }
  return <div className="page-stack">
    <PageHeader title="Isplanirajte svoje odsustvo." description="Izaberite period. Mi ćemo izračunati radne dane prema pravilima vaše firme." back={{ href: "/employee", label: "Nazad na pregled" }} />
    <form onSubmit={submit} className="grid items-start gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div className="surface space-y-7 p-5 sm:p-7">
        <fieldset disabled={pending}><legend className="mb-3 text-sm font-semibold">Vrsta odsustva</legend><div className="grid grid-cols-1 gap-2 min-[380px]:grid-cols-2">{Object.entries(leaveTypes).map(([value, label]) => <label key={value} className={"flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors " + (type === value ? "border-primary bg-secondary text-primary" : "hover:bg-muted")}><input type="radio" name="type" value={value} checked={type === value} onChange={() => setType(value as TimeOffType)} className="size-4 accent-primary" />{label}</label>)}</div></fieldset>
        <fieldset disabled={pending} className="grid gap-4 sm:grid-cols-2"><legend className="sr-only">Period odsustva</legend><div><label htmlFor="start-date" className="field-label">Prvi dan odsustva</label><Input id="start-date" name="startDate" type="date" min={todayKey()} required value={start} onChange={event => { setStart(event.target.value); if (!end || end < event.target.value) setEnd(event.target.value); setError(""); }} /></div><div><label htmlFor="end-date" className="field-label">Poslednji dan odsustva</label><Input id="end-date" name="endDate" type="date" min={start || todayKey()} required value={end} onChange={event => { setEnd(event.target.value); setError(""); }} /></div></fieldset>
        <div><label htmlFor="reason" className="field-label">Napomena <span className="font-normal text-muted-foreground">(opciono)</span></label><Textarea id="reason" name="reason" maxLength={2000} rows={4} disabled={pending} value={reason} onChange={event => setReason(event.target.value)} placeholder="Dodajte informaciju koja će pomoći pri odluci." /><p className="mt-2 text-xs text-muted-foreground">Napomenu vidi administrator koji obrađuje vaš zahtev.</p></div>
        <div className="flex gap-3 rounded-xl bg-muted p-4 text-sm"><Info className="mt-0.5 size-4 shrink-0 text-primary" /><div><p className="font-medium">Obračun prema pravilima firme</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">Radni dani: {weekdays.filter(day => workingDays.includes(day.id)).map(day => day.short).join(", ") || "nisu podešeni"}. Neradni dani i praznici firme automatski se izuzimaju.</p></div></div>
      </div>
      <aside className="surface p-5 sm:p-7 lg:sticky lg:top-24">
        <div className="flex items-center gap-3"><CalendarDays className="size-5 text-primary" /><h2 className="section-title">Pregled zahteva</h2></div>
        <dl className="mt-6 space-y-4 text-sm"><div className="flex justify-between gap-3"><dt className="text-muted-foreground">Trenutno raspoloživo</dt><dd className="font-semibold">{availableDays} {daysLabel(availableDays)}</dd></div><div className="flex justify-between gap-3"><dt className="text-muted-foreground">Kalendarski dani</dt><dd>{summary && !summary.error ? summary.totalDays : "—"}</dd></div><div className="flex justify-between gap-3"><dt className="text-muted-foreground">Izuzeti neradni dani</dt><dd>{summary && !summary.error ? summary.excludedDays : "—"}</dd></div><div className="flex items-center justify-between gap-3 border-t pt-4"><dt className="font-medium">Dani za obračun</dt><dd className="text-2xl font-semibold text-primary">{summary && !summary.error ? summary.workingDays : "—"}</dd></div>{summary && !validation && <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Nakon odobrenja</dt><dd className="font-semibold">{availableDays - summary.workingDays} {daysLabel(availableDays - summary.workingDays)}</dd></div>}</dl>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">Dani se oduzimaju tek nakon odobrenja. Drugi zahtevi na čekanju nisu uključeni u ovaj pregled.</p>
        {(validation || error) && <p role="alert" className="mt-5 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{validation || error}</p>}
        <Button type="submit" disabled={pending || !summary || !!validation} className="mt-6 w-full">{pending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}{pending ? "Slanje zahteva..." : "Pošalji zahtev"}</Button>
        <Button variant="ghost" asChild className="mt-2 w-full"><Link href="/employee">Odustani</Link></Button>
      </aside>
    </form>
  </div>;
}
