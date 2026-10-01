"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Info, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateCompanyWorkingDays } from "@/lib/actions/admin-actions";
import { weekdays } from "@/lib/time-off";
import { toast } from "sonner";
export default function CompanyWorkingDaysForm({
  initialWorkingDays,
}: {
  initialWorkingDays: string[];
}) {
  const router = useRouter();
  const [days, setDays] = useState(initialWorkingDays);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function save() {
    setPending(true);
    setError("");
    try {
      await updateCompanyWorkingDays(days);
      toast.success("Radna nedelja je sačuvana.");
      router.refresh();
    } catch {
      setError("Izmena nije sačuvana. Pokušajte ponovo.");
    } finally {
      setPending(false);
    }
  }
  return (
    <section className="surface max-w-3xl space-y-6 p-5 sm:p-7">
      <div>
        <h2 className="section-title">Koji dani su radni?</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Označeni dani ulaze u obračun odsustva. Praznici se dodatno izuzimaju.
        </p>
      </div>
      <fieldset disabled={pending} className="grid gap-2 sm:grid-cols-2">
        <legend className="sr-only">Radni dani firme</legend>
        {weekdays.map((day) => (
          <label
            key={day.id}
            className={
              "flex min-h-14 cursor-pointer items-center justify-between gap-3 rounded-xl border px-4 text-sm " +
              (days.includes(day.id)
                ? "border-primary bg-secondary text-primary"
                : "hover:bg-muted")
            }
          >
            <span>{day.label}</span>
            <input
              type="checkbox"
              checked={days.includes(day.id)}
              onChange={() =>
                setDays((current) =>
                  current.includes(day.id)
                    ? current.filter((value) => value !== day.id)
                    : [...current, day.id],
                )
              }
              className="size-5 accent-primary"
            />
          </label>
        ))}
      </fieldset>
      <div className="flex gap-3 rounded-xl bg-muted p-4 text-xs leading-relaxed text-muted-foreground">
        <Info className="size-4 shrink-0" />
        Promena važi za nove zahteve. Dani u ranije poslatim zahtevima ostaju
        nepromenjeni.
      </div>
      {days.length === 0 && (
        <p role="alert" className="text-sm text-destructive">
          Izaberite najmanje jedan radni dan.
        </p>
      )}
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <div className="form-actions">
        <Button onClick={save} disabled={pending || days.length === 0}>
          {pending && <Loader2 className="size-4 animate-spin" />}
          {pending ? "Čuvanje..." : "Sačuvaj radnu nedelju"}
        </Button>
      </div>
    </section>
  );
}
