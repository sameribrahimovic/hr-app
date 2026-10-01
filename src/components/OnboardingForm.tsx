"use client";
import { useState } from "react";
import { useUser, useSession } from "@clerk/nextjs";
import { Building2, Users, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { completeOnboarding } from "@/lib/actions/onboarding";
export default function OnboardingForm({ userEmail, firstName, lastName, initialMode = "employee" }: { userEmail: string; firstName: string; lastName: string; initialMode?: "admin" | "employee" }) {
  const { user } = useUser();
  const { session } = useSession();
  const [mode, setMode] = useState(initialMode);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setPending(true); setError("");
    const values = new FormData(event.currentTarget);
    try {
      const result = await completeOnboarding({ accountType: mode, firstName: String(values.get("firstName") || ""), lastName: String(values.get("lastName") || ""), companyName: String(values.get("companyName") || ""), department: String(values.get("department") || ""), invitationCode: String(values.get("invitationCode") || "") });
      if (!result.success) { setError(result.error); return; }
      await user?.reload(); await session?.getToken({ skipCache: true });
      window.location.assign(result.role === "ADMIN" ? "/admin" : "/employee");
    } catch { setError("Podešavanje nije završeno. Proverite vezu i pokušajte ponovo."); } finally { setPending(false); }
  }
  return <form onSubmit={submit} className="surface space-y-6 p-5 sm:p-7"><fieldset disabled={pending} className="space-y-6"><legend className="sr-only">Podešavanje naloga</legend>
    <div className="grid gap-2 sm:grid-cols-2">{[{ value: "employee" as const, label: "Imam pozivni kod", icon: Users }, { value: "admin" as const, label: "Kreiram firmu", icon: Building2 }].map(item => <label key={item.value} className={"flex min-h-16 cursor-pointer items-center gap-2 rounded-xl border px-3 py-3 text-sm font-medium " + (mode === item.value ? "border-primary bg-secondary text-primary" : "hover:bg-muted")}><input type="radio" name="accountType" value={item.value} checked={mode === item.value} onChange={() => { setMode(item.value); setError(""); }} className="size-4 accent-primary" /><item.icon className="size-4 shrink-0" />{item.label}</label>)}</div>
    <div className="rounded-xl bg-muted px-4 py-3"><p className="text-xs text-muted-foreground">Vaš nalog</p><p className="mt-1 break-all text-sm">{userEmail}</p></div>
    <div className="grid gap-4 sm:grid-cols-2"><div><label htmlFor="first-name" className="field-label">Ime</label><Input id="first-name" name="firstName" defaultValue={firstName} required maxLength={55} autoComplete="given-name" /></div><div><label htmlFor="last-name" className="field-label">Prezime</label><Input id="last-name" name="lastName" defaultValue={lastName} required maxLength={55} autoComplete="family-name" /></div></div>
    {mode === "admin" ? <div><label htmlFor="company-name" className="field-label">Naziv firme</label><Input id="company-name" name="companyName" required maxLength={100} autoComplete="organization" placeholder="Kako se zove vaš tim?" /><p className="mt-2 text-xs leading-relaxed text-muted-foreground">Radnu nedelju, praznike i ostale podatke možete podesiti nakon kreiranja.</p></div> : <><div><label htmlFor="invitation-code" className="field-label">Pozivni kod</label><Input id="invitation-code" name="invitationCode" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} minLength={6} required autoComplete="off" placeholder="Šest cifara" className="tracking-[0.15em]" /><p className="mt-2 text-xs text-muted-foreground">Kod dobijate od administratora svoje firme.</p></div><div><label htmlFor="department" className="field-label">Odeljenje <span className="font-normal text-muted-foreground">(opciono)</span></label><Input id="department" name="department" maxLength={100} placeholder="Npr. Razvoj ili Prodaja" /></div></>}
    </fieldset>{error && <p role="alert" className="rounded-xl bg-destructive/5 p-3 text-sm text-destructive">{error}</p>}<Button type="submit" className="w-full" disabled={pending}>{pending && <Loader2 className="size-4 animate-spin" />}{pending ? "Podešavanje naloga..." : mode === "admin" ? "Kreiraj firmu" : "Pridruži se timu"}</Button>
  </form>;
}
