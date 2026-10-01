"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Code } from "@prisma/client";
import { Copy, Check, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { generateInvitationCode } from "@/lib/actions/admin-actions";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
export default function InvitationCodes({ initialCodes }: { initialCodes: Code[] }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [copied, setCopied] = useState("");
  const [error, setError] = useState("");
  async function generate() {
    setPending(true); setError("");
    try { await generateInvitationCode(); toast.success("Pozivni kod je kreiran."); router.refresh(); }
    catch { setError("Kod nije kreiran. Pokušajte ponovo."); } finally { setPending(false); }
  }
  async function copy(code: string) {
    try { await navigator.clipboard.writeText(code); setCopied(code); toast.success("Kod je kopiran."); }
    catch { toast.error("Kopiranje nije dostupno. Označite i kopirajte kod ručno."); }
  }
  const active = initialCodes.filter(code => !code.used);
  const used = initialCodes.filter(code => code.used);
  return <div className="page-stack"><PageHeader title="Pozovite svoj tim." description="Kreirajte jednokratni kod i prosledite ga zaposlenom." back={{ href: "/admin/employees", label: "Nazad na tim" }} action={<Button onClick={generate} disabled={pending}>{pending ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}{pending ? "Kreiranje..." : "Kreiraj pozivni kod"}</Button>} />
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    <div className="grid items-start gap-6 lg:grid-cols-[1.4fr_1fr]"><section className="surface"><div className="flex items-center justify-between border-b p-5"><h2 className="section-title">Aktivni kodovi</h2><span className="text-sm text-muted-foreground">{active.length}</span></div>{active.length ? <ul className="divide-y">{active.map(code => <li key={code.id} className="flex flex-wrap items-center justify-between gap-3 p-5"><div><p className="select-all font-mono text-xl font-semibold tracking-[0.2em]">{code.code}</p><p className="mt-1 text-xs text-muted-foreground">Kreiran {formatDate(code.createdAt)}</p></div><Button variant="outline" onClick={() => copy(code.code)} aria-label={"Kopiraj kod " + code.code}>{copied === code.code ? <Check className="size-4" /> : <Copy className="size-4" />}{copied === code.code ? "Kopirano" : "Kopiraj"}</Button></li>)}</ul> : <EmptyState title="Spremni za novog člana?" description="Kreirajte prvi kod i pozovite zaposlenog da se pridruži firmi." />}</section><aside className="rounded-2xl bg-secondary p-6"><h2 className="section-title">Tri koraka do vašeg tima</h2><ol className="mt-5 space-y-5">{["Kreirajte kod za jednog zaposlenog.", "Prosledite mu kod i link do TimeOffer aplikacije.", "Zaposleni pravi nalog i unosi kod pri pridruživanju."].map((text, i) => <li key={text} className="flex gap-3 text-sm leading-relaxed"><span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-card text-xs font-semibold text-primary">{i + 1}</span>{text}</li>)}</ol><p className="mt-6 border-t border-primary/20 pt-4 text-xs leading-relaxed text-secondary-foreground">Svaki kod može da iskoristi samo jedna osoba.</p></aside></div>
    {used.length > 0 && <details className="surface p-5"><summary className="cursor-pointer text-sm font-medium">Iskorišćeni kodovi ({used.length})</summary><ul className="mt-4 flex flex-wrap gap-2">{used.map(code => <li key={code.id} className="rounded-lg bg-muted px-3 py-2 font-mono text-sm text-muted-foreground">{code.code}</li>)}</ul></details>}
  </div>;
}
