"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { updateEmployeeAllowance } from "@/lib/actions/admin-actions";
import { toast } from "sonner";
export default function AllowanceForm({
  employeeId,
  employeeName,
  currentAllowance,
}: {
  employeeId: string;
  employeeName: string;
  currentAllowance: number;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [allowance, setAllowance] = useState(String(currentAllowance));
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      await updateEmployeeAllowance({
        employeeId,
        availableDays: Number(allowance),
      });
      toast.success("Raspoloživi dani su ažurirani.");
      setOpen(false);
      router.refresh();
    } catch {
      setError(
        "Izmena nije sačuvana. Unesite ceo broj od 0 do 366 i pokušajte ponovo.",
      );
    } finally {
      setPending(false);
    }
  }
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!pending) {
          setOpen(value);
          setAllowance(String(currentAllowance));
          setError("");
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          aria-label={"Uredi dane: " + employeeName}
        >
          Uredi dane
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Raspoloživi dani</DialogTitle>
          <DialogDescription>{employeeName}</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-5">
          <div>
            <label htmlFor={"allowance-" + employeeId} className="field-label">
              Novo raspoloživo stanje
            </label>
            <Input
              id={"allowance-" + employeeId}
              type="number"
              inputMode="numeric"
              min={0}
              max={366}
              step={1}
              required
              value={allowance}
              disabled={pending}
              onChange={(event) => setAllowance(event.target.value)}
            />
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Unesite ukupno preostalo stanje. Ova vrednost zamenjuje trenutnih{" "}
              {currentAllowance} dana.
            </p>
          </div>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={pending}
              onClick={() => setOpen(false)}
            >
              Odustani
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Čuvanje..." : "Sačuvaj stanje"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
